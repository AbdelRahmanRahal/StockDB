const db = require('../config/db');

const createPayment = async ({ order_id, amount, payment_date, payment_method, transaction_status, customer_id }) => {
  const result = await db.query(
    'INSERT INTO payment (order_id, amount, payment_date, payment_method, transaction_status, customer_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [order_id, amount, payment_date, payment_method, transaction_status, customer_id]
  );
  return result.rows[0];
};

const getPaymentById = async (paymentId) => {
  const result = await db.query('SELECT * FROM payment WHERE id = $1', [paymentId]);
  return result.rows[0];
};

const getPaymentsForOrder = async (orderId) => {
  const result = await db.query('SELECT * FROM payment WHERE order_id = $1 ORDER BY payment_date DESC', [orderId]);
  return result.rows;
};

const getPaymentsForCustomer = async (customerId) => {
  const result = await db.query('SELECT * FROM payment WHERE customer_id = $1 ORDER BY payment_date DESC', [customerId]);
  return result.rows;
};

const getAllPayments = async () => {
    const result = await db.query('SELECT * FROM payment ORDER BY payment_date DESC');
    return result.rows;
};

// Note: Update and Delete Payment functions might depend on payment gateway status and business logic.
// We can add them later if needed.

module.exports = {
  createPayment,
  getPaymentById,
  getPaymentsForOrder,
  getPaymentsForCustomer,
  getAllPayments,
}; 