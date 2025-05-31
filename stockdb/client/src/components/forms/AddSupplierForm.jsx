import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { createSupplier } from '../../api/supplier';

export default function AddSupplierForm({ onClose }) {
  const [form, setForm] = useState({ supplier_name: '', contact_information: '' });
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createSupplier(form);
      toast.success('Supplier added successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        logout();
        navigate('/login');
      } else {
        toast.error(err.message || 'Failed to add supplier.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Redirect if not authenticated:
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold">Add New Supplier</h3>

      <div className="relative">
        <input
          type="text"
          name="supplier_name"
          placeholder=" "
          value={form.supplier_name}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 peer"
        />
        <label className="absolute left-3 top-2 text-sm text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:transform-none peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
          Supplier Name
        </label>
      </div>

      <div className="relative">
        <input
          type="text"
          name="contact_information"
          placeholder=" "
          value={form.contact_information}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 peer"
        />
        <label className="absolute left-3 top-2 text-sm text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:transform-none peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
          Contact Information
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
      >
        {submitting ? 'Adding...' : 'Add Supplier'}
      </button>
    </form>
  );
}