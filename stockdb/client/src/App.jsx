import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div> </div>
    </>
  )
}

export default App

// Example of how to fetch data from the server
// function App() {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:5000/api/items')
//       .then(res => res.json())
//       .then(data => setItems(data));
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold">Inventory</h1>
//       <ul>
//         {items.map(item => (
//           <li key={item.id}>{item.name} - {item.quantity} in stock</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
