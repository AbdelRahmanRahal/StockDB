const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticateToken = require('../middleware/authMiddleware');
const { authorizeOperation } = require('../middleware/authorizeMiddleware');
const { checkResourceOwnership, checkCustomerAccess } = require('../middleware/resourceAccessMiddleware');

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

module.exports = router;