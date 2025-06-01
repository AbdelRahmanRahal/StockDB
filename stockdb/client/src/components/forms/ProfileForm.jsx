import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../api/profile';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function ProfileForm({ onClose }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userType = user?.userType;
  const userId = user?.id;

  // We no longer keep first_name / last_name in local state;
  // they come directly from AuthContext.user.
  const [form, setForm] = useState({
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    // Customer-specific:
    shipping_address: '',
    billing_address: '',
    phone_number: '',
    loyalty_points: 0,
    preferred_payment_method: '',
    // Staff-specific:
    department: '',
    role: '',
    // Admin-specific:
    admin_level: '',
    last_login_audit: '',
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch existing profile data on mount
  useEffect(() => {
    if (!userId || !token) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await getProfile();
        // Merge only subtype fields and email into form state.
        setForm((prev) => ({
          ...prev,
          email: data.email || '',
          ...(userType === 'Customer' && {
            shipping_address: data.shipping_address || '',
            billing_address: data.billing_address || '',
            phone_number: data.phone_number || '',
            loyalty_points: data.loyalty_points || 0,
            preferred_payment_method: data.preferred_payment_method || '',
          }),
          ...(userType === 'Staff' && {
            department: data.department || '',
            role: data.role || '',
          }),
          ...(userType === 'Admin' && {
            admin_level: data.admin_level || '',
            last_login_audit: data.last_login_audit || '',
          }),
        }));
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile.');
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, [userId, userType, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'loyalty_points') {
      setForm((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Build payload: always include first_name/last_name from AuthContext.user
      const payload = {
        first_name: user.firstName,
        last_name: user.lastName,
        // Email is readonly and shouldn't change, but we include it to match GET response
        email: user.email,
        ...(userType === 'Customer' && {
          shipping_address: form.shipping_address.trim(),
          billing_address: form.billing_address.trim(),
          phone_number: form.phone_number.trim(),
          loyalty_points: form.loyalty_points,
          preferred_payment_method: form.preferred_payment_method.trim(),
        }),
        ...(userType === 'Staff' && {
          department: form.department.trim(),
          role: form.role.trim(),
        }),
        ...(userType === 'Admin' && {
          admin_level: form.admin_level.trim(),
          last_login_audit: form.last_login_audit.trim(),
        }),
      };

      await updateProfile(payload);
      toast.success('Profile updated successfully.');
      onClose();
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        logout();
        navigate('/login');
      } else {
        toast.error(err.message || 'Failed to update profile.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProfile) {
    return <div>Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Your Profile</h3>

      {/* First Name (readonly) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">First Name</label>
        <div className="mt-1 px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg">
          {user.firstName}
        </div>
      </div>

      {/* Last Name (readonly) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Last Name</label>
        <div className="mt-1 px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg">
          {user.lastName}
        </div>
      </div>

      {/* Email (readonly) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <div className="mt-1 px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg">
          {user.email}
        </div>
      </div>

      {/* Conditionally render extra fields based on userType */}
      {userType === 'Customer' && (
        <>
          {/* Shipping Address */}
          <div className="relative">
            <textarea
              name="shipping_address"
              placeholder=" "
              value={form.shipping_address}
              onChange={handleChange}
              rows={2}
              required
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
              Shipping Address
            </label>
          </div>

          {/* Billing Address */}
          <div className="relative">
            <textarea
              name="billing_address"
              placeholder=" "
              value={form.billing_address}
              onChange={handleChange}
              rows={2}
              required
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
              Billing Address
            </label>
          </div>

          {/* Phone Number */}
          <div className="relative">
            <input
              type="text"
              name="phone_number"
              placeholder=" "
              value={form.phone_number}
              onChange={handleChange}
              required
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
              Phone Number
            </label>
          </div>

          {/* Loyalty Points (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Loyalty Points</label>
              <div className="mt-1 px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg">
                {form.loyalty_points}
              </div>
          </div>

          {/* Preferred Payment Method */}
          <div className="relative">
            <input
              type="text"
              name="preferred_payment_method"
              placeholder=" "
              value={form.preferred_payment_method}
              onChange={handleChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
              Preferred Payment Method
            </label>
          </div>
        </>
      )}

      {userType === 'Staff' && (
        <>
          {/* Department */}
          <div className="relative">
            <input
              type="text"
              name="department"
              placeholder=" "
              value={form.department}
              onChange={handleChange}
              required
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
              Department
            </label>
          </div>

          {/* Role */}
          <div className="relative">
            <input
              type="text"
              name="role"
              placeholder=" "
              value={form.role}
              onChange={handleChange}
              required
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
              Role
            </label>
          </div>
        </>
      )}

      {userType === 'Admin' && (
        <>
          {/* Admin Level */}
          <div className="relative">
            <input
              type="text"
              name="admin_level"
              placeholder=" "
              value={form.admin_level}
              onChange={handleChange}
              required
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
              Admin Level
            </label>
          </div>

          {/* Last Login Audit (readonly) */}
          <div className="relative">
            <input
              type="text"
              name="last_login_audit"
              placeholder=" "
              value={form.last_login_audit}
              readOnly
              className="block w-full px-3 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-lg focus:outline-none peer"
            />
            <label className="absolute left-3 top-2 text-sm text-gray-500">
              Last Login Audit (readonly)
            </label>
          </div>
        </>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50"
      >
        {submitting ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}
