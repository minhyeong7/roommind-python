import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail"; 

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<Home />} />
        
        {/* 상품 상세페이지 라우트 추가 */}
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
