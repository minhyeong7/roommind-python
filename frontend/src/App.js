import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "./routes/AdminRoute";

/* 공통 컴포넌트 */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TopButton from "./components/TopButton";

/* 일반 페이지 */
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CartPage from "./pages/CartPage";

/* QnA */
import QnAList from "./pages/QnAList";
import QnAWrite from "./pages/QnAWrite";

/* 커뮤니티페이지 */
import CommunityPage from "./pages/community/CommunityPage";
import PopularPage from "./pages/popular/PopularPage";


/* 맥락 */
import { CartProvider } from "./context/CartContext";

/* 기타 페이지 */
import InteriorPage from "./pages/InteriorPage";
import ShopPage from "./components/shop/ShopPage";

/* 관리자 페이지 */
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManage from "./pages/admin/ProductManage";
import UserManage from "./pages/admin/UserManage";
import QnaManage from "./pages/admin/QnaManage";

/* 유저 마이페이지 */
import MyPage from "./pages/user/MyPage";
import OrderList from "./pages/user/OrderList";
import ReviewList from "./pages/user/ReviewList";



function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* 홈 */}
          <Route path="/" element={<Home />} />

          {/* 상품 상세 */}
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* 회원가입 & 로그인 */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* 장바구니 */}
          <Route path="/cart" element={<CartPage />} />

          <Route path="/community" element={<CommunityPage />} />

          <Route path="/popular" element={<PopularPage />} />

          {/* Q&A */}
          <Route path="/qna" element={<QnAList />} />
          <Route path="/qna/write" element={<QnAWrite />} />

          {/* 인테리어 */}
          <Route path="/interior" element={<InteriorPage />} />

          {/* 쇼핑 */}
          <Route path="/shop" element={<ShopPage />} />


          {/* ----------------------------- */}
          {/* 👑 관리자 페이지(Admin 전용 보호) */}
          {/* ----------------------------- */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <ProductManage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManage />
              </AdminRoute>
            }
          />
           <Route
            path="/admin/qna"
            element={
              <AdminRoute>
                <QnaManage />
              </AdminRoute>
            }
          />


          {/* ----------------------------- */}
          {/* 👤 일반 사용자 마이페이지 */}
          {/* ----------------------------- */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/orders" element={<OrderList />} />
          <Route path="/mypage/reviews" element={<ReviewList />} />
        </Routes>

        <Footer />
        <TopButton />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
