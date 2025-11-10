import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<Home />} />

        {/* 상품 상세페이지 */}
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* 회원가입 페이지 */}
        <Route path="/signup" element={<Signup />} />

        {/* 로그인 페이지 */}
        <Route path="/login" element={<Login />} />
      </Routes>

      {/* 모든 페이지 하단에 Footer 표시 */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
