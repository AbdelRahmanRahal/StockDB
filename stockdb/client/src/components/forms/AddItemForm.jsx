import { useState, useEffect, useContext } from 'react';
import { getAllSuppliers } from '../../api/supplier';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddItemForm({ onAdd }) {
  const [form, setForm] = useState({
    sku: '',
    product_name: '',
    description: '',
    price: '',
    stock_level: '',
    supplier_id: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchSuppliers = async () => {
      setLoadingSuppliers(true);
      setError(null);
      try {
        const data = await getAllSuppliers();
        console.log('Fetched suppliers:', data);
        setSuppliers(data);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
        
        if (err.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          logout();
          navigate('/login');
        } else {
          setError('Failed to load suppliers. Please try again later.');
        }
      } finally {
        setLoadingSuppliers(false);
      }
    };
    
    fetchSuppliers();
  }, [isAuthenticated, navigate, logout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock_level: parseInt(form.stock_level, 10),
        supplier_id: form.supplier_id || null
      };
      
      await onAdd(payload);
      
      // Reset form on success
      setForm({ 
        sku: '', 
        product_name: '', 
        description: '', 
        price: '', 
        stock_level: '',
        supplier_id: ''
      });
      
      toast.success('Item added successfully!');
    } catch (err) {
      console.error('Error adding item:', err);
      
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to add item. Please check your inputs and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">Add New Item</h3>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['sku','product_name','price','stock_level'].map(field => (
          <div key={field} className="relative">
            <input
              type={field === 'price' || field === 'stock_level' ? 'number' : 'text'}
              name={field}
              placeholder=" "
              value={form[field]}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 peer"
            />
            <label className="absolute left-3 top-2 text-sm text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:transform-none peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
              {field.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </label>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <textarea
            name="description"
            placeholder=" "
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 peer"
          />
          <label className="absolute left-3 top-2 text-sm text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:transform-none peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
            Description
          </label>
        </div>
        
        <div className="space-y-2">
          <div className="relative">
            <select
                name="supplier_id"
                value={form.supplier_id}
                onChange={handleChange}
                disabled={loadingSuppliers}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 peer disabled:opacity-50"
            >
                <option value="">Select a supplier (optional)</option>
                {suppliers.map(supplier => (
                    <option key={`supplier-${supplier.id}`} value={supplier.id}>
                    {supplier.supplier_name} (ID: {supplier.id})
                    </option>
                ))}
            </select>
            <label className="absolute left-3 top-2 text-sm text-gray-500 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
              Supplier
            </label>
          </div>
          {loadingSuppliers && (
            <p className="text-sm text-gray-500">Loading suppliers...</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || loadingSuppliers}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
      >
        {submitting ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  );
}