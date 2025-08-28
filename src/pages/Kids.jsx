import React, { useEffect, useState } from "react";
import { Tabs } from "../reuse/tabs"; // Adjust path based on your project structure

import { ImageCard } from "../reuse/CategoryTabs";




export default function Kids(){
 
   const cardsData = [
    {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "Casual Shoes COLLECTION",
      text: "Best casual shoes collection by Samadhan!",
      lastUpdated: "",
      routeTo: "/kcasual-shoes",
    },
  ];


  const [kidsProducts, setKidsProducts] = useState([]);

  useEffect(() => {
    // Fetch all products and filter by category 'Men'
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Assuming your product schema has a `category` field
        const kidsItems = data.filter((product) => product.category === "kids");
        setKidsProducts(kidsItems);
      })
      .catch((err) => console.error("Error fetching kid's products:", err));
  }, []);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Kid's Fashion</h2>

      
                       <div>
                        
                           <div className="container my-4">
                         <div className="row g-3">
                           {cardsData.map((card, index) => (
                             <div className="col-md-6 col-lg-3" key={index}>
                               <ImageCard {...card} />
                             </div>
                           ))}
                         </div>
                       </div>
                   
                       </div>
                       
                  




      {/* Pass mensProducts to Tabs */}
      <Tabs products={kidsProducts} />
    </div>
  );
}
