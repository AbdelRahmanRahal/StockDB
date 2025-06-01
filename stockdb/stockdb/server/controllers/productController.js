const Product = require('../models/productModel');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductBySku = async (req, res) => {
  try {
    const product = await Product.getProductBySku(req.params.sku);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { sku, product_name, description, price, supplier_id, stock_level } = req.body;
    const newProduct = await Product.createProduct({ sku, product_name, description, price, supplier_id, stock_level });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const sku = req.params.sku;
    const { product_name, description, price, supplier_id } = req.body;
    const updatedProduct = await Product.updateProduct(sku, { product_name, description, price, supplier_id });
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    const sku = req.params.sku;
    const { stock_level } = req.body;
    const updatedInventory = await Product.updateInventory(sku, stock_level);
    if (!updatedInventory) {
      return res.status(404).json({ error: 'Inventory not found for product' });
    }
    res.json(updatedInventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const sku = req.params.sku;
    const deletedProduct = await Product.deleteProduct(sku);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product and associated inventory deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductBySku,
  createProduct,
  updateProduct,
  updateInventory,
  deleteProduct,
}; 