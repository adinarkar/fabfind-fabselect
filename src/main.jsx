import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import App from "./App";
import { NavBar } from "./reuse/navbar";
import { NavBar2 } from "./reuse/navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // for JS components like modal, dropdown, etc.


import './App.css';





ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter basename="/">
      <NavBar2></NavBar2>
      <App></App>
    </HashRouter>

  </React.StrictMode>
);
