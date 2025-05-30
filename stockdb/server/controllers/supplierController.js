const Supplier = require('../models/supplierModel');

const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.getAllSuppliers();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.getSupplierById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const { supplier_name, contact_information } = req.body;
    const newSupplier = await Supplier.createSupplier({ supplier_name, contact_information });
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const { supplier_name, contact_information } = req.body;
    const updatedSupplier = await Supplier.updateSupplier(supplierId, { supplier_name, contact_information });
    if (!updatedSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(updatedSupplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const deletedSupplier = await Supplier.deleteSupplier(supplierId);
    if (!deletedSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
}; 