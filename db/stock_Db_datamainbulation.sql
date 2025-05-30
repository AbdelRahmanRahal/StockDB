-- Insert 3 Suppliers
INSERT INTO Supplier (supplier_name, contact_information) VALUES
('Cairo Supplies', 'info@cairosupplies.eg'),
('Alexandria Traders', 'contact@alextraders.eg'),
('Delta Goods Co.', 'support@deltagoods.eg');


-- Insert 20 Users
INSERT INTO "User" (first_name, last_name, email, password, user_type) VALUES
('Mahmoud', 'Mohamed', 'mahmoud.m@example.com', 'pass123', 'Customer'),
('drAhmed','Hishalm Qandi','aqandil@nu.edu.eg','P@ss02020','Admin'),
('Abderhman', 'Rahal', 'abderhman.r@example.com', 'pass123', 'Admin'),
('Nour', 'Sharkawy', 'nour.s@example.com', 'pass123', 'staff'),
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
-- Insert 20 Products
INSERT INTO Product (sku, product_name, description, price, supplier_id) VALUES
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
INSERT INTO Inventory (stock_level, sku) VALUES
(150, 'EG001'), (120, 'EG002'), (100, 'EG003'), (80, 'EG004'), (70, 'EG005'),
(90, 'EG006'), (110, 'EG007'), (60, 'EG008'), (130, 'EG009'), (75, 'EG010'),
(140, 'EG011'), (50, 'EG012'), (85, 'EG013'), (60, 'EG014'), (200, 'EG015'),
(30, 'EG016'), (45, 'EG017'), (95, 'EG018'), (100, 'EG019'), (150, 'EG020');
-- insert into admin
 INSERT INTO Admin (user_id, admin_level, last_login_audit) VALUES
(2, 'Super Admin', NOW()),
(3, 'Manager', NOW()),
(14, 'Supervisor', NOW());
-- insert into staff 
INSERT INTO Staff (user_id, department, role) VALUES
(4, 'Logistics', 'Inventory Manager'),
(8, 'Procurement', 'Buyer'),
(12, 'Sales', 'Sales Rep'),
(19, 'Operations', 'Warehouse Staff');
-- insert into customer 
INSERT INTO Customer (user_id, shipping_address, billing_address, phone_number, loyalty_points, preferred_payment_method) VALUES
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
-- insert in to order
INSERT INTO "Order" (
    supplier_id, customer_id, order_date, delivery_estimated, received_date, order_status, revenue
) VALUES
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
-- select orderif from order
SELECT * FROM "Order";


