import { useState } from 'react';
import AuthForm from './AuthForm';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Replace with actual API URL
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log(data); // TODO: Handle token, redirect, etc.
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
