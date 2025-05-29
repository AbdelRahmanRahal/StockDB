import RegisterForm from '../components/auth/RegisterForm';
import { useEffect } from 'react';

export default function RegisterPage() {
  useEffect(() => {
    document.title = 'Register | StockDB';
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}