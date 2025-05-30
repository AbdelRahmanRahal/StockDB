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

// Get a specific product by ID (public access)
router.get('/id/:id', productController.getProductById);

// Update a product by ID (Admin/Staff/Supplier only, and Supplier can only update their own)
router.put('/id/:id', authenticateToken, authorizeOperation('product:update'), checkProductAccess, productController.updateProduct);

// Get products by supplier (public access)
router.get('/supplier/:supplierId', productController.getProductsBySupplier);

// Inventory management routes (by product ID)
router.get('/id/:id/inventory', authenticateToken, authorizeOperation('inventory:read'), checkInventoryAccess, productController.getProductInventory);
router.put('/id/:id/inventory', authenticateToken, authorizeOperation('inventory:update'), checkInventoryAccess, productController.updateProductInventory);

// Product categories (Admin/Staff only)
router.get('/categories', authenticateToken, authorizeOperation('product:read'), productController.getCategories);
router.post('/categories', authenticateToken, authorizeOperation('product:create'), productController.createCategory);
router.put('/categories/:id', authenticateToken, authorizeOperation('product:update'), productController.updateCategory);
router.delete('/categories/:id', authenticateToken, authorizeOperation('product:delete'), productController.deleteCategory);

module.exports = router; 