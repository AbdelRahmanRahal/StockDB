import LoginForm from '../components/auth/LoginForm';
import { useEffect } from 'react';

export default function LoginPage() {
  useEffect(() => {
    document.title = 'Login | StockDB';
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}