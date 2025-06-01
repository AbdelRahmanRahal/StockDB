const db = require('../config/db');

const getAllSuppliers = async () => {
  const result = await db.query('SELECT * FROM supplier ORDER BY supplier_name');
  return result.rows;
};

const getSupplierById = async (supplierId) => {
  const result = await db.query('SELECT * FROM supplier WHERE id = $1', [supplierId]);
  return result.rows[0];
};

const createSupplier = async ({ supplier_name, contact_information }) => {
  const result = await db.query(
    'INSERT INTO supplier (supplier_name, contact_information) VALUES ($1, $2) RETURNING *',
    [supplier_name, contact_information]
  );
  return result.rows[0];
};

const updateSupplier = async (supplierId, { supplier_name, contact_information }) => {
  const result = await db.query(
    'UPDATE supplier SET supplier_name = $1, contact_information = $2 WHERE id = $3 RETURNING *',
    [supplier_name, contact_information, supplierId]
  );
  return result.rows[0];
};

const deleteSupplier = async (supplierId) => {
  const result = await db.query('DELETE FROM supplier WHERE id = $1 RETURNING *', [supplierId]);
  return result.rows[0];
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
}; 