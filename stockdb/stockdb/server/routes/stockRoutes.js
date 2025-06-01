const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authenticateToken = require('../middleware/authMiddleware');
const { authorizeOperation } = require('../middleware/authorizeMiddleware');

// Get all stocks (Public access)
router.get('/', stockController.getAllStocks);

// Get stock by ID (Public access)
router.get('/:id', stockController.getStockById);

// Get stock by symbol (Public access)
router.get('/symbol/:symbol', stockController.getStockBySymbol);

// Create a new stock (Admin/Staff only)
router.post('/', authenticateToken, authorizeOperation('stock:create'), stockController.createStock);

// Update a stock (Admin/Staff only)
router.put('/:id', authenticateToken, authorizeOperation('stock:update'), stockController.updateStock);

// Delete a stock (Admin/Staff only)
router.delete('/:id', authenticateToken, authorizeOperation('stock:delete'), stockController.deleteStock);

module.exports = router;