import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';
import { login } from '../../api/auth';
import AuthForm from './AuthForm';
import { toast } from 'react-toastify';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login: authLogin } = useContext(AuthContext);
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading();
    
    try {
      const { user, token } = await login(formData);
      authLogin(user, token); // Pass both user and token
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.toString());
    } finally {
      hideLoading();
    }
  };

  return (
    <AuthForm
      formType="login"
      onSubmit={handleSubmit}
      formData={formData}
      onChange={handleChange}
    />
  );
}