// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

/* ---------- CORS (allow only your sites) ---------- */
const allowedOrigins = new Set([
  'https://fabfind.shop',   // production frontend
  'http://localhost:5173',  // Vite dev
]);

const corsOptions = {
  origin(origin, callback) {
    // allow server-to-server, curl, Postman (no Origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,          // set true only if you use cookies
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight

// Remove any manual CORS header middleware you had earlier.
// DO NOT also set Access-Control-* headers yourself; let cors() handle it.

/* ---------- middleware ---------- */
app.use(express.json());

/* ---------- MongoDB ---------- */
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI not set in environment. Exiting.');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

/* ---------- routes ---------- */
const productRoutes = require('./routes/productRoutes');
console.log('Registering /api/products route...');
app.use('/api/products', productRoutes);

/* ---------- test route ---------- */
app.get('/', (req, res) => res.send('Backend success!'));

/* ---------- start ---------- */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

