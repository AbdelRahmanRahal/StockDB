import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header({ onOpenAddItem, onOpenAddSupplier }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const userType = user?.userType;

  return (
    <header className="bg-black text-white sticky top-0 z-50 w-full shadow-lg">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo in white circle */}
        <div className="flex items-center">
          <div className="bg-white rounded-full p-2 mr-4">
            <Link to="/">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            </Link>
          </div>
        </div>
        
        {/* Navigation buttons as integrated blocks */}
        <nav className="flex flex-1 items-stretch h-full">
          {userType === 'Customer' ? (
            <>
              <Link 
                to="/buy" 
                className="flex-1 flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 border-x border-gray-700"
              >
                Buy
              </Link>
              <Link 
                to="/about" 
                className="flex-1 flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 border-r border-gray-700"
              >
                About Us
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={onOpenAddItem}
                className="flex-1 flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 border-x border-gray-700"
              >
                Add Item
              </button>
              <button
                onClick={onOpenAddSupplier}
                className="flex-1 flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 border-r border-gray-700"
              >
                Add Supplier
              </button>
            </>
          )}
        </nav>

        {/* Logout button */}
        {user && (
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 h-full px-6 border-l border-gray-700"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}