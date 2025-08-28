import { Link, Outlet } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Carousel } from "./reuse/Carousel";
import Home from "./pages/Home";
import About from "./pages/About";
import Mens from "./pages/Mens";
import womens from "./pages/Womens";
import Womens from "./pages/Womens";
import Kids from "./pages/Kids";
import Ethnic from "./pages/Ethnic-womens.jsx";
import CasualShoes from "./pages/casual-footwear.jsx";
import MenEthnic from "./pages/men-ethnic.jsx";
import Menformal from "./pages/mens-formal.jsx";
import ProductSearchPage from "./ProductSearch.jsx";
import MenWallet from "./pages/Men-wallet.jsx";
import MenAcc from "./pages/mens-accesories.jsx";
import MenBelt from "./pages/men-belt.jsx";
import WesternMan from "./pages/WesternMan.jsx";
import WcasShoes from "./pages/WomCasShoe.jsx";
import WomEth from "./pages/womEthnic.jsx";
import KcasualShoes from "./pages/kidsCasualShoes.jsx";
import MTraditionalshoes from "./pages/mensTraditionalshoes.jsx";
import WtradShoes from "./pages/kidsCasualShoes copy.jsx";
import MenLounge from "./pages/MensLounge.jsx";
import WesternwoMan from "./pages/WesternMan copy.jsx";
import Wacc from "./pages/womAcc.jsx";


function App() {

   //this one is for data jo carousel page pe hai jaha baaki trending add kiye jaayenge in future 
    const carouselData = [
    { img: "https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350", link: "/home" },
    { img: "https://res.cloudinary.com/stealthman22/image/upload/v1586308023/new-portfolio/hero/two-cargo-ships-sailing-near-city-2144905.jpg", link: "/about" },
    { img: "https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350", link: "/mens" },
  ];
    
  return (
     <div className="">
      <Routes>
      <Route path="/" element={<Carousel items={carouselData} />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/ethnic-womens" element={<Ethnic />} />
      <Route path="/casual-shoes" element={<CasualShoes />} />
      <Route path="/product-scrap" element={<ProductSearchPage />} />
      <Route path="/men-formal" element={<Menformal />} />
      <Route path="/men-wallet" element={<MenWallet />} />
      <Route path="/wcasual-shoes" element={<WcasShoes />} />
      <Route path="/western-man" element={<WesternMan />} />
      <Route path="/men-accessories" element={<MenAcc />} />
      <Route path="/men-belt" element={<MenBelt />} />
      <Route path="/ethnic-women" element={<WomEth />} />
      <Route path="/kcasual-shoes" element={<KcasualShoes />} />
      <Route path="/tm-shoes" element={<MTraditionalshoes />} />
      <Route path="/women-western" element={<WesternwoMan />} />
      <Route path="/wom-acc" element={<Wacc />} />
      <Route path="/search-fabfinds" element={<ProductSearchPage />} />


      <Route path="/traditional-wfootwear" element={<WtradShoes />} />
      <Route path="/m-loungewear" element={<MenLounge />} />
      <Route path="/men-ethnic" element={<MenEthnic />} />
      <Route path="/mens" element={<Mens />} />
      <Route path="/womens" element={<Womens />} />
      <Route path="/kids" element={<Kids />} />
       <Route path="*" element={<Navigate to="/" replace />} />
      
      </Routes></div>
    
  );
}

export default App;
