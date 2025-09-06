import React, { useEffect, useState } from "react";
import { Tabs } from "../reuse/tabs"; // Adjust path based on your project structure

export default function Ethnic(){
  const [EthnicProducts, setEthnicProducts] = useState([]);


  // src/api.js or wherever you build API urls
export const API = 'https://fabfind-fabselect-1-backend.onrender.com';




  
  useEffect(() => {
    // Fetch all products and filter by category 'Men'
    fetch("${API}/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Assuming your product schema has a `category` field
        const ethnicItems = data.filter((product) => product.category === "women-ethnic");
        setEthnicProducts(ethnicItems);
      })
      .catch((err) => console.error("Error fetching ethnic women's products:", err));
  }, []);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Ethnic women's Fashion</h2>
      {/* Pass mensProducts to Tabs */}
      <Tabs products={EthnicProducts} />
    </div>
  );
}
