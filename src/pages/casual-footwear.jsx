import React, { useEffect, useState } from "react";
import { Tabs } from "../reuse/tabs"; // Adjust path based on your project structure

export default function CasualShoes(){
  const [casualShoesProducts, setcasualShoesProducts] = useState([]);

  useEffect(() => {
    // Fetch all products and filter by category 'Men'
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Assuming your product schema has a `category` field
        const shoesItems = data.filter((product) => product.category === "casual-shoes");
        setcasualShoesProducts(shoesItems);
      })
      .catch((err) => console.error("Error fetching casual shoes's products:", err));
  }, []);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Casual Shoes Fashion</h2>
      
      <Tabs products={casualShoesProducts} />
    </div>
  );
}






