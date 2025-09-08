const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
const corsOptions = {
  origin:'https://adinarkar.github.io',
  methods: ['GET','POST','DELETE'],
  allowedHeaders:['Content-Type','Authorization']
}
  app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = "mongodb+srv://aditya2402263101:MySecurePass123@cluster0.gbu7nxo.mongodb.net/fashionDB?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Product Routes
const productRoutes = require("./routes/productRoutes");
console.log("Registering /api/products route...");
app.use("/api/products", productRoutes);

// Test route
app.get("/", (req, res) => res.send("Backend suxxess!"));

const PORT = process.env.PORT || '10000';
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
