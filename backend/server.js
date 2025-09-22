// server.js
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});



require('dotenv').config();             // npm i dotenv
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ---------- CORS ----------


const corsOptions = {
  origin: "*",
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // set true if you need to send cookies/auth from browser
  optionsSuccessStatus: 204
};

// enable CORS for all routes with the defined options
app.use(cors(corsOptions));

// ensure preflight requests are handled
app.options('*', cors(corsOptions)); // handle preflight

// ---------- middleware ----------
app.use(express.json());

// ---------- MongoDB ----------
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI not set in environment. Exiting.');
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ---------- routes ----------
const productRoutes = require('./routes/productRoutes');
console.log('Registering /api/products route...');
app.use('/api/products', productRoutes);

// ---------- test route ----------
app.get('/', (req, res) => res.send('Backend suxxess!'));

// ---------- start ----------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
