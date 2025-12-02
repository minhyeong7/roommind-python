import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
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
import QnAList from "./pages/qna/QnAList";
import QnAWrite from "./pages/qna/QnAWrite";

/* 커뮤니티페이지 */
import CommunityPage from "./pages/community/CommunityPage";
import CommunityWrite from "./pages/community/CommunityWrite";
import PopularPage from "./pages/popular/PopularPage";
import CommunityDetailPage from "./pages/community/CommunityDetailPage/CommunityDetailPage";


/* 맥락 */
import { CartProvider } from "./context/CartContext";

/* 기타 페이지 */
import InteriorPage from "./pages/InteriorPage";
import ShopPage from "./components/shop/ShopPage";

/* 관리자 페이지 */
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManage from "./pages/admin/ProductManage";
import UserManage from "./pages/admin/UserManage";
import ProductNew from "./pages/admin/ProductNew";
import AdminProductDetail from "./pages/admin/AdminProductDetail";
import ProductEdit from "./pages/admin/ProductEdit";
import CategoryManage  from "./pages/admin/CategoryEdit";
import AdminQnaList from "./pages/admin/AdminQnaList";
import AdminQnaDetail from "./pages/admin/AdminQnaDetail";




/* 유저 마이페이지 */
import MyPage from "./pages/user/MyPage";
import OrderList from "./pages/user/OrderList";
import ReviewList from "./pages/user/ReviewList";

/* 주문서페이지 */
import OrderPage from "./pages/OrderPage";

import OrderSuccess from "./pages/OrderSuccess";
import OrderBank from "./pages/OrderCompleteBank";

/* 소셜 로그인 처리 페이지들 */
import LoginSuccess from "./pages/LoginSuccess";
import LoginError from "./pages/LoginError";
import QnADetail from "./pages/qna/QnADetail";
import QnAEdit from "./pages/qna/QnAEdit";
import CommunityEditPage from "./pages/community/CommunityDetailPage/CommunityEditPage";


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

           {/* 소셜 로그인 성공/실패 페이지 */}
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/login-error" element={<LoginError />} />

          {/* 장바구니 */}
          <Route path="/cart" element={<CartPage />} />


          {/* 커뮤니티 */}
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/:id" element={<CommunityDetailPage />} />
          <Route path="/community/write" element={<CommunityWrite />} />
          <Route path="/community/:id/edit" element={<CommunityEditPage />} />


          <Route path="/popular" element={<PopularPage />} />

          {/* Q&A */}
          <Route path="/qna" element={<QnAList />} />
          <Route path="/qna/write" element={<QnAWrite />} />
          <Route path="/qna/:id" element={<QnADetail />} />
          <Route path="/qna/edit/:id" element={<QnAEdit />} />


          {/* 인테리어 */}
          <Route path="/interior" element={<InteriorPage />} />

          {/* 쇼핑 */}
          <Route path="/shop" element={<ShopPage />} />

          

          <Route path="/order" element={<OrderPage />} />
          <Route path="/order/success" element={<OrderSuccess />} />
          <Route path="/order/bank" element={<OrderBank />} />
                    


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
            path="/admin/products/new"
            element={
              <AdminRoute>
                <ProductNew />
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
          {/* 관리자 QnA 리스트 */}
            <Route
              path="/admin/qna"
              element={
                <AdminRoute>
                  <AdminQnaList />
                </AdminRoute>
              }
            />

            {/* 관리자 QnA 상세 페이지 */}
            <Route
              path="/admin/qna/:id"
              element={
                <AdminRoute>
                  <AdminQnaDetail />
                </AdminRoute>
              }
            />


          <Route path="/admin/product/:id" element={<AdminProductDetail />} />
          <Route path="/admin/products/:id/edit" element={<ProductEdit />} />
          <Route path="/admin/categories" element={<CategoryManage />} />






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
