const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authenticateToken = require('../middleware/authMiddleware');
const { authorizeOperation } = require('../middleware/authorizeMiddleware');
const { checkSupplierAccess } = require('../middleware/resourceAccessMiddleware');

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

module.exports = router;