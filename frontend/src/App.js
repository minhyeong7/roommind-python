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
import QnAList from "./pages/QnAList";     // Q&A 목록
import QnAWrite from "./pages/QnAWrite";   // Q&A 글쓰기
import { CartProvider } from "./context/CartContext"; // 장바구니 Context

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

          {/* 회원가입 페이지 */}
          <Route path="/signup" element={<Signup />} />

          {/* 로그인 페이지 */}
          <Route path="/login" element={<Login />} />

          {/* 장바구니 페이지 */}
          <Route path="/cart" element={<CartPage />} />

          {/* ✅ Q&A 게시판 라우팅 추가 */}
          <Route path="/qna" element={<QnAList />} />
          <Route path="/qna/write" element={<QnAWrite />} />
        </Routes>

        <Footer />
        <TopButton />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
