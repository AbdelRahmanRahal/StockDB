/**
 * getOrders()
 *   • Sends GET /api/dev-orders
 *   • Requires Authorization: Bearer {token}
 *   • Returns [ { id, order_date, order_status, revenue, items: [ … ] }, … ]
 */

export async function getOrders() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  const response = await fetch('/api/dev-orders', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch orders.');
  }
  const data = await response.json();
  return data; // [ { id, order_date, order_status, revenue, items: [ … ] }, … ]
}

/**
 * createOrder({ supplier_id, items })
 *   • Sends POST /api/dev-orders with JSON body { supplier_id, items }
 *   • Requires Authorization: Bearer {token}
 *   • items = [ { sku: string, quantity: number }, … ]
 *   • Returns { order: { id, order_date, order_status, revenue, items } }
 */

export async function createOrder({ supplier_id, items }) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  const response = await fetch('/api/dev-orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ supplier_id, items }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to create order.');
  }

  const data = await response.json();
  return data; // { order: { id, order_date, order_status, revenue, items } }
}
