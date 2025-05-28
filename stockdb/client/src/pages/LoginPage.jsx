import LoginForm from '../components/auth/LoginForm';
import { useEffect } from 'react';

export default function LoginPage() {
  useEffect(() => {
    document.title = 'Login | StockDB';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}