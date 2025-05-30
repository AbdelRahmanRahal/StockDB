-- Insert Suppliers
INSERT INTO supplier (supplier_name, contact_information) VALUES
('Cairo Supplies', 'info@cairosupplies.eg'),
('Alexandria Traders', 'contact@alextraders.eg'),
('Delta Goods Co.', 'support@deltagoods.eg');

-- Insert Users
INSERT INTO "user" (first_name, last_name, email, password_hash, user_type) VALUES
('Mahmoud', 'Mohamed', 'mahmoud.m@example.com', 'pass123', 'Customer'),
('Ahmed', 'Hisham', 'aqandil@nu.edu.eg', '1234', 'Admin'),
('Abderhman', 'Rahal', 'abderhman.r@example.com', 'pass123', 'Admin'),
('Nour', 'Sharkawy', 'nour.s@example.com', 'pass123', 'Staff'),
('Ahmed', 'Said', 'ahmed.s@example.com', 'pass123', 'Customer'),
('Sara', 'Hassan', 'sara.h@example.com', 'pass123', 'Customer'),
('Omar', 'Farouk', 'omar.f@example.com', 'pass123', 'Customer'),
('Laila', 'Mostafa', 'laila.m@example.com', 'pass123', 'Staff'),
('Youssef', 'Khaled', 'youssef.k@example.com', 'pass123', 'Customer'),
('Mona', 'Samir', 'mona.s@example.com', 'pass123', 'Customer'),
('Karim', 'Ali', 'karim.a@example.com', 'pass123', 'Customer'),
('Dina', 'Mahmoud', 'dina.m@example.com', 'pass123', 'Staff'),
('Tamer', 'Nabil', 'tamer.n@example.com', 'pass123', 'Customer'),
('Farida', 'Sami', 'farida.s@example.com', 'pass123', 'Admin'),
('Hassan', 'Ibrahim', 'hassan.i@example.com', 'pass123', 'Customer'),
('Rania', 'Samir', 'rania.s@example.com', 'pass123', 'Customer'),
('Samir', 'Hassan', 'samir.h@example.com', 'pass123', 'Customer'),
('Maha', 'Khaled', 'maha.k@example.com', 'pass123', 'Customer'),
('Mostafa', 'Omar', 'mostafa.o@example.com', 'pass123', 'Staff'),
('Nadia', 'Mohamed', 'nadia.m@example.com', 'pass123', 'Customer'),
('Amir', 'Fathy', 'amir.f@example.com', 'pass123', 'Customer');

-- Insert Products
INSERT INTO product (sku, product_name, description, price, supplier_id) VALUES
('EG001', 'Nile Potatoes', 'Fresh potatoes from Nile Delta', 1.50, 1),
('EG002', 'Alexandria Oranges', 'Juicy oranges from Alexandria region', 2.00, 2),
('EG003', 'Cairo Dates', 'Premium dates from Cairo farms', 3.00, 1),
('EG004', 'Giza Tomatoes', 'Organic tomatoes from Giza', 1.75, 1),
('EG005', 'Aswan Mangoes', 'Sweet mangoes from Aswan', 2.50, 2),
('EG006', 'Luxor Onions', 'High quality onions from Luxor', 1.30, 1),
('EG007', 'Ismailia Cucumbers', 'Fresh cucumbers from Ismailia', 1.20, 2),
('EG008', 'Suez Garlic', 'Spicy garlic from Suez', 1.40, 1),
('EG009', 'Port Said Lemons', 'Sour lemons from Port Said', 1.60, 2),
('EG010', 'Fayoum Eggplants', 'Large eggplants from Fayoum', 1.80, 1),
('EG011', 'Minya Carrots', 'Crunchy carrots from Minya', 1.10, 2),
('EG012', 'Behaira Peppers', 'Red peppers from Behaira', 1.90, 1),
('EG013', 'Qena Zucchini', 'Fresh zucchini from Qena', 1.25, 2),
('EG014', 'Red Sea Fish', 'Fresh fish from Red Sea', 5.00, 1),
('EG015', 'Delta Rice', 'High quality rice from Nile Delta', 3.50, 3),
('EG016', 'Cairo Olive Oil', 'Extra virgin olive oil from Cairo', 10.00, 1),
('EG017', 'Alexandria Honey', 'Natural honey from Alexandria', 7.50, 2),
('EG018', 'Sohag Wheat', 'Premium wheat from Sohag', 2.20, 3),
('EG019', 'Damietta Beans', 'Dry beans from Damietta', 3.00, 2),
('EG020', 'Assiut Lentils', 'Lentils from Assiut region', 2.80, 3);

