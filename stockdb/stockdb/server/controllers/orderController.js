const Order = require('../models/orderModel');

const createOrder = async (req, res) => {
  try {
    const { supplier_id, customer_id, order_date, delivery_estimated, order_status, revenue, items } = req.body;
    // In a real application, you would likely get customer_id from the authenticated user's token
    // and potentially validate supplier_id, product SKUs, and calculate revenue based on product prices.
    const newOrder = await Order.createOrder({ supplier_id, customer_id, order_date, delivery_estimated, order_status, revenue, items });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    // In a real application, you would add authorization here to ensure a user can only view their own orders,
    // unless they are an Admin or Staff.
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrdersForCustomer = async (req, res) => {
    try {
        const customerId = req.params.customerId; // Assuming customer ID is passed as a route parameter or obtained from token
        // In a real application, ensure requested customerId matches authenticated user's ID unless Admin/Staff
        const orders = await Order.getOrdersForCustomer(customerId);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        // This endpoint would typically be for Admin/Staff only, enforced by middleware
        const orders = await Order.getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Note: Controller functions for updating/deleting orders would be more complex and depend on business rules.
// We can add them later if needed.

module.exports = {
  createOrder,
  getOrderById,
  getOrdersForCustomer,
    getAllOrders,
}; 