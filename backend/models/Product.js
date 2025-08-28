const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  description: String,
  image: String,
  category: String, // <-- Add this field
  amazon: {
    price: Number,
    link: String,
  },
  flipkart: {
    price: Number,
    link: String,
  },
  myntra: {
    price: Number,
    link: String,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
