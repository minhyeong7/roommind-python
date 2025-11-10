// src/pages/CartPage.js
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./CartPage.css";

function CartPage() {
  const { cartItems, removeFromCart, totalPrice } = useContext(CartContext);

  const handleOrder = () => {
    alert("🧾 주문 페이지로 이동합니다 (추후 결제 기능 연동 예정)");
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container empty">
        <h2><i class="bi bi-cart-fill"></i> 장바구니</h2>
        <p>추가된 상품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2><i class="bi bi-cart-fill"></i> 장바구니</h2>

      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-img" />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>{item.price.toLocaleString()}원</p>
              <p>수량: {item.quantity}</p>
            </div>
            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              삭제
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>총합계: {totalPrice.toLocaleString()}원</h3>
        <button className="order-btn" onClick={handleOrder}>
          주문하기
        </button>
      </div>
    </div>
  );
}

export default CartPage;
