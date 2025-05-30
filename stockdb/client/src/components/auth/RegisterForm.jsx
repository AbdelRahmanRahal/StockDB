import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import AuthForm from './AuthForm';
import { toast } from 'react-toastify';
import { useLoading } from '../../context/LoadingContext';
import { AuthContext } from '../../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { showLoading, hideLoading } = useLoading();
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    showLoading();
    
    try {
      const [first_name, ...rest] = formData.username.trim().split(' ');
      const last_name = rest.join(' ') || '';

      const userData = {
        first_name: first_name,
        last_name: last_name,
        email: formData.email,
        password_hash: formData.password
      };
      
      const registeredUser = await register(userData);
      toast.success('Registration successful! You are now logged in.');
      
      // Automatically log in the user after registration
      authLogin(registeredUser);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.response?.data?.error?.includes('email_unique')) {
        toast.error('This email is already registered');
      } else {
        toast.error(error.toString());
      }
    } finally {
      hideLoading();
    }
  };

  return (
    <AuthForm
      formType="register"
      onSubmit={handleSubmit}
      formData={formData}
      onChange={handleChange}
      errors={errors}
    />
  );
}