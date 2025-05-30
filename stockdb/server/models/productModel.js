const db = require('../config/db');

const getAllProducts = async () => {
  const result = await db.query('SELECT p.*, i.stock_level FROM product p JOIN inventory i ON p.sku = i.sku ORDER BY p.product_name');
  return result.rows;
};

const getProductBySku = async (sku) => {
  const result = await db.query('SELECT p.*, i.stock_level FROM product p JOIN inventory i ON p.sku = i.sku WHERE p.sku = $1', [sku]);
  return result.rows[0];
};

const createProduct = async ({ sku, product_name, description, price, supplier_id, stock_level }) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const productResult = await client.query(
      'INSERT INTO product (sku, product_name, description, price, supplier_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [sku, product_name, description, price, supplier_id]
    );
    const newProduct = productResult.rows[0];

    await client.query(
      'INSERT INTO inventory (sku, stock_level) VALUES ($1, $2)',
      [sku, stock_level]
    );

    await client.query('COMMIT');
    return newProduct;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const updateProduct = async (sku, { product_name, description, price, supplier_id }) => {
  const result = await db.query(
    'UPDATE product SET product_name = $1, description = $2, price = $3, supplier_id = $4 WHERE sku = $5 RETURNING *',
    [product_name, description, price, supplier_id, sku]
  );
  return result.rows[0];
};

const updateInventory = async (sku, stock_level) => {
  const result = await db.query(
    'UPDATE inventory SET stock_level = $1 WHERE sku = $2 RETURNING *',
    [stock_level, sku]
  );
  return result.rows[0];
};

const deleteProduct = async (sku) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    // Delete related inventory first due to foreign key constraint
    await client.query('DELETE FROM inventory WHERE sku = $1', [sku]);
    const productResult = await client.query('DELETE FROM product WHERE sku = $1 RETURNING *', [sku]);
    await client.query('COMMIT');
    return productResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getAllProducts,
  getProductBySku,
  createProduct,
  updateProduct,
  updateInventory,
  deleteProduct,
}; 