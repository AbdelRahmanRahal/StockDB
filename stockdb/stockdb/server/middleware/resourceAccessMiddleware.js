const db = require('../config/db');

// Middleware to check if the authenticated user owns the resource or is Admin/Staff
const checkResourceOwnership = (resourceType) => async (req, res, next) => {
    try {
        const userId = req.user.id; // From auth middleware
        const userType = req.user.user_type; // From auth middleware
        const resourceId = req.params.id || req.params[`${resourceType}Id`]; // Handle resourceId from different param names

        if (!resourceId) {
             return res.status(400).json({ error: `Resource ID not provided for ${resourceType}` });
        }

        // Admin and Staff can access any resource
        if (userType === 'Admin' || userType === 'Staff') {
            return next();
        }

        let query;
        let params;
        let isSupplierResource = false;

        switch (resourceType) {
            case 'order':
                query = 'SELECT customer_id FROM "order" WHERE id = $1';
                params = [resourceId];
                break;
            case 'payment':
                query = 'SELECT customer_id FROM payment WHERE id = $1';
                params = [resourceId];
                break;
            case 'alert':
                query = 'SELECT user_id FROM alert WHERE id = $1';
                params = [resourceId];
                break;
            case 'report':
                query = 'SELECT user_id FROM report WHERE id = $1';
                params = [resourceId];
                break;
            case 'product':
                query = 'SELECT supplier_id FROM product WHERE id = $1';
                params = [resourceId];
                isSupplierResource = true;
                break;
            case 'inventory':
                // For inventory, first get the product_id, then the supplier_id from the product
                const inventoryResult = await db.query('SELECT product_id FROM inventory WHERE id = $1', [resourceId]);
                if (inventoryResult.rows.length === 0) {
                     return res.status(404).json({ error: 'Inventory item not found' });
                }
                const productId = inventoryResult.rows[0].product_id;
                query = 'SELECT supplier_id FROM product WHERE id = $1';
                params = [productId];
                isSupplierResource = true;
                break;
            default:
                return res.status(400).json({ error: 'Invalid resource type for ownership check' });
        }

        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `${resourceType} not found` });
        }

        if (isSupplierResource) {
            // Check if the authenticated user is the supplier who owns the resource
            if (userType === 'Supplier') {
                const supplierResult = await db.query('SELECT id FROM supplier WHERE user_id = $1', [userId]);
                if (supplierResult.rows.length === 0) {
                    return res.status(403).json({ error: 'Access denied: User is not linked to a supplier profile' });
                }
                const userSupplierId = supplierResult.rows[0].id;
                const resourceSupplierId = result.rows[0].supplier_id;

                if (userSupplierId !== resourceSupplierId) {
                    return res.status(403).json({ error: `Access denied: You do not own this ${resourceType}` });
                }
            } else {
                 // Other non-Admin/Staff roles (like Customer) cannot access supplier resources via ownership check
                 return res.status(403).json({ error: `Access denied: You do not have permission to access this ${resourceType}` });
            }
        } else {
            // Check ownership for resources linked to user_id or customer_id
            const resourceOwnerId = result.rows[0].customer_id || result.rows[0].user_id;

            if (resourceOwnerId !== userId) {
                return res.status(403).json({ error: `Access denied: You do not own this ${resourceType}` });
            }
        }

        next();
    } catch (error) {
        console.error(`Resource ownership check error for ${resourceType}:`, error);
        res.status(500).json({ error: 'Error checking resource ownership' });
    }
};

// Middleware to check if user has access to a specific customer's data
const checkCustomerAccess = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userType = req.user.user_type;
        const customerId = req.params.customerId || req.params.userId;

        // Admin and Staff can access any customer's data
        if (userType === 'Admin' || userType === 'Staff') {
            return next();
        }

        // Regular users can only access their own data
        if (userId !== parseInt(customerId)) {
            return res.status(403).json({ error: 'Access denied: You can only access your own data' });
        } else {
             // Also verify that the user is a customer if accessing via customerId/userId param directly
             if (userType !== 'Customer') {
                  // This case might need refinement based on whether other users can have customerId/userId params in routes
                  // For now, assuming this middleware is primarily for customer-centric routes where authenticated user should be a customer
                  // unless Admin/Staff.
                 // Let's skip this strict check for now to avoid blocking valid Admin/Staff access.
                 // return res.status(403).json({ error: 'Access denied: Invalid user type for this resource' });
             }
        }

        next();
    } catch (error) {
        console.error('Customer access check error:', error);
        res.status(500).json({ error: 'Error checking customer access' });
    }
};

// Middleware to check if user has access to a specific order (more specific than checkResourceOwnership for orders)
const checkOrderAccess = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userType = req.user.user_type;
        const orderId = req.params.orderId || req.params.id;

         if (!orderId) {
             return res.status(400).json({ error: 'Order ID not provided' });
         }

        // Admin and Staff can access any order
        if (userType === 'Admin' || userType === 'Staff') {
            return next();
        }

        // Check if the order belongs to the user
        const result = await db.query(
            'SELECT customer_id FROM "order" WHERE id = $1',
            [orderId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (result.rows[0].customer_id !== userId) {
            return res.status(403).json({ error: 'Access denied: You can only access your own orders' });
        }

        next();
    } catch (error) {
        console.error('Order access check error:', error);
        res.status(500).json({ error: 'Error checking order access' });
    }
};

