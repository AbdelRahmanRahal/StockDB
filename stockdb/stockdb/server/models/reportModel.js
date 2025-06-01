const db = require('../config/db');

const createReport = async ({ user_id, report_type, generated_date, file_path, status }) => {
  const result = await db.query(
    'INSERT INTO report (user_id, report_type, generated_date, file_path, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user_id, report_type, generated_date, file_path, status]
  );
  return result.rows[0];
};

const getReportById = async (reportId) => {
  const result = await db.query('SELECT * FROM report WHERE id = $1', [reportId]);
  return result.rows[0];
};

const getReportsByUser = async (userId) => {
  const result = await db.query('SELECT * FROM report WHERE user_id = $1 ORDER BY generated_date DESC', [userId]);
  return result.rows;
};

const getReportsByType = async (reportType) => {
    const result = await db.query('SELECT * FROM report WHERE report_type = $1 ORDER BY generated_date DESC', [reportType]);
    return result.rows;
};

const getAllReports = async () => {
    const result = await db.query('SELECT * FROM report ORDER BY generated_date DESC');
    return result.rows;
};

// Note: Functions to actually *generate* report data (e.g., calculating sales totals) might reside here or in the controller.
// For now, this model focuses on managing the report records themselves.

module.exports = {
  createReport,
  getReportById,
  getReportsByUser,
  getReportsByType,
    getAllReports,
}; 