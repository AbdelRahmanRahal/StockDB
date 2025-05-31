export async function getAllItems() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  const response = await fetch('/api/dev-items', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch items.');
  }

  const data = await response.json();
  return data; // [ { sku, product_name, price, stock_level }, … ]
}

export async function createItem(itemData) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  const response = await fetch('/api/dev-items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to create item.');
  }

  const newItem = await response.json();
  return newItem;
}