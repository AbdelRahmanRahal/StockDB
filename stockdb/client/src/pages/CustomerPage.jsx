import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllItems } from '../api/inventory';
import { getAllSuppliers } from '../api/supplier';
import { getOrders, createOrder } from '../api/order';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import ProfileModal from '../components/modals/ProfileModal';

export default function CustomerPage() {
  const { user, isAuthenticated, authLoading } = useContext(AuthContext);
  const [loadingData, setLoadingData] = useState(true);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);

  // Cart state: each entry { sku, quantity }
  const [cart, setCart] = useState([]);
  
  // State for profile modal
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch products, suppliers, and existing orders on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsData, suppliersData, ordersData] = await Promise.all([
          getAllItems(),
          getAllSuppliers(),
          getOrders(),
        ]);
        setProducts(itemsData);
        setSuppliers(suppliersData);
        setOrders(ordersData);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load shopping data.');
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  // Add one product to cart (or increment quantity)
  const addToCart = (sku) => {
    setCart((prev) => {
      const existingItem = prev.find((it) => it.sku === sku);
      if (existingItem) {
      // Return new array with updated quantity
        return prev.map((item) => 
          item.sku === sku 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      } else {
        // Add new item with quantity 1
        return [...prev, { sku, quantity: 1 }];
      }
    });
  };

  // Adjust quantity manually
  const updateQuantity = (sku, newQty) => {
    setCart((prev) => {
      return prev
        .map((it) => (it.sku === sku ? { ...it, quantity: newQty } : it))
        .filter((it) => it.quantity > 0);
    });
  };

  // Place order: pick a supplier (for simplicity, if all items share same supplier, use that; else ask user to select)
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty.');
      return;
    }

    // Derive supplier_id: 
    // Here we assume customer must pick one supplier for entire order.
    // For example, if all products in cart share the same supplier, auto‐set; else prompt.
    const allSkus = cart.map((it) => it.sku);
    // Build map from SKU → supplier_id (by looking at products array)
    const skuToSupplier = {};
    for (const p of products) {
      skuToSupplier[p.sku] = p.supplier_id;
    }
    const supplierIds = [...new Set(allSkus.map((s) => skuToSupplier[s]))];
    let chosenSupplierId = null;

    if (supplierIds.length === 1) {
      chosenSupplierId = supplierIds[0];
    } else {
      // If multiple suppliers, just pick the first (or prompt user in a real UI)
      chosenSupplierId = supplierIds[0];
      toast.info('Mixed suppliers in cart; defaulting to first supplier.');
    }

    try {
      const result = await createOrder({
        supplier_id: chosenSupplierId,
        items: cart,
      });
      toast.success('Order placed!');
      // Append new order to local orders list
      setOrders((prev) => [...result.order ? [result.order] : [], ...prev]);
      setCart([]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order.');
    }
  };

  if (authLoading || loadingData) {
    return <div>Loading …</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user.userType !== 'Customer') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      {/* Add Header component */}
      <Header 
        onOpenAddItem={() => {}} // Not used in customer view
        onOpenAddSupplier={() => {}} // Not used in customer view
        onOpenProfile={() => setIsProfileOpen(true)}
      />
      
      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />
      
      <div className="container mx-auto p-6 pt-20"> {/* Added pt-20 to account for header height */}
        <h1 className="text-2xl font-bold mb-6">Customer Shopping Portal</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Available Items */}
          <section className="lg:w-2/3">
            <h2 className="text-xl font-semibold mb-4">Available Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.sku} className="border rounded-lg p-4 bg-white shadow-sm">
                  <h3 className="font-medium">{p.product_name}</h3>
                  <p>Price: ${Number(p.price).toFixed(2)}</p>
                  <p>Stock: {p.stock_level}</p>
                  <button
                    onClick={() => addToCart(p.sku)}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Right Column - Cart and Orders */}
          <div className="lg:w-1/3 space-y-6">
            {/* Shopping Cart */}
            <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
            <section className="border rounded-lg p-4 bg-white shadow-sm">
              {cart.length === 0 ? (
                  <p className="text-gray-500">Cart is empty.</p>
              ) : (
                  <div className="space-y-3">
                  {cart.map((it) => {
                      const product = products.find((p) => p.sku === it.sku);
                      return (
                      <div
                        key={it.sku}
                        className="flex justify-between items-center"
                      >
                        <span className="truncate max-w-[180px]">{product?.product_name || it.sku}</span>
                        <input
                          type="number"
                          min="1"
                          value={it.quantity}
                          onChange={(e) => updateQuantity(it.sku, parseInt(e.target.value, 10))}
                          className="w-16 border px-2 py-1 rounded"
                        />
                      </div>
                    );
                  })}
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                  >
                    Place Order
                  </button>
                </div>
              )}
            </section>

            {/* Past Orders */}
            <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
            <section className="border rounded-lg p-4 bg-white shadow-sm">
              {orders.length === 0 ? (
                <p className="text-gray-500">No orders yet.</p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="border-b pb-3 last:border-b-0"
                    >
                      <div className="flex justify-between text-sm">
                        <span>Order #{o.id}</span>
                        <span className={`font-medium ${
                          o.order_status === 'completed' ? 'text-green-600' : 
                          o.order_status === 'pending' ? 'text-yellow-600' : 
                          'text-gray-600'
                        }`}>
                          {o.order_status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(o.order_date).toLocaleString()}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        Total: ${parseFloat(o.revenue).toFixed(2)}
                      </p>
                      <details className="mt-1 text-sm">
                        <summary className="cursor-pointer text-blue-600">View items</summary>
                        <ul className="list-disc ml-4 mt-1">
                          {o.items.map((it) => (
                            <li key={it.sku} className="text-xs">
                              {it.product_name || it.sku} &times; {it.quantity} @ ${parseFloat(it.price).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}