import React, { useEffect, useState } from "react";
import { Tabs } from "../reuse/tabs"; // Adjust path based on your project structure


export default function MenBelt(){
  const [menFormalProducts, setmenFormalProducts] = useState([]);

  useEffect(() => {
 
    fetch('https://fabfind-fabselect-1-backend.onrender.com/api/products')
      .then((res) => res.json())
      .then((data) => {
        // Assuming your product schema has a `category` field
        const menFormalItems = data.filter((product) => product.category === "men-belt");
        setmenFormalProducts(menFormalItems);
      })
      .catch((err) => console.error("Error fetching men's Formal products:", err));
  }, []);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Men's belt</h2>
      
      <Tabs products={menFormalProducts} />
    </div>
  );
}
