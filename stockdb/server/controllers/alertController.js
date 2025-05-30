const Alert = require('../models/alertModel');

const createAlert = async (req, res) => {
    try {
        const { user_id, message, alert_date, is_read, severity } = req.body;
        // In a real application, alert creation would likely be triggered by system events
        // You might get user_id from the authenticated user or event data.
        const newAlert = await Alert.createAlert({ user_id, message, alert_date, is_read, severity });
        res.status(201).json(newAlert);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAlertById = async (req, res) => {
    try {
        const alertId = req.params.id;
        const alert = await Alert.getAlertById(alertId);
        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }
        // Authorization logic: ensure user can only view their own alerts unless Admin/Staff
        res.json(alert);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAlertsForUser = async (req, res) => {
    try {
        const userId = req.params.userId; // Assuming user ID is passed as a route parameter or from token
        // Authorization logic: ensure user can only view their own alerts unless Admin/Staff
        const alerts = await Alert.getAlertsForUser(userId);
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const markAlertAsRead = async (req, res) => {
    try {
        const alertId = req.params.id;
        const updatedAlert = await Alert.markAlertAsRead(alertId);
         if (!updatedAlert) {
            return res.status(404).json({ error: 'Alert not found' });
        }
        // Authorization logic: ensure user can only mark their own alerts as read unless Admin/Staff
        res.json(updatedAlert);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAlert = async (req, res) => {
    try {
        const alertId = req.params.id;
        const deletedAlert = await Alert.deleteAlert(alertId);
        if (!deletedAlert) {
            return res.status(404).json({ error: 'Alert not found' });
        }
        // Authorization logic: ensure user can only delete their own alerts unless Admin/Staff
        res.json({ message: 'Alert deleted successfully', deletedAlert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Note: More complex alert logic and integration with other modules can be added later.

module.exports = {
    createAlert,
    getAlertById,
    getAlertsForUser,
    markAlertAsRead,
    deleteAlert,
}; 