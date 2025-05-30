const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middleware/authMiddleware');
const { authorizeOperation } = require('../middleware/authorizeMiddleware');
const { checkProductAccess, checkInventoryAccess } = require('../middleware/resourceAccessMiddleware');

// Public route (anyone can view all products)
router.get('/', productController.getAllProducts);

// Get a specific product by SKU (Admin/Staff only)
router.get('/:sku', authenticateToken, authorizeOperation('product:read'), productController.getProductBySku);

// Create a new product (Admin/Staff/Supplier)
router.post('/', authenticateToken, authorizeOperation('product:create'), productController.createProduct);

// Update a product by SKU (Admin/Staff/Supplier, Supplier can only update their own)
router.put('/:sku', authenticateToken, authorizeOperation('product:update'), checkProductAccess, productController.updateProduct);

// Patch product inventory by SKU (Admin/Staff only)
router.patch('/:sku/inventory', authenticateToken, authorizeOperation('inventory:update'), productController.updateInventory);

// Delete a product by SKU (Admin/Staff only)
router.delete('/:sku', authenticateToken, authorizeOperation('product:delete'), productController.deleteProduct);

module.exports = router;