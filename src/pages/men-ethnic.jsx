import React, { useEffect, useState } from "react";
import { Tabs } from "../reuse/tabs"; // Adjust path based on your project structure


export default function MenEthnic(){
  const [menEthnicProducts, setmenEthnicProducts] = useState([]);

  useEffect(() => {
 
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Assuming your product schema has a `category` field
        const menEthnicItems = data.filter((product) => product.category === "men-ethnic");
        setmenEthnicProducts(menEthnicItems);
      })
      .catch((err) => console.error("Error fetching men's ethnic products:", err));
  }, []);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Men's Ethnic Fashion</h2>
      
      <Tabs products={menEthnicProducts} />
    </div>
  );
}
