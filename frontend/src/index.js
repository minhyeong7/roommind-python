import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap-icons/font/bootstrap-icons.css";
import { CartProvider } from './pages/cart/CartContext'; // ✅ 추가

const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     {/* ✅ 전역으로 CartProvider 적용 */}
//     <CartProvider>
//       <App />
//     </CartProvider>
//   </React.StrictMode>
// );

// ⭐ StrictMode 제거 (운영 환경) 
root.render(
  <CartProvider>
    <App />
  </CartProvider>
);

// 성능 측정 (기본)
reportWebVitals();

// 성능 측정 (기본)
reportWebVitals();