-- insert into orderitem 
INSERT INTO order_item (order_id, sku, quantity) VALUES
(21, 'EG001', 10),
(22, 'EG002', 5),
(23, 'EG003', 7),
(24, 'EG004', 2),
(25, 'EG005', 3),
(26, 'EG006', 1),
(27, 'EG007', 9),
(28, 'EG008', 4),
(29, 'EG009', 6),
(30, 'EG010', 8),
(31, 'EG011', 5),
(32, 'EG012', 7),
(33, 'EG013', 3);
-- insert into payements 
INSERT INTO Payment (amount, payment_date, payment_method, transaction_status, customer_id, order_id) VALUES
(120.00, '2025-05-03', 'Credit Card', 'Completed', 1, 1),
(80.00, '2025-05-05', 'Cash', 'Pending', 5, 2),
(140.00, '2025-05-06', 'Mobile Wallet', 'Completed', 6, 3),
(95.00, '2025-05-07', 'Debit Card', 'Pending', 7, 4),
(160.00, '2025-05-08', 'Credit Card', 'Completed', 9, 5),
(130.00, '2025-05-09', 'Mobile Wallet', 'Pending', 10, 6),
(200.00, '2025-05-10', 'Debit Card', 'Completed', 11, 7),
(170.00, '2025-05-11', 'Cash', 'Pending', 13, 8),
(220.00, '2025-05-12', 'Credit Card', 'Completed', 15, 9),
(150.00, '2025-05-13', 'Mobile Wallet', 'Pending', 16, 10),
(250.00, '2025-05-14', 'Cash', 'Completed', 17, 11),
(180.00, '2025-05-15', 'Debit Card', 'Pending', 18, 12),
(210.00, '2025-05-16', 'Credit Card', 'Completed', 20, 13),
(160.00, '2025-05-17', 'Mobile Wallet', 'Pending', 21, 14),
(190.00, '2025-05-18', 'Credit Card', 'Completed', 1, 15),
(135.00, '2025-05-19', 'Cash', 'Pending', 5, 16),
(175.00, '2025-05-20', 'Debit Card', 'Completed', 6, 17),
(155.00, '2025-05-21', 'Mobile Wallet', 'Pending', 7, 18),
(220.00, '2025-05-22', 'Credit Card', 'Completed', 9, 19),
(165.00, '2025-05-23', 'Cash', 'Pending', 10, 20);
-- insert into payements 
INSERT INTO Payment (order_id, payment_date, amount, payment_method) VALUES
(21, '2025-05-02', 240.00, 'Credit Card'),
(22, '2025-05-06', 160.00, 'Cash'),
(23, '2025-05-04', 280.00, 'Credit Card'),
(24, '2025-05-07', 190.00, 'Cash'),
(25, '2025-05-09', 320.00, 'Bank Transfer'),
(26, '2025-05-10', 260.00, 'Credit Card'),
(27, '2025-05-11', 400.00, 'Cash'),
(28, '2025-05-12', 340.00, 'Credit Card'),
(29, '2025-05-13', 440.00, 'Cash'),
(30, '2025-05-14', 300.00, 'Bank Transfer'),
(31, '2025-05-15', 500.00, 'Credit Card'),
(32, '2025-05-16', 360.00, 'Cash'),
(33, '2025-05-17', 550.00, 'Credit Card');
-- insert into alert  
-- Use SELECT to get current_stock because:
-- current_stock should reflect the actual stock level of the inventory item at the time of insertion.
-- This value is stored in the Inventory table and may change over time,
-- so we fetch it dynamically using a SELECT query to ensure accuracy.
INSERT INTO Alert (threshold, current_stock, alert_date, inventory_id)
VALUES
(70, (SELECT stock_level FROM Inventory WHERE inventory_id = 48), CURRENT_DATE, 48),
(70, (SELECT stock_level FROM Inventory WHERE inventory_id = 52), CURRENT_DATE, 52),
(70, (SELECT stock_level FROM Inventory WHERE inventory_id = 54), CURRENT_DATE, 54),
(70, (SELECT stock_level FROM Inventory WHERE inventory_id = 56), CURRENT_DATE, 56),
(70, (SELECT stock_level FROM Inventory WHERE inventory_id = 57), CURRENT_DATE, 57);
-- insert into reports
INSERT INTO Report (report_type, generated_date, description, user_id) VALUES
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
-- Stock_Report entries
INSERT INTO Stock_Report (report_id, stock_level_summary) VALUES
(1, 'All inventory stock levels summarized monthly'),
(2, 'List of items with stock below threshold'),
(5, 'Weekly stock audit completed, no discrepancies found'),
(6, 'Critical low stock warnings issued for 5 SKUs'),
(9, 'Stock turnover rates calculated for May'),
(11, 'Inventory valuation totals updated for June'),
(13, 'Restock recommendations generated based on sales'),
(15, 'Expired items identified and flagged for removal');

-- low_level_items_stock_report entries
INSERT INTO low_level_items_stock_report (report_id, low_level_items) VALUES
(2, 'EG004, EG010, EG016'),
(6, 'EG001, EG005, EG012, EG016, EG018');

-- Order_Report entries
INSERT INTO Order_Report (report_id, order_status_summary) VALUES
(3, 'Order statuses summarized for May'),
(7, 'Completed orders report covering all shipments'),
(10, 'Orders currently in transit across regions'),
(12, 'Report on all cancelled orders'),
(14, 'Orders pending payment listed for follow-up');

-- pending_orders_order_report entries
INSERT INTO pending_orders_order_report (report_id, pending_orders) VALUES
(4, 'Orders #1023, #1045, #1050 pending processing'),
(8, 'Orders #1101, #1107 delayed due to supplier issues'),
(14, 'Orders #1150, #1155, #1160 pending payment clearance');
--  UPDATE Inventory: Update the stock level for a specific product in the Inventory table (e.g., increase stock for product EG005):
update inventory
SET stock_level = stock_level + 20
WHERE sku = 'EG005';
-- update customer 
UPDATE Customer
SET phone_number = '01100000000'
WHERE user_id = 1;
-- delete 
DELETE FROM inventory WHERE sku = 'EG020';

-- Now it's safe to delete from product
DELETE FROM product WHERE sku = 'EG020';
 -- delete 
 DELETE FROM Customer
WHERE user_id = 21;
SELECT first_name, last_name, preferred_payment_method
FROM Customer
JOIN "User" ON Customer.user_id = "User".user_id
WHERE preferred_payment_method = 'Credit Card';











