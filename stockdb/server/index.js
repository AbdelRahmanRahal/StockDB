const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const devAuthRouter = require('./routes/devAuthRoutes');
const devDataRouter = require('./routes/devDataRoutes');
const devProfileRouter = require('./routes/devProfileRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const stockRoutes = require('./routes/stockRoutes');
const pool = require('./config/db');
const app = express();

const PORT = process.env.SERVER_PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api', devAuthRouter);
app.use('/api', devDataRouter);
app.use('/api', devProfileRouter);

app.listen(PORT, () => {
  console.log(`[SERVER] Listening on port https://localhost:${PORT}`);
});