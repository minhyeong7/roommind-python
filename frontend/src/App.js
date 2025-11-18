import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import TopButton from "./components/TopButton"; 

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CartPage from "./pages/CartPage";

import QnAList from "./pages/QnAList";     
import QnAWrite from "./pages/QnAWrite";

import { CartProvider } from "./context/CartContext";

import InteriorPage from "./pages/InteriorPage";
import ShopPage from "./components/shop/ShopPage";   // ← 쇼핑 페이지 전용

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* 홈 */}
          <Route path="/" element={<Home />} />

          {/* 상품 상세페이지 */}
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* 회원가입 & 로그인 */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* 장바구니 */}
          <Route path="/cart" element={<CartPage />} />

          {/* Q&A 게시판 */}
          <Route path="/qna" element={<QnAList />} />
          <Route path="/qna/write" element={<QnAWrite />} />

          {/* 인테리어 */}
          <Route path="/interior" element={<InteriorPage />} />

          {/* 쇼핑 (카테고리는 여기서만!) */}
          <Route path="/shop" element={<ShopPage />} />
        </Routes>

        <Footer />
        <TopButton />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
