export async function getAllSuppliers() {
  // 1) Grab token from localStorage (AuthContext already put it there on login)
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  const response = await fetch('/api/dev-suppliers', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    // Try to extract a more detailed error
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch suppliers.');
  }

  const data = await response.json();
  return data; // [ { id, supplier_name }, … ]
}

export async function createSupplier(supplierData) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  const response = await fetch('/api/dev-suppliers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(supplierData),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to create supplier.');
  }

  const newSupplier = await response.json();
  return newSupplier;
}