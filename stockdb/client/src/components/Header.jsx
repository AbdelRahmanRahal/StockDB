import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header({ onOpenAddItem, onOpenAddSupplier, onOpenProfile }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const userType = user?.userType;

  return (
    <header class="top-header" className="bg-black text-white sticky top-0 z-50 w-full shadow-md">
      <div className="flex items-center justify-between w-full h-16">
        {/* Logo */}
        <div className="h-full flex items-center px-4">
          <Link to="/" className="flex items-center">
            <div className="bg-white rounded-full p-1.5">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            </div>
            <div className="ml-2 text-3xl text-white font-bold font-[Avant Garde]">
              StockDB
            </div>
          </Link>
        </div>

        {/* Profile Button (always visible if logged in) */}
        {user && (
          <button
            onClick={onOpenProfile}
            className="h-full px-4 flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 border-l border-gray-700"
          >
            Profile
          </button>
        )}

        {/* Nav buttons */}
        <nav className="flex flex-1 h-full">
          {userType === 'Customer' ? (
            <>
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

        {/* Logout */}
        {user && (
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="h-full px-6 flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 border-l border-gray-700"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}