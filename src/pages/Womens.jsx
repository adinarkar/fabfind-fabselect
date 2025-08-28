import React, { useEffect, useState } from "react";
import { Tabs } from "../reuse/tabs"; // Adjust path based on your project structure
import { ImageCard } from "../reuse/CategoryTabs"

export default function Womens(){
  const [womensProducts, setWomensProducts] = useState([]);
  const cardsData = [
    {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "Indowestern COLLECTION",
      text: "Best OF ethnic by Aishwarya Kadam",
      lastUpdated: "",
      routeTo: "/ethnic-womens",
    },
    {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "Casual shoes COLLECTION",
      text: "Best Women's Casual Shoes collection by ruddhi",
      lastUpdated: "",
      routeTo: "/wcasual-shoes",
    },
    {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "ethnic women's COLLECTION",
      text: "Best women's ethnic collection by shravanee",
      lastUpdated: "",
      routeTo: "/ethnic-women",
    },
    {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "traditional women's footwear COLLECTION",
      text: "Best women's traditional footwear collection by sahil",
      lastUpdated: "",
      routeTo: "/traditional-wfootwear",
    },
    {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "traditional women's footwear COLLECTION",
      text: "Best women's Western collection by riya",
      lastUpdated: "",
      routeTo: "/women-western",
    },
    {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "traditional women's footwear COLLECTION",
      text: "Best women's Western collection by riya",
      lastUpdated: "",
      routeTo: "/women-western",
    },
    {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "traditional women's footwear COLLECTION",
      text: "Best women's Western collection by riya",
      lastUpdated: "",
      routeTo: "/wom-acc",
    }
  
  
  ]
  

  useEffect(() => {
    // Fetch all products and filter by category 'Men'
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Assuming your product schema has a `category` field
        const womenItems = data.filter((product) => product.category === "women");
        setWomensProducts(womenItems);
      })
      .catch((err) => console.error("Error fetching women's products:", err));
  }, []);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Women's Fashion</h2>
    
            <h1>Categories</h1>
             
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
               
      
      <Tabs products={womensProducts} />
      
      </div>
      
      
  );
}
