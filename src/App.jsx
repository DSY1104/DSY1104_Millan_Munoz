import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navigation.jsx";
import Footer from "./components/common/Footer.jsx";
import HomePage from "./pages/Home.jsx";
import BlogPage from "./pages/Blog.jsx";
import About from "./pages/About.jsx";
import Cart from "./pages/Cart.jsx";
import CatalogPage from "./pages/Products.jsx";
import ProductDetailPage from "./pages/ProductDetail.jsx";
import SupportPage from "./pages/Support.jsx";




export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path='/about' element={<About />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/products' element={<CatalogPage />} />
        <Route path='/product/:id' element={<ProductDetailPage />} />
        <Route path='/support' element={<SupportPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

