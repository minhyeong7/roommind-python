import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "./routes/AdminRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

/* 공통 컴포넌트 */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TopButton from "./components/TopButton";

/* 페이지 */
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Signup from "./pages/login/Signup";
import Login from "./pages/login/Login";
import CartPage from "./pages/cart/CartPage";

/* QnA */
import QnAList from "./pages/qna/QnAList";
import QnAWrite from "./pages/qna/QnAWrite";
import QnADetail from "./pages/qna/QnADetail";
import QnAEdit from "./pages/qna/QnAEdit";

/* 커뮤니티 */
import CommunityPage from "./pages/community/CommunityPage";
import CommunityWrite from "./pages/community/CommunityWrite";
import CommunityDetailPage from "./pages/community/CommunityDetailPage/CommunityDetailPage";
import CommunityEditPage from "./pages/community/CommunityDetailPage/CommunityEditPage";
import PopularPage from "./pages/popular/PopularPage";



/* 컨텍스트 */
import { CartProvider } from "./pages/cart/CartContext";

/* 기타 */
import InteriorPage from "./pages/InteriorPage";
import ShopPage from "./components/shop/ShopPage";

/* 관리자 페이지 */
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManage from "./pages/admin/ProductManage";
import UserManage from "./pages/admin/UserManage";
import ProductNew from "./pages/admin/ProductNew";
import AdminProductDetail from "./pages/admin/AdminProductDetail";
import ProductEdit from "./pages/admin/ProductEdit";
import CategoryManage from "./pages/admin/CategoryEdit";
import AdminQnaList from "./pages/admin/AdminQnaList";
import AdminQnaDetail from "./pages/admin/AdminQnaDetail";
import AdminProfile from "./pages/admin/AdminProfile";
import OrderManage from "./pages/admin/OrderManage";
import AdminOrderDetail from "./pages/admin/OrderDetail";

/* 마이페이지 */
import MyPageLayout from "./pages/user/MyPageLayout";
import MyPage from "./pages/user/MyPage";
import OrderList from "./pages/user/OrderList";
import OrderDetail from "./pages/user/OrderDetail";
import ReviewList from "./pages/user/ReviewList";
import MyCommunity from "./pages/user/MyCommunity";
import MyQnA from "./pages/user/MyQnA";
import ProfileEdit from "./pages/user/ProfileEdit";
import AddressList from "./pages/user/AddressList";

/* 주문 */
import OrderPage from "./pages/order/OrderPage";
import OrderSuccess from "./pages/order/OrderSuccess";
import OrderFail from "./pages/order/OrderFail";
import OrderBank from "./pages/order/OrderCompleteBank";

/* 소셜 로그인 */
import LoginSuccess from "./pages/login/LoginSuccess";
import LoginError from "./pages/login/LoginError";


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* 일반 사용자 접근 가능 */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/login-error" element={<LoginError />} />

          {/* 장바구니 - 로그인 필수 */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          {/* 커뮤니티 */}
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/:id" element={<CommunityDetailPage />} />

          {/* 커뮤니티 글쓰기/수정 → 로그인 필수 */}
          <Route
            path="/community/write"
            element={
              <ProtectedRoute>
                <CommunityWrite />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community/:id/edit"
            element={
              <ProtectedRoute>
                <CommunityEditPage />
              </ProtectedRoute>
            }
          />

          {/* 인기 */}
          <Route path="/popular" element={<PopularPage />} />

          {/* QnA */}
          <Route path="/qna" element={<QnAList />} />
          <Route path="/qna/:id" element={<QnADetail />} />

          {/* QnA 작성/수정 → 로그인 필수 */}
          <Route
            path="/qna/write"
            element={
              <ProtectedRoute>
                <QnAWrite />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qna/edit/:id"
            element={
              <ProtectedRoute>
                <QnAEdit />
              </ProtectedRoute>
            }
          />

          {/* 인테리어/쇼핑 */}
          <Route path="/interior" element={<InteriorPage />} />
          <Route path="/shop" element={<ShopPage />} />

          {/* 주문 전체 로그인 필수 */}
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order/success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route path="/order/fail" element={<OrderFail />} />

          <Route
            path="/order/bank"
            element={
              <ProtectedRoute>
                <OrderBank />
              </ProtectedRoute>
            }
          />

          {/* 마이페이지 전체 보호 */}
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPageLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MyPage />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/:orderId" element={<OrderDetail />} />
            <Route path="reviews" element={<ReviewList />} />
            <Route path="community" element={<MyCommunity />} />
            <Route path="qna" element={<MyQnA />} />
            <Route path="profile" element={<ProfileEdit />} />
            <Route path="address" element={<AddressList />} />
          </Route>

          {/* 관리자 페이지 */}
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

          <Route
            path="/admin/qna"
            element={
              <AdminRoute>
                <AdminQnaList />
              </AdminRoute>
            }
          />

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
          <Route path="/admin/profile" element={<AdminProfile />} />

          <Route path="/admin/orders" element={<OrderManage />} />
          <Route path="/admin/orders/:orderId" element={<AdminOrderDetail />} />
        </Routes>

        <Footer />
        <TopButton />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
