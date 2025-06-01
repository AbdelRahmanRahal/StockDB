import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CustomerPage from './pages/CustomerPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import { LoadingProvider } from './context/LoadingContext.jsx';
import AuthProvider from './context/AuthContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import GlobalLoadingOverlay from './components/GlobalLoadingOverlay.jsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

const NotFoundPage = () => <div>404 Not Found</div>;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LoadingProvider>
          <>
            <GlobalLoadingOverlay />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/customer"
                element={
                  <ProtectedRoute>
                    <CustomerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </>
        </LoadingProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);