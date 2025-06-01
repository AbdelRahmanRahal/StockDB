const db = require('../config/db');

const getAllStocks = async () => {
  const result = await db.query('SELECT * FROM stock ORDER BY symbol');
  return result.rows;
};

const getStockById = async (stockId) => {
  const result = await db.query('SELECT * FROM stock WHERE id = $1', [stockId]);
  return result.rows[0];
};

const getStockBySymbol = async (symbol) => {
  const result = await db.query('SELECT * FROM stock WHERE symbol = $1', [symbol]);
  return result.rows[0];
};

const createStock = async ({ symbol, company_name, sector, industry }) => {
  const result = await db.query(
    'INSERT INTO stock (symbol, company_name, sector, industry) VALUES ($1, $2, $3, $4) RETURNING *',
    [symbol, company_name, sector, industry]
  );
  return result.rows[0];
};

const updateStock = async (stockId, { symbol, company_name, sector, industry }) => {
  const result = await db.query(
    'UPDATE stock SET symbol = $1, company_name = $2, sector = $3, industry = $4 WHERE id = $5 RETURNING *',
    [symbol, company_name, sector, industry, stockId]
  );
  return result.rows[0];
};

const deleteStock = async (stockId) => {
  const result = await db.query('DELETE FROM stock WHERE id = $1 RETURNING *', [stockId]);
  return result.rows[0];
};

module.exports = {
  getAllStocks,
  getStockById,
  getStockBySymbol,
  createStock,
  updateStock,
  deleteStock
}; 