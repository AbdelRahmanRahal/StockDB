const express = require('express');
const jwt = require('jsonwebtoken');
const client = require('../config/db');

const dataRouter = express.Router();

// ─── Middleware to verify JWT Bearer token ───
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
    req.user = decoded; // decoded = { id, email, userType, iat, exp }
    next();
  });
}

// ─── GET /api/dev-suppliers ─────────────────────────────────────────────────
// Returns a simple array of all suppliers: [{ id, supplier_name }, ...]
// Frontend (AddItemForm.jsx) uses this to populate the “Supplier” <select>:
dataRouter.get('/dev-suppliers', verifyToken, async (req, res) => {
  try {
    const sql = `
      SELECT 
        id, 
        supplier_name 
      FROM supplier
      ORDER BY supplier_name;
    `;
    const result = await client.query(sql);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('[DEV GET SUPPLIERS ERROR]', err);
    return res.status(500).json({ error: 'Internal server error (dev).' });
  }
});

// ─── GET /api/dev-items ─────────────────────────────────────────────────────
// Returns an array of inventory “items” by joining product + inventory.
// Each object looks like: { sku, product_name, price, stock_level }.
// DashboardPage.jsx → getAllItems() → fills <ItemList/>:
dataRouter.get('/dev-items', verifyToken, async (req, res) => {
  try {
    const sql = `
      SELECT 
        p.sku, 
        p.product_name, 
        p.price, 
        i.stock_level
      FROM product p
      JOIN inventory i ON p.sku = i.sku
      ORDER BY p.product_name;
    `;
    const result = await client.query(sql);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('[DEV GET ITEMS ERROR]', err);
    return res.status(500).json({ error: 'Internal server error (dev).' });
  }
});

// ─── POST /api/dev-items ────────────────────────────────────────────────────
// Expects JSON body:
//   {
//     sku: string,
//     product_name: string,
//     description: string (optional),
//     price: number,
//     stock_level: number,
//     supplier_id: integer (nullable)
//   }
// 1) BEGIN TRANSACTION
// 2) INSERT INTO product (...) sku, product_name, description, price, supplier_id
// 3) INSERT INTO inventory (sku, stock_level)
// 4) COMMIT
// 5) Return the newly inserted row as JSON.
//
// AddItemForm.jsx calls createItem(payload) → on success, the
// new item appears in state (so <ItemList/> updates automatically).
dataRouter.post('/dev-items', verifyToken, async (req, res) => {
  const {
    sku,
    product_name,
    description = null,
    price,
    stock_level,
    supplier_id = null,
  } = req.body;

  // Basic validation (you can expand if desired):
  if (!sku || !product_name || price == null || stock_level == null) {
    return res
      .status(400)
      .json({ error: 'sku, product_name, price, and stock_level are required.' });
  }

  try {
    await client.query('BEGIN');

    // 1) Insert into product
    const insertProductSql = `
      INSERT INTO product 
        (sku, product_name, description, price, supplier_id)
      VALUES 
        ($1, $2, $3, $4, $5)
      RETURNING sku, product_name, description, price, supplier_id;
    `;
    const insertProductVals = [
      sku,
      product_name,
      description,
      price,
      supplier_id,
    ];
    const prodRes = await client.query(insertProductSql, insertProductVals);

    // 2) Insert into inventory
    const insertInvSql = `
      INSERT INTO inventory 
        (sku, stock_level)
      VALUES 
        ($1, $2)
      RETURNING inventory_id, stock_level;
    `;
    const insertInvVals = [sku, stock_level];
    const invRes = await client.query(insertInvSql, insertInvVals);

    await client.query('COMMIT');

    // Merge both results to send back to frontend:
    const newProduct = prodRes.rows[0];
    const newInventory = invRes.rows[0];

    return res.status(201).json({
      sku: newProduct.sku,
      product_name: newProduct.product_name,
      description: newProduct.description,
      price: newProduct.price,
      supplier_id: newProduct.supplier_id,
      inventory_id: newInventory.inventory_id,
      stock_level: newInventory.stock_level,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[DEV CREATE ITEM ERROR]', err);
    return res.status(500).json({ error: 'Internal server error (dev).' });
  }
});

// ─── POST /api/dev-suppliers ────────────────────────────────────────────────────
// Expects JSON body:
//   {
//     supplier_name: string,
//     contact_information: string
//   }
// 1) INSERT INTO supplier (supplier_name, contact_information)
// 2) Return the newly inserted supplier as JSON.
//
// Frontend can use this to add new suppliers to the system.
dataRouter.post('/dev-suppliers', verifyToken, async (req, res) => {
  const {
    supplier_name,
    contact_information
  } = req.body;

  // Basic validation
  if (!supplier_name || !contact_information) {
    return res
      .status(400)
      .json({ error: 'supplier_name and contact_information are required.' });
  }

  try {
    const sql = `
      INSERT INTO supplier 
        (supplier_name, contact_information)
      VALUES 
        ($1, $2)
      RETURNING id, supplier_name, contact_information, created_at, updated_at;
    `;
    const values = [supplier_name, contact_information];
    const result = await client.query(sql, values);

    if (result.rows.length === 0) {
      return res.status(500).json({ error: 'Failed to create supplier.' });
    }

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[DEV CREATE SUPPLIER ERROR]', err);
    
    // Handle unique constraint violation (supplier_name must be unique)
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Supplier with this name already exists.' });
    }
    
    return res.status(500).json({ error: 'Internal server error (dev).' });
  }
});

module.exports = dataRouter;