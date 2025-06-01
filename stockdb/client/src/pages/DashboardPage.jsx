import { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import AddItemModal from '../components/modals/AddItemModal';
import AddSupplierModal from '../components/modals/AddSupplierModal';
import ItemList from '../components/dashboard/ItemList';
import ProfileModal from '../components/modals/ProfileModal';
import { getAllItems, createItem } from '../api/inventory';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, isAuthenticated, authLoading } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
    setItems((prev) => [...prev, { ...newItem, stock_level: itemData.stock_level }]);
    toast.success('Item added successfully');
    return newItem;
  };

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    document.title = `${user.userType} Dashboard | StockDB`;
  } else {
    document.title = 'Loading... | StockDB';
  }

  return (
    <>
      {/* Header with modal triggers */}
      <Header
        onOpenAddItem={() => setIsAddItemOpen(true)}
        onOpenAddSupplier={() => setIsAddSupplierOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <div className="container mx-auto p-20">
        <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
        {/* Only Staff/Admin can see inventory */}
        {(user.userType === 'Staff' || user.userType === 'Admin') ? (
          <>
            <ItemList items={items} />
          </>
        ) : (
          <p>You do not have permission to view this page.</p>
        )}
      </div>

      {/* Modals */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAdd={handleAdd}
      />
      <AddSupplierModal
        isOpen={isAddSupplierOpen}
        onClose={() => setIsAddSupplierOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}