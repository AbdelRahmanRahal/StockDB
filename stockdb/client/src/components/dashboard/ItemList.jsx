import React from 'react';

export default function ItemList({ items }) {
  return (
    <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-semibold mb-4">Current Inventory</h3>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            {['SKU', 'Name', 'Quantity', 'Price'].map(header => (
              <th key={header} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.sku} className="border-b last:border-0">
              <td className="px-4 py-2 text-sm">{item.sku}</td>
              <td className="px-4 py-2 text-sm">{item.product_name}</td>
              <td className="px-4 py-2 text-sm">{item.stock_level}</td>
              <td className="px-4 py-2 text-sm">${item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}