import { useEffect, useState } from 'react'
import './App.css'
import { Navigate } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navigate to="/login" replace />
    </>
  )
}

export default App