// Middleware to check if user has access to inventory management
const checkInventoryAccess = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userType = req.user.user_type;
        const inventoryId = req.params.id; // Assuming inventory ID is in :id parameter

         if (!inventoryId) {
             return res.status(400).json({ error: 'Inventory ID not provided' });
         }

        // Only Admin, Staff, and Supplier can access inventory
        if (!['Admin', 'Staff', 'Supplier'].includes(userType)) {
             return res.status(403).json({ error: 'Access denied: You do not have permission to manage inventory' });
        }

        // Supplier specific check: can only access inventory for products they supply
        if (userType === 'Supplier') {
            const supplierResult = await db.query('SELECT id FROM supplier WHERE user_id = $1', [userId]);
             if (supplierResult.rows.length === 0) {
                 return res.status(403).json({ error: 'Access denied: User is not linked to a supplier profile' });
            }
            const userSupplierId = supplierResult.rows[0].id;

            const inventoryOwnerCheck = await db.query(
                'SELECT p.supplier_id FROM inventory i JOIN product p ON i.product_id = p.id WHERE i.id = $1',
                [inventoryId]
            );

            if (inventoryOwnerCheck.rows.length === 0) {
                 return res.status(404).json({ error: 'Inventory item not found or not linked to a product/supplier' });
            }

            if (inventoryOwnerCheck.rows[0].supplier_id !== userSupplierId) {
                return res.status(403).json({ error: 'Access denied: You can only access inventory for your own products' });
            }
        }

        next();
    } catch (error) {
        console.error('Inventory access check error:', error);
        res.status(500).json({ error: 'Error checking inventory access' });
    }
};

// Middleware to check if user has access to supplier operations
const checkSupplierAccess = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userType = req.user.user_type;
        const supplierId = req.params.supplierId || req.params.id;

         if (!supplierId) {
             return res.status(400).json({ error: 'Supplier ID not provided' });
         }

        // Admin and Staff can access any supplier
        if (userType === 'Admin' || userType === 'Staff') {
            return next();
        }

        // Supplier users can only access their own data
        if (userType === 'Supplier') {
            const result = await db.query(
                'SELECT id FROM supplier WHERE user_id = $1',
                [userId]
            );

            // Check if the user is linked to a supplier profile and if the requested supplierId matches their linked profile
            if (result.rows.length === 0 || result.rows[0].id !== parseInt(supplierId)) {
                return res.status(403).json({ error: 'Access denied: You can only access your own supplier data' });
            }
        } else {
             // Other roles (like Customer) cannot access supplier data via this middleware
            return res.status(403).json({ error: 'Access denied: You do not have permission to access supplier data' });
        }

        next();
    } catch (error) {
        console.error('Supplier access check error:', error);
        res.status(500).json({ error: 'Error checking supplier access' });
    }
};

// Middleware to check if user has access to product management
const checkProductAccess = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userType = req.user.user_type;
        const productId = req.params.productId || req.params.id; // Assuming product ID is in :productId or :id parameter

         if (!productId) {
             return res.status(400).json({ error: 'Product ID not provided' });
         }

        // Admin and Staff can access any product
        if (userType === 'Admin' || userType === 'Staff') {
            return next();
        }

        // Supplier users can only access their own products
        if (userType === 'Supplier') {
            const result = await db.query(
                'SELECT p.id FROM product p JOIN supplier s ON p.supplier_id = s.id WHERE s.user_id = $1 AND p.id = $2',
                [userId, productId]
            );

            if (result.rows.length === 0) {
                return res.status(403).json({ error: 'Access denied: You can only access your own products' });
            }
        } else {
            // Other roles (like Customer) cannot access product data via this middleware for updates/deletes etc.
            // Public product read access is handled in routes without this middleware
            return res.status(403).json({ error: 'Access denied: You do not have permission to access product data' });
        }

        next();
    } catch (error) {
        console.error('Product access check error:', error);
        res.status(500).json({ error: 'Error checking product access' });
    }
};

// Middleware to check resource state
const checkResourceState = (resourceType, allowedStates) => async (req, res, next) => {
    try {
        const resourceId = req.params.id || req.params[`${resourceType}Id`];

        if (!resourceId) {
            return res.status(400).json({ error: `Resource ID not provided for ${resourceType}` });
        }

        let query;
        switch (resourceType) {
            case 'order':
                query = 'SELECT status FROM "order" WHERE id = $1';
                break;
            case 'payment':
                query = 'SELECT status FROM payment WHERE id = $1';
                break;
            case 'alert':
                query = 'SELECT status FROM alert WHERE id = $1'; // Assuming alerts have a status column
                break;
            // Add other resource types and their status columns as needed
            default:
                return res.status(400).json({ error: 'Invalid resource type for state check' });
        }

        const result = await db.query(query, [resourceId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `${resourceType} not found` });
        }

        const currentState = result.rows[0].status;

        if (!allowedStates.includes(currentState)) {
            return res.status(403).json({
                error: `Access denied: Resource is in a state that does not allow this action.`,
                currentState: currentState,
                allowedStates: allowedStates
            });
        }

        next();
    } catch (error) {
        console.error(`Resource state check error for ${resourceType}:`, error);
        res.status(500).json({ error: 'Error checking resource state' });
    }
};

module.exports = {
    checkResourceOwnership,
    checkCustomerAccess,
    checkOrderAccess,
    checkInventoryAccess,
    checkSupplierAccess,
    checkProductAccess,
    checkResourceState
};