const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticateToken = require('../middleware/authMiddleware');
const { authorizeOperation } = require('../middleware/authorizeMiddleware');
const { checkResourceOwnership, checkCustomerAccess } = require('../middleware/resourceAccessMiddleware');

// Report routes

// Create a new report (Admin/Staff only)
router.post('/', authenticateToken, authorizeOperation('report:create'), reportController.createReport);

// Get all reports (Admin/Staff only)
router.get('/', authenticateToken, authorizeOperation('report:read'), reportController.getAllReports);

// Get a specific report by ID (Admin/Staff can view any, Customer can view their own)
router.get('/:id', authenticateToken, authorizeOperation('report:read'), checkResourceOwnership('report'), reportController.getReportById);

// Get reports for a specific user (Admin/Staff can view any, Customer can view their own)
router.get('/user/:userId', authenticateToken, authorizeOperation('report:read'), checkCustomerAccess, reportController.getReportsByUser);

// Get reports by type (Admin/Staff only)
router.get('/type/:reportType', authenticateToken, authorizeOperation('report:read'), reportController.getReportsByType);

// Generate sales report (Admin/Staff only)
router.post('/generate/sales', authenticateToken, authorizeOperation('report:generate'), reportController.generateSalesReport);

// Generate inventory report (Admin/Staff/Supplier only)
router.post('/generate/inventory', authenticateToken, authorizeOperation('report:generate'), reportController.generateInventoryReport);

// Generate customer report (Admin/Staff only)
router.post('/generate/customer', authenticateToken, authorizeOperation('report:generate'), reportController.generateCustomerReport);

// Generate supplier report (Admin/Staff only)
router.post('/generate/supplier', authenticateToken, authorizeOperation('report:generate'), reportController.generateSupplierReport);

// Download report file (Admin/Staff can download any, Customer can download their own)
router.get('/:id/download', authenticateToken, authorizeOperation('report:read'), checkResourceOwnership('report'), reportController.downloadReport);

// Delete a report (Admin/Staff only)
router.delete('/:id', authenticateToken, authorizeOperation('report:delete'), reportController.deleteReport);

// Note: More complex report generation and management routes can be added later.

module.exports = router; 