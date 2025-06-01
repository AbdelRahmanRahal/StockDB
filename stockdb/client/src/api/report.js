/**
 * getReportSummary()
 *   • Sends GET /api/dev-reports/summary
 *   • Requires Authorization: Bearer {token}
 *   • Returns { stockSummary, lowStock, orderStatusSummary, pendingOrders }
 */
export async function getReportSummary() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  const response = await fetch('/api/dev-reports/summary', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch reports.');
  }

  const data = await response.json();
  return data;
}
