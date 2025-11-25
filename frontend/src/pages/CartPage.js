// src/pages/CartPage.js
import React, { useContext, useState } from "react";
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
  } = useContext(CartContext);

  // 선택 상품 ID 저장 (문자열로 강제)
  const [selectedItems, setSelectedItems] = useState([]);

  // 전체 선택
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => String(item.uniqueId)));
    }
  };

  // 개별 선택
  const toggleItem = (id) => {
    const strId = String(id);

    setSelectedItems((prev) =>
      prev.includes(strId)
        ? prev.filter((x) => x !== strId)
        : [...prev, strId]
    );
  };

  // 선택상품 총합
  const selectedTotal = cartItems
    .filter((item) => selectedItems.includes(String(item.uniqueId)))
    .reduce((acc, item) => {
      const price = Number(String(item.price).replace(/,/g, "")) || 0;
      return acc + price * item.quantity;
    }, 0);

  // 주문하기
  const handleOrder = () => {
    if (selectedItems.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }
    navigate("/order", { state: { selectedItems } });
  };

  return (
    <div className="cart-page">
      <h2 className="cart-title">🛒 장바구니</h2>

      <div className="cart-wrapper">

        {/* 💛 왼쪽 상품 리스트 */}
        <div className="cart-left">

          {/* 전체 선택 */}
          <div className="cart-select-all">
            <input
              type="checkbox"
              checked={selectedItems.length === cartItems.length}
              onChange={toggleSelectAll}
            />
            <span>전체 선택</span>
          </div>

          {/* 상품 목록 */}
          {cartItems.map((item) => (
            <div key={item.uniqueId} className="cart-item">

              {/* 개별 선택 */}
              <input
                type="checkbox"
                checked={selectedItems.includes(String(item.uniqueId))}
                onChange={() => toggleItem(item.uniqueId)}
              />

              <img src={item.image} alt="" className="cart-item-img" />

              <div className="cart-info">
                <h3>{item.name}</h3>
                <p className="price">
                  {(item.price * item.quantity).toLocaleString()}원
                </p>

                {/* 수량 조절 */}
                <div className="qty-box">
                  <button
                    onClick={() =>
                      updateQuantity(item.uniqueId, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.uniqueId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                {/* 옵션 선택 */}
                <select
                  value={item.option}
                  onChange={(e) =>
                    updateOption(item.uniqueId, item.id, e.target.value)
                  }
                  className="option-select"
                >
                  {(item.options ?? ["기본옵션"]).map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>

              {/* 삭제 버튼 */}
              <button
                className="cart-remove"
                onClick={() => removeFromCart(item.uniqueId)}
              >
                삭제
              </button>
            </div>
          ))}
        </div>

        {/* 💛 오른쪽 요약 */}
        <div className="cart-right">
          <div className="summary-box">

            <div className="summary-row">
              <span>총 상품금액</span>
              <strong>{selectedTotal.toLocaleString()}원</strong>
            </div>

            <div className="summary-row">
              <span>배송비</span>
              <strong>0원</strong>
            </div>

            <div className="summary-row">
              <span>쿠폰 적용</span>
              <select className="coupon-select">
                <option>사용 가능한 쿠폰 없음</option>
              </select>
            </div>

            <hr />

            <div className="summary-total">
              <span>결제금액</span>
              <strong>{selectedTotal.toLocaleString()}원</strong>
            </div>

            <button className="order-btn" onClick={handleOrder}>
              선택 상품 주문하기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CartPage;
