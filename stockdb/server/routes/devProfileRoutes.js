const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const profileRouter = express.Router();

// Middleware to verify JWT Bearer token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'No token provided or malformed.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
    req.user = decoded; // { id, email, userType, iat, exp }
    next();
  });
}

/**
 * GET /api/dev-profile
 *  • Returns the logged‐in user's base fields (first_name, last_name, email, user_type)
 *    plus subtype‐specific fields:
 *      – If userType === 'Customer': shipping_address, billing_address, phone_number, loyalty_points, preferred_payment_method
 *      – If userType === 'Staff': department, role
 *      – If userType === 'Admin': admin_level, last_login_audit
 */
profileRouter.get('/dev-profile', verifyToken, async (req, res) => {
  const { id: userId, userType } = req.user;

  try {
    // 1) Base user fields
    const userSql = `
      SELECT id, first_name AS "firstName", last_name AS "lastName", email, user_type AS "userType"
      FROM "user"
      WHERE id = $1
      LIMIT 1;
    `;
    const userRes = await pool.query(userSql, [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const baseUser = userRes.rows[0];

    // 2) Branch on userType
    let subtypeSql = '';
    switch (userType) {
      case 'Customer':
        subtypeSql = `
          SELECT 
            shipping_address, 
            billing_address, 
            phone_number, 
            loyalty_points, 
            preferred_payment_method 
          FROM customer 
          WHERE user_id = $1
          LIMIT 1;
        `;
        break;
      case 'Staff':
        subtypeSql = `
          SELECT 
            department, 
            role 
          FROM staff 
          WHERE user_id = $1
          LIMIT 1;
        `;
        break;
      case 'Admin':
        subtypeSql = `
          SELECT 
            admin_level, 
            last_login_audit 
          FROM admin 
          WHERE user_id = $1
          LIMIT 1;
        `;
        break;
      default:
        return res
          .status(400)
          .json({ error: `Unknown userType '${userType}'` });
    }

    const subtypeRes = await pool.query(subtypeSql, [userId]);
    const subtypeRow = subtypeRes.rows[0] || {};

    return res.status(200).json({ ...baseUser, ...subtypeRow });
  } catch (err) {
    console.error('[DEV GET PROFILE ERROR]', err);
    return res.status(500).json({ error: 'Internal server error (dev).' });
  }
});

/**
 * PUT /api/dev-profile
 *  • Expects JSON body containing:
 *      • firstName, lastName                  (always required)
 *      • plus exactly those subtype fields:
 *          – For Customer:     shipping_address, billing_address, phone_number, loyalty_points, preferred_payment_method
 *          – For Staff:        department, role
 *          – For Admin:        admin_level, last_login_audit
 *  • Updates "user" and upserts into the subtype table.
 */
profileRouter.put('/dev-profile', verifyToken, async (req, res) => {
  const { id: userId, userType } = req.user;
  const {
    first_name,
    last_name,
    // customer-specific:
    shipping_address,
    billing_address,
    phone_number,
    loyalty_points,
    preferred_payment_method,
    // staff-specific:
    department,
    role,
    // admin-specific:
    admin_level,
    last_login_audit,
  } = req.body;

  // 1) Basic validation
  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'first_name and last_name are required.' });
  }

  try {
    await pool.query('BEGIN');

    // 2) Update base "user" table
    const updateUserSql = `
      UPDATE "user"
      SET first_name = $1,
          last_name = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3;
    `;
    await pool.query(updateUserSql, [first_name.trim(), last_name.trim(), userId]);

    // 3) Upsert into subtype table
    switch (userType) {
      case 'Customer': {
        if (
          shipping_address == null ||
          billing_address == null ||
          phone_number == null ||
          loyalty_points == null ||
          preferred_payment_method == null
        ) {
          await pool.query('ROLLBACK');
          return res
            .status(400)
            .json({ error: 'Missing customer fields in body.' });
        }
        // INSERT ... ON CONFLICT(user_id) DO UPDATE
        const upsertCustSql = `
          INSERT INTO customer 
            (user_id, shipping_address, billing_address, phone_number, loyalty_points, preferred_payment_method)
          VALUES 
            ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (user_id) DO UPDATE
            SET shipping_address = EXCLUDED.shipping_address,
                billing_address = EXCLUDED.billing_address,
                phone_number = EXCLUDED.phone_number,
                loyalty_points = EXCLUDED.loyalty_points,
                preferred_payment_method = EXCLUDED.preferred_payment_method,
                updated_at = CURRENT_TIMESTAMP;
        `;
        await pool.query(upsertCustSql, [
          userId,
          shipping_address.trim(),
          billing_address.trim(),
          phone_number.trim(),
          loyalty_points,
          preferred_payment_method.trim(),
        ]);
        break;
      }
      case 'Staff': {
        if (department == null || role == null) {
          await pool.query('ROLLBACK');
          return res
            .status(400)
            .json({ error: 'Missing staff fields in body.' });
        }
        const upsertStaffSql = `
          INSERT INTO staff 
            (user_id, department, role)
          VALUES 
            ($1, $2, $3)
          ON CONFLICT (user_id) DO UPDATE
            SET department = EXCLUDED.department,
                role = EXCLUDED.role,
                updated_at = CURRENT_TIMESTAMP;
        `;
        await pool.query(upsertStaffSql, [
          userId,
          department.trim(),
          role.trim(),
        ]);
        break;
      }
      case 'Admin': {
        if (admin_level == null || last_login_audit == null) {
          await pool.query('ROLLBACK');
          return res
            .status(400)
            .json({ error: 'Missing admin fields in body.' });
        }
        const upsertAdminSql = `
          INSERT INTO admin
            (user_id, admin_level, last_login_audit)
          VALUES
            ($1, $2, $3)
          ON CONFLICT (user_id) DO UPDATE
            SET admin_level = EXCLUDED.admin_level,
                last_login_audit = EXCLUDED.last_login_audit,
                updated_at = CURRENT_TIMESTAMP;
        `;
        await pool.query(upsertAdminSql, [
          userId,
          admin_level.trim(),
          last_login_audit, // expecting a valid timestamp string
        ]);
        break;
      }
      default:
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: `Unknown userType '${userType}'` });
    }

    await pool.query('COMMIT');

    // 4) Return the updated/combined profile (reuse GET logic)
    //    Instead of duplicating, we can run a SELECT here:
    const combinedSql = `
      SELECT 
        u.id,
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        u.email,
        u.user_type AS "userType",
        ${userType === 'Customer'
          ? `c.shipping_address,
             c.billing_address,
             c.phone_number,
             c.loyalty_points,
             c.preferred_payment_method`
          : userType === 'Staff'
          ? `s.department,
             s.role`
          : userType === 'Admin'
          ? `a.admin_level,
             a.last_login_audit`
          : ''}
      FROM "user" u
      LEFT JOIN ${
        userType === 'Customer' ? 'customer c ON u.id = c.user_id'
        : userType === 'Staff' ? 'staff s ON u.id = s.user_id'
        : 'admin a ON u.id = a.user_id'
      }
      WHERE u.id = $1
      LIMIT 1;
    `;
    const combinedRes = await pool.query(combinedSql, [userId]);
    const updatedProfile = combinedRes.rows[0] || null;

    return res.status(200).json(updatedProfile);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('[DEV UPDATE PROFILE ERROR]', err);
    return res.status(500).json({ error: 'Internal server error (dev).' });
  }
});

module.exports = profileRouter;