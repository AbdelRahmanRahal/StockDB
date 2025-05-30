const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticateToken = require('../middleware/authMiddleware');
const { authorizeOperation } = require('../middleware/authorizeMiddleware');
const { checkResourceOwnership, checkCustomerAccess } = require('../middleware/resourceAccessMiddleware');

// Payment routes

// Create a new payment (Admin, Staff, Customer)
router.post('/', authenticateToken, authorizeOperation('payment:create'), paymentController.createPayment);

// Get all payments (Admin, Staff only)
router.get('/', authenticateToken, authorizeOperation('payment:read'), paymentController.getAllPayments);

// Get a specific payment by ID (Admin, Staff can view any, Customer can view their own)
router.get('/:id', authenticateToken, authorizeOperation('payment:read'), checkResourceOwnership('payment'), paymentController.getPaymentById);

// Update a payment (Admin, Staff only)
router.put('/:id', authenticateToken, authorizeOperation('payment:update'), paymentController.updatePayment);

// Refund a payment (Admin, Staff only)
router.post('/:id/refund', authenticateToken, authorizeOperation('payment:refund'), paymentController.refundPayment);

// Get payments for a specific customer (Admin, Staff can view any, Customer can view their own)
router.get('/customer/:customerId', authenticateToken, authorizeOperation('payment:read'), checkCustomerAccess, paymentController.getPaymentsByCustomer);

// Get payments for a specific order (requires authentication, authorization to view only own orders' payments or if Admin/Staff)
router.get('/order/:orderId', authenticateToken, checkOrderAccess, paymentController.getPaymentsForOrder);

// Note: Update and Delete routes/logic for payments are complex and depend on business rules and gateway integration.

module.exports = router; 