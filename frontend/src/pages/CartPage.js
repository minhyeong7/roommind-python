// src/pages/CartPage.js
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./CartPage.css";

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    updateOption,
    totalPrice,
  } = useContext(CartContext);

  const handleOrder = () => {
    alert("🧾 주문 페이지로 이동합니다 (결제 연동 예정)");
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h2 className="cart-title"><i className="bi bi-cart-fill"></i> 장바구니</h2>
        <div className="cart-container empty">
          <p>추가된 상품이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* ✅ 제목을 박스 밖으로 이동 */}
      <h2 className="cart-title"><i className="bi bi-cart-fill"></i> 장바구니</h2>

      <div className="cart-container">
        <div className="cart-list">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.option}`} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />

              <div className="cart-item-info">
                <h3 className="item-name">{item.name || item.title}</h3>
                <p className="item-price">{item.price.toLocaleString()}원</p>
              </div>

              <div className="cart-item-controls">
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item.id, item.option, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.option, item.quantity + 1)}>+</button>
                </div>

                <select
                  value={item.option || "default"}
                  onChange={(e) => updateOption(item.id, item.option, e.target.value)}
                  className="option-select"
                >
                  <option value="white">화이트</option>
                  <option value="oak">오크</option>
                  <option value="black">블랙</option>
                </select>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id, item.option)}
                >
                  삭제
                </button>
              </div>
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
    </div>
  );
}

export default CartPage;
