/**
 * Dev‐only routes for customer orders:
 *  • GET  /api/dev-orders   → returns all orders for the logged‐in customer, each with items
 *  • POST /api/dev-orders   → creates a new order (with multiple items) + payment, all in one TXN
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const orderRouter = express.Router();

// ─── Middleware to verify JWT "Bearer {token}" ───────────────────────────────
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'No token provided or malformed.' });
  }
  jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
    req.user = decoded; // { id, email, userType, ... }
    next();
  });
}

/**
 * GET /api/dev-orders
 *  • Only customers can call this (we check userType below).
 *  • Returns array of orders for that customer. Each order includes:
 *      { id, order_date, delivery_estimated, received_date, order_status, revenue,
 *        items: [ { sku, product_name, quantity, price }, … ] 
 *      }
 */
orderRouter.get('/dev-orders', verifyToken, async (req, res) => {
  const { id: userId, userType } = req.user;
  if (userType !== 'Customer') {
    return res.status(403).json({ error: 'Only customers can view orders.' });
  }

  try {
    // 1) Get all orders for this customer
    const ordersSql = `
      SELECT 
        o.id,
        o.order_date,
        o.delivery_estimated,
        o.received_date,
        o.order_status,
        o.revenue
      FROM "order" o
      WHERE o.customer_id = $1
      ORDER BY o.order_date DESC;
    `;
    const ordersRes = await pool.query(ordersSql, [userId]);
    const orders = ordersRes.rows; // array of { id, order_date, … }

    // 2) For each order, fetch its items in bulk
    const orderIds = orders.map((o) => o.id);
    if (orderIds.length === 0) {
      return res.status(200).json([]);
    }

    const itemsSql = `
      SELECT 
        oi.order_id,
        oi.sku,
        p.product_name,
        oi.quantity,
        p.price
      FROM order_item oi
      JOIN product p ON oi.sku = p.sku
      WHERE oi.order_id = ANY($1)
      ORDER BY oi.order_id;
    `;
    const itemsRes = await pool.query(itemsSql, [orderIds]);
    const allItems = itemsRes.rows; // array of { order_id, sku, product_name, quantity, price }

    // 3) Group items by order_id
    const itemsByOrder = {};
    for (const row of allItems) {
      if (!itemsByOrder[row.order_id]) {
        itemsByOrder[row.order_id] = [];
      }
      itemsByOrder[row.order_id].push({
        sku: row.sku,
        product_name: row.product_name,
        quantity: row.quantity,
        price: parseFloat(row.price),
      });
    }

    // 4) Attach items array to each order
    const ordersWithItems = orders.map((o) => ({
      ...o,
      items: itemsByOrder[o.id] || [],
    }));

    return res.status(200).json(ordersWithItems);
  } catch (err) {
    console.error('[DEV GET ORDERS ERROR]', err);
    return res.status(500).json({ error: 'Internal server error (dev).' });
  }
});

/**
 * POST /api/dev-orders
 *  • Body: { items: [ { sku: string, quantity: number }, … ] }
 *  • Creates one new row in "order", then one row per item in `order_item`, 
 *    and finally a `payment` row, all inside a TXN.
 *  • Requires that a matching `customer` row already exists.
 *  • Uses `customer.preferred_payment_method` for the payment row.
 *  • Returns the newly created order + items + payment info.
 */
