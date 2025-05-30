const db = require('../config/db');

const createOrder = async ({ supplier_id, customer_id, order_date, delivery_estimated, order_status, revenue, items }) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Insert into the "order" table
    const orderResult = await client.query(
      'INSERT INTO "order" (supplier_id, customer_id, order_date, delivery_estimated, order_status, revenue) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, order_date, order_status, revenue',
      [supplier_id, customer_id, order_date, delivery_estimated, order_status, revenue]
    );
    const newOrder = orderResult.rows[0];
    const orderId = newOrder.id;

    // Insert items into the order_item table
    for (const item of items) {
      await client.query(
        'INSERT INTO order_item (order_id, sku, quantity) VALUES ($1, $2, $3)',
        [orderId, item.sku, item.quantity]
      );
      // Potentially update inventory here - this adds complexity, maybe do in controller/service later
    }

    await client.query('COMMIT');
    return newOrder; // Return the created order details
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getOrderById = async (orderId) => {
  // Get basic order details
  const orderResult = await db.query('SELECT * FROM "order" WHERE id = $1', [orderId]);
  const order = orderResult.rows[0];

  if (!order) {
    return null; // Order not found
  }

  // Get order items for this order
  const itemsResult = await db.query(
    'SELECT oi.sku, oi.quantity, p.product_name, p.price FROM order_item oi JOIN product p ON oi.sku = p.sku WHERE oi.order_id = $1',
    [orderId]
  );
  order.items = itemsResult.rows; // Attach items to the order object

  return order;
};

const getOrdersForCustomer = async (customerId) => {
  // Get all orders for a specific customer
  const ordersResult = await db.query('SELECT * FROM "order" WHERE customer_id = $1 ORDER BY order_date DESC', [customerId]);
  const orders = ordersResult.rows;

  // For each order, get its items
  for (const order of orders) {
    const itemsResult = await db.query(
      'SELECT oi.sku, oi.quantity, p.product_name, p.price FROM order_item oi JOIN product p ON oi.sku = p.sku WHERE oi.order_id = $1',
      [order.id]
    );
    order.items = itemsResult.rows; // Attach items to each order object
  }

  return orders;
};

const getAllOrders = async () => {
    // Get all orders for administrative view
    const ordersResult = await db.query('SELECT * FROM "order" ORDER BY order_date DESC');
    const orders = ordersResult.rows;

    // For each order, get its items
    for (const order of orders) {
        const itemsResult = await db.query(
            'SELECT oi.sku, oi.quantity, p.product_name, p.price FROM order_item oi JOIN product p ON oi.sku = p.sku WHERE oi.order_id = $1',
            [order.id]
        );
        order.items = itemsResult.rows; // Attach items to each order object
    }

    return orders;
};

// Note: Update and Delete Order functions would be more complex due to order_items and potentially payments/inventory
// We can add them later if needed, considering business logic around order states.

module.exports = {
  createOrder,
  getOrderById,
  getOrdersForCustomer,
    getAllOrders,
}; 