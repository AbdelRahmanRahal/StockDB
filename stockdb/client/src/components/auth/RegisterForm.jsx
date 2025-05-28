import { useState } from 'react';
import AuthForm from './AuthForm';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Replace with actual API URL
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log(data); // TODO: Handle success, redirect, etc.
  };

  return (
    <AuthForm
      formType="register"
      onSubmit={handleSubmit}
      formData={formData}
      onChange={handleChange}
    />
  );
}
