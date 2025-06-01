const Payment = require('../models/paymentModel');

const createPayment = async (req, res) => {
  try {
    const { order_id, amount, payment_date, payment_method, transaction_status, customer_id } = req.body;
    // In a real application, payment processing would be more complex, involving a payment gateway.
    // You would typically get order_id and customer_id from the request context or validation.
    const newPayment = await Payment.createPayment({ order_id, amount, payment_date, payment_method, transaction_status, customer_id });
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const payment = await Payment.getPaymentById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    // Authorization logic: ensure user can only view their payments unless Admin/Staff
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPaymentsForOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId; // Assuming order ID is passed as a route parameter
        // Authorization logic: ensure user can only view payments for their orders unless Admin/Staff
        const payments = await Payment.getPaymentsForOrder(orderId);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPaymentsForCustomer = async (req, res) => {
    try {
        const customerId = req.params.customerId; // Assuming customer ID is passed as a route parameter or from token
        // Authorization logic: ensure user can only view their own payments unless Admin/Staff
        const payments = await Payment.getPaymentsForCustomer(customerId);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllPayments = async (req, res) => {
    try {
        // Typically Admin/Staff only, enforced by middleware
        const payments = await Payment.getAllPayments();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Note: Controller functions for updating/deleting payments depend on business rules and gateway integration.

module.exports = {
  createPayment,
  getPaymentById,
  getPaymentsForOrder,
  getPaymentsForCustomer,
  getAllPayments,
}; 