-- Insert Inventory
INSERT INTO inventory (stock_level, sku) VALUES
(150, 'EG001'), (120, 'EG002'), (100, 'EG003'), (80, 'EG004'), (70, 'EG005'),
(90, 'EG006'), (110, 'EG007'), (60, 'EG008'), (130, 'EG009'), (75, 'EG010'),
(140, 'EG011'), (50, 'EG012'), (85, 'EG013'), (60, 'EG014'), (200, 'EG015'),
(30, 'EG016'), (45, 'EG017'), (95, 'EG018'), (100, 'EG019'), (150, 'EG020');

-- Insert Admin
INSERT INTO admin (user_id, admin_level, last_login_audit) VALUES
(2, 'Super Admin', NOW()),
(3, 'Manager', NOW()),
(14, 'Supervisor', NOW());

-- Insert Staff
INSERT INTO staff (user_id, department, role) VALUES
(4, 'Logistics', 'Inventory Manager'),
(8, 'Procurement', 'Buyer'),
(12, 'Sales', 'Sales Rep'),
(19, 'Operations', 'Warehouse Staff');

-- Insert Customers
INSERT INTO customer (user_id, shipping_address, billing_address, phone_number, loyalty_points, preferred_payment_method) VALUES
(1, '123 Nile St., Cairo', '123 Nile St., Cairo', '01012345678', 120, 'Credit Card'),
(5, '456 Giza Ave., Giza', '456 Giza Ave., Giza', '01098765432', 85, 'Cash'),
(6, '789 Luxor Rd., Luxor', '789 Luxor Rd., Luxor', '01123456789', 110, 'Mobile Wallet'),
(7, '321 Aswan Blvd., Aswan', '321 Aswan Blvd., Aswan', '01234567890', 75, 'Debit Card'),
(9, '654 Delta Dr., Mansoura', '654 Delta Dr., Mansoura', '01187654321', 95, 'Credit Card'),
(10, '876 Sohag St., Sohag', '876 Sohag St., Sohag', '01298765432', 60, 'Cash'),
(11, '999 Suez Canal Rd., Ismailia', '999 Suez Canal Rd., Ismailia', '01099988877', 130, 'Mobile Wallet'),
(13, '888 Red Sea Rd., Hurghada', '888 Red Sea Rd., Hurghada', '01122233344', 105, 'Debit Card'),
(15, '123 Minya Rd., Minya', '123 Minya Rd., Minya', '01211122233', 90, 'Credit Card'),
(16, '321 Damietta St., Damietta', '321 Damietta St., Damietta', '01055566677', 70, 'Cash'),
(17, '444 Qena Rd., Qena', '444 Qena Rd., Qena', '01144455566', 100, 'Mobile Wallet'),
(18, '555 Alexandria Rd., Alex', '555 Alexandria Rd., Alex', '01233344455', 115, 'Debit Card'),
(20, '777 Tanta Rd., Tanta', '777 Tanta Rd., Tanta', '01077788899', 50, 'Credit Card'),
(21, '999 Fayoum Rd., Fayoum', '999 Fayoum Rd., Fayoum', '01166677788', 65, 'Cash');

-- Insert Orders
INSERT INTO "order" (supplier_id, customer_id, order_date, delivery_estimated, received_date, order_status, revenue) VALUES
(1, 1, '2025-05-01', '2025-05-03', '2025-05-03', 'Delivered', 240.00),
(2, 5, '2025-05-02', '2025-05-05', NULL, 'Pending', 160.00),
(3, 6, '2025-05-03', '2025-05-06', '2025-05-06', 'Delivered', 280.00),
(1, 7, '2025-05-04', '2025-05-07', NULL, 'Pending', 190.00),
(2, 9, '2025-05-05', '2025-05-08', '2025-05-08', 'Delivered', 320.00),
(3, 10, '2025-05-06', '2025-05-09', NULL, 'Pending', 260.00),
(1, 11, '2025-05-07', '2025-05-10', '2025-05-10', 'Delivered', 400.00),
(2, 13, '2025-05-08', '2025-05-11', NULL, 'Pending', 340.00),
(3, 15, '2025-05-09', '2025-05-12', '2025-05-12', 'Delivered', 440.00),
(1, 16, '2025-05-10', '2025-05-13', NULL, 'Pending', 300.00),
(2, 17, '2025-05-11', '2025-05-14', '2025-05-14', 'Delivered', 500.00),
(3, 18, '2025-05-12', '2025-05-15', NULL, 'Pending', 360.00),
(1, 20, '2025-05-13', '2025-05-16', '2025-05-16', 'Delivered', 550.00);

-- Insert Order Items
INSERT INTO order_item (order_id, sku, quantity) VALUES
(1, 'EG001', 10),
(2, 'EG002', 5),
(3, 'EG003', 7),
(4, 'EG004', 2),
(5, 'EG005', 3),
(6, 'EG006', 1),
(7, 'EG007', 9),
(8, 'EG008', 4),
(9, 'EG009', 6),
(10, 'EG010', 8),
(11, 'EG011', 5),
(12, 'EG012', 7),
(13, 'EG013', 3);

