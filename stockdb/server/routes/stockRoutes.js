const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/', stockController.getAllStocks);
router.get('/:id', stockController.getStockById);
router.get('/symbol/:symbol', stockController.getStockBySymbol);
router.post('/', stockController.createStock);
router.put('/:id', stockController.updateStock);
router.delete('/:id', stockController.deleteStock);

module.exports = router; 