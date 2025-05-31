import React from 'react';
import AddSupplierForm from '../forms/AddSupplierForm';

export default function AddSupplierModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <AddSupplierForm onClose={onClose} />
      </div>
    </div>
  );
}