const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const app = express();

const PORT = process.env.SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);

// Sample route
app.get('/', (req, res) => {
  res.send('StockDB server is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
