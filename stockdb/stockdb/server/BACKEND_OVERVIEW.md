# Backend Overview for Frontend Developers

This document provides an overview of the backend structure, available APIs, and key concepts for frontend developers integrating with the StockDB application.

## Project Structure

- `server/`
    - `controllers/`: Contains the logic for handling requests and interacting with models.
    - `middleware/`: Houses middleware functions for authentication, authorization, and error handling.
    - `models/`: Defines how data is structured and interacted with in the database.
    - `routes/`: Defines the API endpoints and links them to controller functions.
    - `config/`: Configuration files (e.g., database connection).
    - `db/`: Database schema and seed files.
    - `index.js`: The main server entry point.

## API Endpoints

The API base URL is typically `/api`. Below are the main endpoint categories with more details.

### User Endpoints (`/api/users`)

Handles user registration, login, and profile management.

- `POST /api/users/register`: Register a new user.
    - Request Body: User details (e.g., username, email, password, user_type).
    - Response Body: Success message or user details.
- `POST /api/users/login`: Log in an existing user.
    - Request Body: User credentials (e.g., email, password).
    - Response Body: JWT token and user details upon successful login.
- `GET /api/users`: Get a list of all users. (Admin/Staff only)
- `GET /api/users/:id`: Get details of a specific user. (Admin/Staff can view any, Customer their own)
- `PUT /api/users/:id`: Update details of a specific user. (Admin can update any, Staff/Customer their own)
- `DELETE /api/users/:id`: Delete a specific user. (Admin only)

### Product Endpoints (`/api/products`)

Manages product listing, details, and inventory.

- `GET /api/products`: Get a list of all products. (Public)
- `GET /api/products/:sku`: Get product details by SKU. (Admin/Staff only)
- `GET /api/products/id/:id`: Get product details by ID. (Public)
- `POST /api/products`: Create a new product. (Admin/Staff/Supplier)
    - Request Body: Product details (e.g., name, description, price, supplier_id, initial_inventory).
    - Response Body: Details of the created product.
- `PUT /api/products/:sku` and `PUT /api/products/id/:id`: Update product details by SKU or ID. (Admin/Staff/Supplier - Supplier can only update their own)
- `PATCH /api/products/:sku/inventory` and `PUT /api/products/id/:id/inventory`: Update product inventory by SKU or ID. (Admin/Staff/Supplier)
    - Request Body: Inventory update details (e.g., quantity_change, type - 'add' or 'remove').
    - Response Body: Updated inventory details.
- `DELETE /api/products/:sku`: Delete a product by SKU. (Admin/Staff only)
- `GET /api/products/supplier/:supplierId`: Get products by supplier ID. (Public)
- `GET /api/products/categories`: Get a list of product categories. (Admin/Staff only)
- `POST /api/products/categories`: Create a new category. (Admin/Staff only)
- `PUT /api/products/categories/:id`: Update a category. (Admin/Staff only)
- `DELETE /api/products/categories/:id`: Delete a category. (Admin/Staff only)

### Supplier Endpoints (`/api/suppliers`)

Handles supplier information and related data.

- `POST /api/suppliers`: Create a new supplier. (Admin/Staff only)
    - Request Body: Supplier details (e.g., name, contact_info, user_id if linking to an existing user).
    - Response Body: Details of the created supplier.
- `GET /api/suppliers`: Get a list of all suppliers. (Admin/Staff only)
- `GET /api/suppliers/:id`: Get details of a specific supplier. (Admin/Staff can view any, Supplier can view their own)
- `PUT /api/suppliers/:id`: Update details of a specific supplier. (Admin/Staff can update any, Supplier can update their own)
- `DELETE /api/suppliers/:id`: Delete a specific supplier. (Admin/Staff only)
- `GET /api/suppliers/:id/products`: Get products supplied by a specific supplier. (Public)
- `GET /api/suppliers/:id/orders`: Get orders related to a supplier. (Admin/Staff can view any, Supplier can view their own)
- `GET /api/suppliers/:id/payments`: Get payments related to a supplier. (Admin/Staff can view any, Supplier can view their own)
- `GET /api/suppliers/:id/metrics`: Get performance metrics for a supplier. (Admin/Staff only)

### Order Endpoints (`/api/orders`)

Manages customer orders.

- `POST /api/orders`: Create a new order. (Admin, Staff, Customer)
    - Request Body: Order details (e.g., customer_id, items array with product_id and quantity, shipping_address, billing_address).
    - Response Body: Details of the created order.
- `GET /api/orders`: Get a list of all orders. (Admin, Staff only)
- `GET /api/orders/:id`: Get details of a specific order. (Admin, Staff can view any, Customer can view their own)
- `PUT /api/orders/:id`: Update details of a specific order. (Admin, Staff only)
- `DELETE /api/orders/:id`: Delete a specific order. (Admin, Staff only)
- `PATCH /api/orders/:id/cancel`: Cancel an order. (Admin, Staff, Customer - Customer can only cancel their own)
- `GET /api/orders/customer/:customerId`: Get orders for a specific customer. (Admin, Staff can view any, Customer can view their own)

### Payment Endpoints (`/api/payments`)

Handles payment records and processing (basic endpoints provided, integrate with a payment gateway for full functionality).

