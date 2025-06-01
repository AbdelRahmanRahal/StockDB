const db = require('../config/db');

const createAlert = async ({ user_id, message, alert_date, is_read, severity }) => {
  const result = await db.query(
    'INSERT INTO alert (user_id, message, alert_date, is_read, severity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user_id, message, alert_date, is_read, severity]
  );
  return result.rows[0];
};

const getAlertById = async (alertId) => {
  const result = await db.query('SELECT * FROM alert WHERE id = $1', [alertId]);
  return result.rows[0];
};

const getAlertsForUser = async (userId) => {
  const result = await db.query('SELECT * FROM alert WHERE user_id = $1 ORDER BY alert_date DESC', [userId]);
  return result.rows;
};

const markAlertAsRead = async (alertId) => {
  const result = await db.query(
    'UPDATE alert SET is_read = TRUE, read_date = NOW() WHERE id = $1 RETURNING *',
    [alertId]
  );
  return result.rows[0];
};

const deleteAlert = async (alertId) => {
    const result = await db.query('DELETE FROM alert WHERE id = $1 RETURNING *', [alertId]);
    return result.rows[0];
};

// Note: More complex alert logic (e.g., trigger-based alerts, notification mechanisms) can be added later.

module.exports = {
  createAlert,
  getAlertById,
  getAlertsForUser,
  markAlertAsRead,
  deleteAlert,
}; 