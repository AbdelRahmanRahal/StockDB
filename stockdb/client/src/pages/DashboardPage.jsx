import React, { useState, useEffect, useContext } from 'react';
import AddItemForm from '../components/dashboard/AddItemForm';
import ItemList from '../components/dashboard/ItemList';
import { getAllItems, createItem } from '../api/inventory';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function DashboardPage() {
  const { user, isAuthenticated, authLoading } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItems();
        setItems(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load inventory.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleAdd = async (itemData) => {
    const newItem = await createItem(itemData);
    setItems(prev => [...prev, { ...newItem, stock_level: itemData.stock_level }]);
    toast.success('Item added successfully');
    return newItem;
  };

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
      {/* Only staff or admin can see this */}
      {(user.user_type === 'Staff' || user.user_type === 'Admin') ? (
        <>
          <AddItemForm onAdd={handleAdd} />
          <ItemList items={items} />
        </>
      ) : (
        <p>You do not have permission to view this page.</p>
      )}
    </div>
  );
}