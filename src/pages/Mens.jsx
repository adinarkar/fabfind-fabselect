import React, { useEffect, useState } from "react";
import { Tabs } from "../reuse/tabs"; // Adjust path based on your project structure
import { ImageCard } from "../reuse/CategoryTabs";
import { Carousel } from "../reuse/Carousel";

export default function Mens(){
  const [mensProducts, setMensProducts] = useState([]);
   const cardsData = [
    {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "Casual Shoes COLLECTION",
      text: "Best casual shoes collection by Samadhan!",
      lastUpdated: "",
      routeTo: "/casual-shoes",
    },
  {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "Casual Ethnic COLLECTION",
      text: "Best men's ethnic collection by Saniya!",
      lastUpdated: "",
      routeTo: "/men-ethnic",
    },
     {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "Casual Formal COLLECTION",
      text: "Best men's Formal collection by Shreya!",
      lastUpdated: "",
      routeTo: "/men-formal",
    },
    {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "Casual accessories COLLECTION",
      text: "Best men's accessory collection",
      lastUpdated: "",
      routeTo: "/men-accessories",
    },
    {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "Men's Western COLLECTION",
      text: "Best men's western collection by swanandi",
      lastUpdated: "",
      routeTo: "/western-man",
    },
    {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "Casual Shoes COLLECTION",
      text: "Best traditional shoes collection by Prathamesh!",
      lastUpdated: "",
      routeTo: "/tm-shoes",
    },
    {
      img: "https://picsum.photos/id/1015/1000/400",
      title: "Casual Shoes COLLECTION",
      text: "Best men's loungewear by swarali",
      lastUpdated: "",
      routeTo: "/m-loungewear",
    },
  ];

  useEffect(() => {
    // Fetch all products and filter by category 'Men'
    fetch("https://fabfind-fabselect-1-backend.onrender.com")
      .then((res) => res.json())
      .then((data) => {
        // Assuming your product schema has a `category` field
        const menItems = data.filter((product) => product.category === "Men");
        setMensProducts(menItems);
      })
      .catch((err) => console.error("Error fetching men's products:", err));
  }, []);

  const carouselData = [
    { img: "https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350", link: "/men-formal" },
    { img: "https://res.cloudinary.com/stealthman22/image/upload/v1586308023/new-portfolio/hero/two-cargo-ships-sailing-near-city-2144905.jpg", link: "/men-ethnic" },
    { img: "https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350", link: "/casual-shoes" },
  ];

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Men's Fashion</h2>
      {/* Pass mensProducts to Tabs */}
      
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
                       
                        <Carousel items={carouselData} />

                      <h1>trending</h1>
      <Tabs products={mensProducts} />


    </div>
  );
}
