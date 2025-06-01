/**
 * Dev‐only routes for generating Staff/Admin reports:
 *   • GET /api/dev-reports/summary 
 *       → returns { stockSummary, lowStock, orderStatusSummary, pendingOrders }
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const reportRouter = express.Router();

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
 * GET /api/dev-reports/summary
 *   • Only Staff/Admin can call this (we check userType).
 *   • Returns JSON with:
 *       - stockSummary: [ { sku, product_name, stock_level }, … ]
 *       - lowStock:     [ { sku, product_name, stock_level }, … ]
 *       - orderStatusSummary: [ { order_status, count }, … ]
 *       - pendingOrders: [ { id, customer_id, order_date, revenue }, … ]
 */
reportRouter.get('/dev-reports/summary', verifyToken, async (req, res) => {
  const { userType } = req.user;
  if (userType !== 'Staff' && userType !== 'Admin') {
    return res.status(403).json({ error: 'Only staff or admin can view reports.' });
  }

  try {
    // 1) stockSummary: current stock for every SKU
    const stockSql = `
      SELECT p.sku, p.product_name, i.stock_level
      FROM inventory i
      JOIN product p ON i.sku = p.sku
      ORDER BY p.sku;
    `;
    const stockRes = await pool.query(stockSql);
    const stockSummary = stockRes.rows.map((r) => ({
      sku: r.sku,
      product_name: r.product_name,
      stock_level: r.stock_level,
    }));

    // 2) lowStock: items with stock_level < 10
    const lowStockSql = `
      SELECT p.sku, p.product_name, i.stock_level
      FROM inventory i
      JOIN product p ON i.sku = p.sku
      WHERE i.stock_level < 10
      ORDER BY i.stock_level ASC;
    `;
    const lowStockRes = await pool.query(lowStockSql);
    const lowStock = lowStockRes.rows.map((r) => ({
      sku: r.sku,
      product_name: r.product_name,
      stock_level: r.stock_level,
    }));

    // 3) orderStatusSummary: counts per order_status
    const statusSql = `
      SELECT order_status, COUNT(*) AS count
      FROM "order"
      GROUP BY order_status;
    `;
    const statusRes = await pool.query(statusSql);
    const orderStatusSummary = statusRes.rows.map((r) => ({
      order_status: r.order_status,
      count: parseInt(r.count, 10),
    }));

    // 4) pendingOrders: all orders where order_status = 'Pending'
    const pendingSql = `
      SELECT id, customer_id, order_date, revenue
      FROM "order"
      WHERE order_status = 'Pending'
      ORDER BY order_date DESC;
    `;
    const pendingRes = await pool.query(pendingSql);
    const pendingOrders = pendingRes.rows.map((r) => ({
      id: r.id,
      customer_id: r.customer_id,
      order_date: r.order_date,
      revenue: parseFloat(r.revenue),
    }));

    return res.status(200).json({
      stockSummary,
      lowStock,
      orderStatusSummary,
      pendingOrders,
    });
  } catch (err) {
    console.error('[DEV REPORT SUMMARY ERROR]', err);
    return res.status(500).json({ error: 'Internal server error (dev).' });
  }
});

module.exports = reportRouter;
