const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authenticateToken = require('../middleware/authMiddleware');
const { authorizeOperation } = require('../middleware/authorizeMiddleware');
const { checkSupplierAccess } = require('../middleware/resourceAccessMiddleware');

// Supplier routes

// Create a new supplier (Admin/Staff only)
router.post('/', authenticateToken, authorizeOperation('supplier:create'), supplierController.createSupplier);

// Get all suppliers (Admin/Staff only)
router.get('/', authenticateToken, authorizeOperation('supplier:read'), supplierController.getAllSuppliers);

// Get a specific supplier by ID (Admin/Staff can view any, Supplier can view their own)
router.get('/:id', authenticateToken, authorizeOperation('supplier:read'), checkSupplierAccess, supplierController.getSupplierById);

// Update a supplier (Admin/Staff can update any, Supplier can update their own)
router.put('/:id', authenticateToken, authorizeOperation('supplier:update'), checkSupplierAccess, supplierController.updateSupplier);

// Delete a supplier (Admin/Staff only)
router.delete('/:id', authenticateToken, authorizeOperation('supplier:delete'), supplierController.deleteSupplier);

// Get supplier's products (public access)
router.get('/:id/products', supplierController.getSupplierProducts);

// Get supplier's orders (Admin/Staff can view any, Supplier can view their own)
router.get('/:id/orders', authenticateToken, authorizeOperation('order:read'), checkSupplierAccess, supplierController.getSupplierOrders);

// Get supplier's payments (Admin/Staff can view any, Supplier can view their own)
router.get('/:id/payments', authenticateToken, authorizeOperation('payment:read'), checkSupplierAccess, supplierController.getSupplierPayments);

// Supplier performance metrics (Admin/Staff only)
router.get('/:id/metrics', authenticateToken, authorizeOperation('supplier:read'), supplierController.getSupplierMetrics);

module.exports = router; 