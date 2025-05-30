const Stock = require('../models/stockModel');

const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.getAllStocks();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStockById = async (req, res) => {
  try {
    const stock = await Stock.getStockById(req.params.id);
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStockBySymbol = async (req, res) => {
  try {
    const stock = await Stock.getStockBySymbol(req.params.symbol);
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStock = async (req, res) => {
  try {
    const { symbol, company_name, sector, industry } = req.body;
    const newStock = await Stock.createStock({ symbol, company_name, sector, industry });
    res.status(201).json(newStock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const { symbol, company_name, sector, industry } = req.body;
    const updatedStock = await Stock.updateStock(req.params.id, { symbol, company_name, sector, industry });
    if (!updatedStock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json(updatedStock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStock = async (req, res) => {
  try {
    const deletedStock = await Stock.deleteStock(req.params.id);
    if (!deletedStock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStocks,
  getStockById,
  getStockBySymbol,
  createStock,
  updateStock,
  deleteStock
}; 