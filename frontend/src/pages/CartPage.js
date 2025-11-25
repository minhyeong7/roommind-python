// src/pages/CartPage.js
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    updateOption,
    totalPrice,
  } = useContext(CartContext);

  // 주문하기 버튼 → 주문서 페이지 이동
  const handleOrder = () => {
    navigate("/order");
  };

  // 장바구니가 비었을 때
  if (!cartItems || cartItems.length === 0) {
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

      {/* 제목 */}
      <h2 className="cart-title"><i className="bi bi-cart-fill"></i> 장바구니</h2>

      <div className="cart-container">

        {/* 상품 리스트 */}
        <div className="cart-list">

          {cartItems.map((item) => (
            <div key={item.uniqueId} className="cart-item">

              {/* 상품 이미지 */}
              <img src={item.image} alt={item.name} className="cart-item-img" />

              {/* 상품 정보 */}
              <div className="cart-item-info">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">{item.price.toLocaleString()}원</p>
              </div>

              {/* 수량·옵션·삭제 UI */}
              <div className="cart-item-controls">

                {/* 수량 조절 */}
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}>+</button>
                </div>

                {/* 옵션 선택 */}
                <select
                  value={item.option}
                  onChange={(e) =>
                    updateOption(item.uniqueId, item.id, e.target.value)
                  }
                  className="option-select"
                >
                  {(item.options && item.options.length > 0
                    ? item.options
                    : ["기본옵션"]
                  ).map((op, idx) => (
                    <option key={idx} value={op}>
                      {op}
                    </option>
                  ))}
                </select>

                {/* 삭제 버튼 */}
                <button className="remove-btn" onClick={() => removeFromCart(item.uniqueId)}>
                  삭제
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* 결제 요약 영역 */}
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
