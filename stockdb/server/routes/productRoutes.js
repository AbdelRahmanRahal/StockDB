const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/:sku', productController.getProductBySku);
router.post('/', productController.createProduct);
router.put('/:sku', productController.updateProduct);
router.patch('/:sku/inventory', productController.updateInventory); // New route for updating inventory
router.delete('/:sku', productController.deleteProduct);

module.exports = router; 