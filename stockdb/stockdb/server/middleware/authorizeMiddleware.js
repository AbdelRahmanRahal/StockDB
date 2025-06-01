const db = require('../config/db');

// Define role hierarchy and permissions
const ROLE_HIERARCHY = {
    'Admin': ['Admin', 'Staff', 'Supplier', 'Customer'],
    'Staff': ['Staff', 'Supplier', 'Customer'],
    'Supplier': ['Supplier'],
    'Customer': ['Customer']
};

// Define specific permissions for different operations
const OPERATION_PERMISSIONS = {
    // User management
    'user:create': ['Admin'],
    'user:read': ['Admin', 'Staff', 'Customer'],
    'user:update': ['Admin', 'Staff', 'Customer'],
    'user:delete': ['Admin'],

    // Product management
    'product:create': ['Admin', 'Staff', 'Supplier'],
    'product:read': ['Admin', 'Staff', 'Supplier', 'Customer'],
    'product:update': ['Admin', 'Staff', 'Supplier'],
    'product:delete': ['Admin', 'Staff'],

    // Inventory management
    'inventory:create': ['Admin', 'Staff', 'Supplier'],
    'inventory:read': ['Admin', 'Staff', 'Supplier', 'Customer'],
    'inventory:update': ['Admin', 'Staff', 'Supplier'],
    'inventory:delete': ['Admin', 'Staff'],

    // Order management
    'order:create': ['Admin', 'Staff', 'Customer'],
    'order:read': ['Admin', 'Staff', 'Customer'],
    'order:update': ['Admin', 'Staff'],
    'order:delete': ['Admin', 'Staff'],
    'order:cancel': ['Admin', 'Staff', 'Customer'],

    // Payment management
    'payment:create': ['Admin', 'Staff', 'Customer'],
    'payment:read': ['Admin', 'Staff', 'Customer'],
    'payment:update': ['Admin', 'Staff'],
    'payment:refund': ['Admin', 'Staff'],

    // Supplier management
    'supplier:create': ['Admin', 'Staff'],
    'supplier:read': ['Admin', 'Staff', 'Supplier'],
    'supplier:update': ['Admin', 'Staff', 'Supplier'],
    'supplier:delete': ['Admin', 'Staff'],

    // Report management
    'report:create': ['Admin', 'Staff'],
    'report:read': ['Admin', 'Staff', 'Customer'],
    'report:generate': ['Admin', 'Staff'],
    'report:delete': ['Admin', 'Staff']
};

// Basic role-based authorization middleware
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const userType = req.user.user_type;

            if (!userType) {
                return res.status(401).json({ error: 'User type not found' });
            }

            // Check if user's role is in the allowed roles
            if (allowedRoles.includes(userType)) {
                return next();
            }

            // Check role hierarchy
            const userAllowedRoles = ROLE_HIERARCHY[userType] || [];
            const hasPermission = allowedRoles.some(role => userAllowedRoles.includes(role));

            if (!hasPermission) {
                return res.status(403).json({ 
                    error: 'Access denied: Insufficient permissions',
                    required: allowedRoles,
                    current: userType
                });
            }

            next();
        } catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({ error: 'Error checking authorization' });
        }
    };
};

// Operation-based authorization middleware
const authorizeOperation = (operation) => {
    return (req, res, next) => {
        try {
            const userType = req.user.user_type;

            if (!userType) {
                return res.status(401).json({ error: 'User type not found' });
            }

            const allowedRoles = OPERATION_PERMISSIONS[operation];

            if (!allowedRoles) {
                return res.status(400).json({ error: 'Invalid operation' });
            }

            // Check if user's role is directly allowed
            if (allowedRoles.includes(userType)) {
                return next();
            }

            // Check role hierarchy
            const userAllowedRoles = ROLE_HIERARCHY[userType] || [];
            const hasPermission = allowedRoles.some(role => userAllowedRoles.includes(role));

            if (!hasPermission) {
                return res.status(403).json({ 
                    error: 'Access denied: Insufficient permissions for operation',
                    operation,
                    required: allowedRoles,
                    current: userType
                });
            }

            next();
        } catch (error) {
            console.error('Operation authorization error:', error);
            res.status(500).json({ error: 'Error checking operation authorization' });
        }
    };
};

// Dynamic permission check middleware
const checkPermission = (permission) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            const userType = req.user.user_type;

            // Get user's custom permissions from database if needed
            const result = await db.query(
                'SELECT permissions FROM user_permissions WHERE user_id = $1',
                [userId]
            );

            const customPermissions = result.rows[0]?.permissions || [];

            // Check if user has the required permission
            if (customPermissions.includes(permission)) {
                return next();
            }

            // Check role-based permissions
            const allowedRoles = OPERATION_PERMISSIONS[permission];
            if (allowedRoles && allowedRoles.includes(userType)) {
                return next();
            }

            return res.status(403).json({ 
                error: 'Access denied: Insufficient permissions',
                permission,
                current: userType
            });
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ error: 'Error checking permissions' });
        }
    };
};

// Resource-specific authorization middleware
const authorizeResource = (resourceType, action) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            const userType = req.user.user_type;
            const resourceId = req.params.id;

            // Check if user has permission for the action on this resource type
            const permission = `${resourceType}:${action}`;
            const allowedRoles = OPERATION_PERMISSIONS[permission];

            if (!allowedRoles) {
                return res.status(400).json({ error: 'Invalid resource or action' });
            }

            // Admin and Staff have full access
            if (userType === 'Admin' || userType === 'Staff') {
                return next();
            }

            // Check if user's role is allowed for this action
            if (!allowedRoles.includes(userType)) {
                return res.status(403).json({ 
                    error: 'Access denied: Insufficient permissions for this action',
                    resource: resourceType,
                    action,
                    current: userType
                });
            }

            // Check resource ownership if needed
            if (['update', 'delete'].includes(action)) {
                const result = await db.query(
                    `SELECT user_id FROM ${resourceType} WHERE id = $1`,
                    [resourceId]
                );

                if (result.rows.length === 0) {
                    return res.status(404).json({ error: 'Resource not found' });
                }

                if (result.rows[0].user_id !== userId) {
                    return res.status(403).json({ 
                        error: 'Access denied: You do not own this resource',
                        resource: resourceType,
                        action
                    });
                }
            }

            next();
        } catch (error) {
            console.error('Resource authorization error:', error);
            res.status(500).json({ error: 'Error checking resource authorization' });
        }
    };
};

module.exports = {
    authorize,
    authorizeOperation,
    checkPermission,
    authorizeResource,
    ROLE_HIERARCHY,
    OPERATION_PERMISSIONS
}; 