- `POST /api/payments`: Create a new payment record. (Admin, Staff, Customer - typically part of order creation)
    - Request Body: Payment details (e.g., order_id, amount, method, transaction_id, status).
    - Response Body: Details of the created payment record.
- `GET /api/payments`: Get a list of all payments. (Admin, Staff only)
- `GET /api/payments/:id`: Get details of a specific payment. (Admin, Staff can view any, Customer can view their own)
- `PUT /api/payments/:id`: Update details of a specific payment. (Admin, Staff only)
- `POST /api/payments/:id/refund`: Refund a payment. (Admin, Staff only)
- `GET /api/payments/customer/:customerId`: Get payments for a specific customer. (Admin, Staff can view any, Customer can view their own)
- `GET /api/payments/order/:orderId`: Get payments for a specific order. (Requires authentication, authorized to view own order's payments or if Admin/Staff)

### Alert Endpoints (`/api/alerts`)

Manages user alerts and notifications.

- `POST /api/alerts`: Create a new alert. (Admin, Staff only)
    - Request Body: Alert details (e.g., user_id, type, message, status).
    - Response Body: Details of the created alert.
- `GET /api/alerts`: Get a list of all alerts. (Admin, Staff only)
- `GET /api/alerts/:id`: Get details of a specific alert. (Admin, Staff can view any, Customer/Supplier can view their own)
- `PUT /api/alerts/:id`: Update an alert. (Admin, Staff only)
- `DELETE /api/alerts/:id`: Delete an alert. (Admin, Staff only)
- `GET /api/alerts/user/:userId`: Get alerts for a specific user. (Admin, Staff can view any, Customer/Supplier can view their own)
- `PATCH /api/alerts/:id/read`: Mark an alert as read. (Customer, Supplier - can only mark their own)

### Report Endpoints (`/api/reports`)

Provides functionality for generating and retrieving reports.

- `POST /api/reports`: Create a new report record. (Admin/Staff only)
    - Request Body: Report details (e.g., type, parameters used, generated_by_user_id).
    - Response Body: Details of the created report record.
- `GET /api/reports`: Get a list of all reports. (Admin/Staff only)
- `GET /api/reports/:id`: Get details of a specific report record. (Admin/Staff can view any, Customer can view their own)
- `GET /api/reports/user/:userId`: Get report records for a specific user. (Admin/Staff can view any, Customer can view their own)
- `GET /api/reports/type/:reportType`: Get report records by type. (Admin/Staff only)
- `POST /api/reports/generate/sales`: Generate a sales report. (Admin/Staff only)
- `POST /api/reports/generate/inventory`: Generate an inventory report. (Admin/Staff/Supplier only)
- `POST /api/reports/generate/customer`: Generate a customer report. (Admin/Staff only)
- `POST /api/reports/generate/supplier`: Generate a supplier report. (Admin/Staff only)
- `GET /api/reports/:id/download`: Download a generated report file. (Admin/Staff can download any, Customer can download their own)

## Authentication (JWT)

Authentication is handled using JSON Web Tokens (JWT).

- **Login:** When a user logs in (`POST /api/users/login`), the backend verifies their credentials and returns a JWT in the response body.
- **Accessing Protected Routes:** To access routes that require authentication (`authenticateToken` middleware), include the JWT in the `Authorization` header of your request:

    `Authorization: Bearer <your_jwt_token>`

- The backend will validate the token and attach the user's information (including user ID and type) to the request object (`req.user`).

## Authorization (Role and Resource-Based)

The backend implements a granular authorization system:

- **Roles:** Users have roles (Admin, Staff, Supplier, Customer).
- **`authorize(allowedRoles)` Middleware:** Checks if the user's role is among the `allowedRoles`. (Used for basic role checks)
- **`authorizeOperation(operation)` Middleware:** Checks if the user's role has permission for a specific named `operation` (e.g., `product:create`, `order:read`). Refer to `middleware/authorizeMiddleware.js` for the full list of operations and allowed roles.
- **Resource Access Middleware (`resourceAccessMiddleware.js`):** Contains middleware functions to check access based on resource ownership or type (`checkResourceOwnership`, `checkCustomerAccess`, `checkProductAccess`, `checkSupplierAccess`, `checkInventoryAccess`). These ensure users can only access resources they are permitted to.
- **`checkResourceState(resourceType, allowedStates)` Middleware:** Checks if a resource is in one of the specified `allowedStates` before allowing an action.

Frontend should handle different responses:
- `401 Unauthorized`: User is not authenticated (no valid JWT).
- `403 Forbidden`: User is authenticated but does not have the necessary permissions to perform the action or access the resource in its current state.

## Database Schema

The database schema is defined in `server/db/schema.sql`. It includes tables for users, products, suppliers, orders, payments, alerts, reports, and inventory, with appropriate relationships (foreign keys) and constraints.

## Running the Backend

1.  Navigate to the `server` directory in your terminal: `cd StockDB/stockdb/server`
2.  Ensure dependencies are installed: `npm install` (if not already done)
3.  Set up the database: `node db/setup.js` (This will create tables and seed initial data).
4.  Start the server: `node index.js`

The server should now be running, typically on `http://localhost:3000` (check `index.js` for the port if different).

---

This document provides a starting point. For detailed request/response structures and parameters for specific endpoints, consult the controller and route files in the backend code. 