const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const pool = require('./config/db');
const app = express();

const PORT = process.env.SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      message: 'Database connection successful',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Database connection failed',
      details: error.message 
    });
  }
});

// Sample route
app.get('/', (req, res) => {
  res.send('StockDB server is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
