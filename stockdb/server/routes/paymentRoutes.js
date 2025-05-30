const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticateToken = require('../middleware/authMiddleware');
const { authorizeOperation } = require('../middleware/authorizeMiddleware');
const { checkResourceOwnership, checkCustomerAccess } = require('../middleware/resourceAccessMiddleware');

// Create a new payment (Admin, Staff, Customer)
router.post('/', authenticateToken, authorizeOperation('payment:create'), paymentController.createPayment);

// Get all payments (Admin, Staff only)
router.get('/', authenticateToken, authorizeOperation('payment:read'), paymentController.getAllPayments);

// Get a specific payment by ID (Admin, Staff can view any, Customer can view their own)
router.get('/:id', authenticateToken, authorizeOperation('payment:read'), checkResourceOwnership('payment'), paymentController.getPaymentById);

// Get payments for a specific customer (Admin, Staff can view any, Customer can view their own)
router.get('/customer/:customerId', authenticateToken, authorizeOperation('payment:read'), checkCustomerAccess, paymentController.getPaymentsForCustomer);

// Get payments for a specific order (requires authentication, authorization to view only own orders' payments or if Admin/Staff)
router.get('/order/:orderId', authenticateToken, authorizeOperation('payment:read'), checkResourceOwnership('order'), paymentController.getPaymentsForOrder);

module.exports = router;