-- Insert Payments
INSERT INTO payment (order_id, amount, payment_date, payment_method, transaction_status, customer_id) VALUES
(1, 240.00, '2025-05-02', 'Credit Card', 'Completed', 1),
(2, 160.00, '2025-05-06', 'Cash', 'Pending', 5),
(3, 280.00, '2025-05-04', 'Credit Card', 'Completed', 6),
(4, 190.00, '2025-05-07', 'Cash', 'Pending', 7),
(5, 320.00, '2025-05-09', 'Bank Transfer', 'Completed', 9),
(6, 260.00, '2025-05-10', 'Credit Card', 'Pending', 10),
(7, 400.00, '2025-05-11', 'Cash', 'Completed', 11),
(8, 340.00, '2025-05-12', 'Credit Card', 'Pending', 13),
(9, 440.00, '2025-05-13', 'Cash', 'Completed', 15),
(10, 300.00, '2025-05-14', 'Bank Transfer', 'Pending', 16),
(11, 500.00, '2025-05-15', 'Credit Card', 'Completed', 17),
(12, 360.00, '2025-05-16', 'Cash', 'Pending', 18),
(13, 550.00, '2025-05-17', 'Credit Card', 'Completed', 20);

-- Insert Alerts
INSERT INTO alert (threshold, current_stock, alert_date, inventory_id)
VALUES
(70, (SELECT stock_level FROM inventory WHERE inventory_id = 1), CURRENT_DATE, 1),
(70, (SELECT stock_level FROM inventory WHERE inventory_id = 2), CURRENT_DATE, 2),
(70, (SELECT stock_level FROM inventory WHERE inventory_id = 3), CURRENT_DATE, 3),
(70, (SELECT stock_level FROM inventory WHERE inventory_id = 4), CURRENT_DATE, 4),
(70, (SELECT stock_level FROM inventory WHERE inventory_id = 5), CURRENT_DATE, 5);

-- Insert Reports
INSERT INTO report (report_type, generated_date, description, user_id) VALUES
('Stock Report', '2025-05-20', 'Monthly stock level summary for all inventory items', 1),
('Stock Report', '2025-05-21', 'Low stock items alert', 2),
('Order Report', '2025-05-22', 'Summary of order statuses', 1),
('Order Report', '2025-05-23', 'Pending orders list', 3),
('Stock Report', '2025-06-01', 'Weekly stock audit', 2),
('Stock Report', '2025-06-05', 'Critical low stock warnings', 4),
('Order Report', '2025-06-07', 'Completed orders report', 1),
('Order Report', '2025-06-10', 'Delayed orders overview', 3),
('Stock Report', '2025-06-12', 'Stock turnover rates', 2),
('Order Report', '2025-06-15', 'Orders in transit', 5),
('Stock Report', '2025-06-18', 'Inventory valuation summary', 1),
('Order Report', '2025-06-20', 'Cancelled orders report', 4),
('Stock Report', '2025-06-22', 'Restock recommendations', 3),
('Order Report', '2025-06-25', 'Orders pending payment', 2),
('Stock Report', '2025-06-27', 'Expired items report', 1);

-- Insert Stock Reports
INSERT INTO stock_report (report_id, stock_level_summary) VALUES
(1, 'All inventory stock levels summarized monthly'),
(2, 'List of items with stock below threshold'),
(5, 'Weekly stock audit completed, no discrepancies found'),
(6, 'Critical low stock warnings issued for 5 SKUs'),
(9, 'Stock turnover rates calculated for May'),
(11, 'Inventory valuation totals updated for June'),
(13, 'Restock recommendations generated based on sales'),
(15, 'Expired items identified and flagged for removal');

-- Insert Low Level Items Stock Reports
INSERT INTO low_level_items_stock_report (report_id, low_level_items) VALUES
(2, 'EG004, EG010, EG016'),
(6, 'EG001, EG005, EG012, EG016, EG018');

-- Insert Order Reports
INSERT INTO order_report (report_id, order_status_summary) VALUES
(3, 'Order statuses summarized for May'),
(7, 'Completed orders report covering all shipments'),
(10, 'Orders currently in transit across regions'),
(12, 'Report on all cancelled orders'),
(14, 'Orders pending payment listed for follow-up');

-- Insert Pending Orders Order Reports
INSERT INTO pending_orders_order_report (report_id, pending_orders) VALUES
(4, 'Orders #1023, #1045, #1050 pending processing'),
(8, 'Orders #1101, #1107 delayed due to supplier issues'),
(14, 'Orders #1150, #1155, #1160 pending payment clearance'); 