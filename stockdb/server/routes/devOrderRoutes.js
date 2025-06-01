/**
 * Dev‐only routes for customer orders:
 *  • GET  /api/dev-orders   → returns all orders for the logged‐in customer, each with items
 *  • POST /api/dev-orders   → creates a new order (with multiple items) in one transaction
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const orderRouter = express.Router();

// ─── Middleware to verify JWT “Bearer {token}” ───────────────────────────────
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

    // 2) For each order, fetch its items
    //    We can batch‐fetch all order_items + product_name in one go:
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
 *  • Body: { supplier_id: number, items: [ { sku: string, quantity: number }, … ] }
 *  • Creates one new row in "order", then one row per item in `order_item`, all inside a TXN.
 *  • Automatically computes `order_date = now()`, `order_status = 'Pending'`, 
 *    and `revenue = SUM(price * quantity)` by querying `product.price`.
 *  • Returns the newly created order ID and full order details.
 */
orderRouter.post('/dev-orders', verifyToken, async (req, res) => {
  const { id: userId, userType } = req.user;
  if (userType !== 'Customer') {
    return res.status(403).json({ error: 'Only customers can place orders.' });
  }

  const { supplier_id, items } = req.body;
  // Basic validation
  if (!supplier_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'supplier_id and non-empty items[] are required.' });
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

    // 1) Compute total revenue by summing price * quantity
    const skus = items.map((it) => it.sku);
    // Fetch all prices for these SKUs
    const pricesSql = `
      SELECT sku, price
      FROM product
      WHERE sku = ANY($1);
    `;
    const pricesRes = await pool.query(pricesSql, [skus]);
    const priceMap = {};
    for (const row of pricesRes.rows) {
      priceMap[row.sku] = parseFloat(row.price);
    }
    // Ensure every SKU has a price
    for (const it of items) {
      if (!(it.sku in priceMap)) {
        await pool.query('ROLLBACK');
        return res
          .status(400)
          .json({ error: `Product with SKU '${it.sku}' not found.` });
      }
    }
    // Sum up
    let totalRevenue = 0;
    for (const it of items) {
      totalRevenue += priceMap[it.sku] * it.quantity;
    }

    // 2) Insert into "order"
    const insertOrderSql = `
      INSERT INTO "order"
        (supplier_id, customer_id, order_date, delivery_estimated, received_date, order_status, revenue)
      VALUES
        ($1, $2, CURRENT_TIMESTAMP, NULL, NULL, 'Pending', $3)
      RETURNING id, order_date, order_status, revenue;
    `;
    const insertOrderRes = await pool.query(insertOrderSql, [
      supplier_id,
      userId,
      totalRevenue,
    ]);
    const newOrder = insertOrderRes.rows[0]; // { id, order_date, order_status, revenue }

    // 3) Insert each item into order_item
    const insertItemSql = `
      INSERT INTO order_item
        (order_id, sku, quantity)
      VALUES
        ($1, $2, $3);
    `;
    for (const it of items) {
      await pool.query(insertItemSql, [newOrder.id, it.sku, it.quantity]);
    }

    await pool.query('COMMIT');

    // 4) Build the response: include newOrder fields + items array with product_name & price
    const detailedItems = items.map((it) => ({
      sku: it.sku,
      quantity: it.quantity,
      product_name: '(will fetch client-side)', // or you can query product_name again
      price: priceMap[it.sku],
    }));

    return res.status(201).json({
      order: {
        id: newOrder.id,
        order_date: newOrder.order_date,
        order_status: newOrder.order_status,
        revenue: newOrder.revenue,
        items: detailedItems,
      },
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('[DEV CREATE ORDER ERROR]', err);
    return res.status(500).json({ error: 'Internal server error (dev).' });
  }
});

module.exports = orderRouter;