orderRouter.post('/dev-orders', verifyToken, async (req, res) => {
  const { id: userId, userType } = req.user;
  if (userType !== 'Customer') {
    return res.status(403).json({ error: 'Only customers can place orders.' });
  }

  const { items } = req.body;
  // Basic validation
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Non-empty items[] is required.' });
  }
  for (const it of items) {
    if (!it.sku || typeof it.quantity !== 'number' || it.quantity < 1) {
      return res
        .status(400)
        .json({ error: 'Each item must have a valid sku and quantity >= 1.' });
    }
  }

  try {
    await pool.query('BEGIN');

    // ─── 1) Ensure a `customer` record exists for this user ──────────────────────
    const custCheckSql = `
      SELECT shipping_address, billing_address, phone_number, loyalty_points, preferred_payment_method
      FROM customer
      WHERE user_id = $1
      LIMIT 1;
    `;
    const custCheckRes = await pool.query(custCheckSql, [userId]);
    if (custCheckRes.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res
        .status(400)
        .json({ error: 'Customer profile not found. Please complete your profile first.' });
    }
    const { preferred_payment_method } = custCheckRes.rows[0];

    // ─── 2) Insert into "order" (initially without revenue) ────────────────────
    const insertOrderSql = `
      INSERT INTO "order"
        (customer_id, order_date, delivery_estimated, received_date, order_status, revenue)
      VALUES
        ($1, CURRENT_TIMESTAMP, NULL, NULL, 'Pending', 0)
      RETURNING id, order_date, order_status;
    `;
    const insertOrderRes = await pool.query(insertOrderSql, [userId]);
    const newOrder = insertOrderRes.rows[0]; // { id, order_date, order_status }

    // ─── 3) Fetch prices for all SKUs in one go ─────────────────────────────────
    const skus = items.map((it) => it.sku);
    const priceSql = `
      SELECT sku, price
      FROM product
      WHERE sku = ANY($1);
    `;
    const priceRes = await pool.query(priceSql, [skus]);
    const priceMap = {};
    for (const row of priceRes.rows) {
      priceMap[row.sku] = parseFloat(row.price);
    }
    // Validate that each SKU exists
    for (const it of items) {
      if (!(it.sku in priceMap)) {
        throw new Error(`Product with SKU '${it.sku}' not found.`);
      }
    }

    // ─── 4) Insert each item into order_item & cumulate revenue ─────────────────
    let totalRevenue = 0;
    const insertItemSql = `
      INSERT INTO order_item
        (order_id, sku, quantity, created_at)
      VALUES
        ($1, $2, $3, CURRENT_TIMESTAMP);
    `;
    for (const it of items) {
      const price = priceMap[it.sku];
      totalRevenue += price * it.quantity;
      await pool.query(insertItemSql, [newOrder.id, it.sku, it.quantity]);
    }

    // ─── 5) Update "order" row with computed revenue ───────────────────────────
    const updateOrderSql = `
      UPDATE "order"
      SET revenue = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2;
    `;
    await pool.query(updateOrderSql, [totalRevenue, newOrder.id]);
    newOrder.revenue = totalRevenue;

    // ─── 6) Create payment row using customer.preferred_payment_method ────────
    const insertPaymentSql = `
      INSERT INTO payment
        (order_id, amount, payment_date, payment_method, transaction_status, customer_id, created_at)
      VALUES
        ($1, $2, CURRENT_TIMESTAMP, $3, 'Completed', $4, CURRENT_TIMESTAMP)
      RETURNING id, amount, payment_date, payment_method, transaction_status;
    `;
    const paymentRes = await pool.query(insertPaymentSql, [
      newOrder.id,
      totalRevenue,
      preferred_payment_method,
      userId,
    ]);
    const newPayment = paymentRes.rows[0]; // { id, amount, payment_date, payment_method, transaction_status }

    await pool.query('COMMIT');

    // ─── 7) Build the response: include newOrder + detailed items + newPayment ─
    const detailedItems = [];
    const fetchProductNamesSql = `
      SELECT sku, product_name
      FROM product
      WHERE sku = ANY($1);
    `;
    const fetchProductNamesRes = await pool.query(fetchProductNamesSql, [skus]);
    for (const row of fetchProductNamesRes.rows) {
      const found = items.find((it) => it.sku === row.sku);
      if (found) {
        detailedItems.push({
          sku: found.sku,
          quantity: found.quantity,
          product_name: row.product_name,
          price: priceMap[found.sku],
        });
      }
    }

    return res.status(201).json({
      order: {
        id: newOrder.id,
        order_date: newOrder.order_date,
        order_status: newOrder.order_status,
        revenue: newOrder.revenue,
        items: detailedItems,
      },
      payment: {
        id: newPayment.id,
        amount: parseFloat(newPayment.amount),
        payment_date: newPayment.payment_date,
        payment_method: newPayment.payment_method,
        transaction_status: newPayment.transaction_status,
      },
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('[DEV CREATE ORDER ERROR]', err);
    return res.status(500).json({ error: 'Internal server error (dev).' });
  }
});

module.exports = orderRouter;
