// src/pages/cart/CartPage.js
import React, { useContext, useState } from "react";
import { CartContext } from "./CartContext";
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

  // 선택된 cartId 목록
  const [selectedItems, setSelectedItems] = useState([]);

  // 전체 선택
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => String(item.cartId)));
    }
  };

  // 개별 선택
  const toggleItem = (cartId) => {
    const strId = String(cartId);

    setSelectedItems((prev) =>
      prev.includes(strId)
        ? prev.filter((x) => x !== strId)
        : [...prev, strId]
    );
  };

  // 선택상품 총합
  const selectedTotal = cartItems
    .filter((item) => selectedItems.includes(String(item.cartId)))
    .reduce((acc, item) => acc + item.price * item.quantity, 0);

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

        {/* 왼쪽 리스트 */}
        <div className="cart-left">

          {/* 장바구니 비었을 때 */}
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>🛒 장바구니가 비었습니다.</p>
            </div>
          ) : (
            <>
              {/* 전체 선택 */}
              <div className="cart-select-all">
                <input
                  type="checkbox"
                  checked={
                    cartItems.length > 0 &&
                    selectedItems.length === cartItems.length
                  }
                  onChange={toggleSelectAll}
                />
                <span>전체 선택</span>
              </div>

              {/* 상품 리스트 */}
              {cartItems.map((item) => (
                <div key={item.cartId} className="cart-item">
                  
                  {/* 체크박스 */}
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(String(item.cartId))}
                    onChange={() => toggleItem(item.cartId)}
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
                          updateQuantity(item.cartId, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.cartId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    {/* 옵션 선택 */}
                    <select
                      value={item.option}
                      onChange={(e) =>
                        updateOption(item.cartId, item.productId, e.target.value)
                      }
                      className="option-select"
                    >
                      {item.options.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 삭제 */}
                  <button
                    className="cart-remove"
                    onClick={() => removeFromCart(item.cartId)}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* 오른쪽 요약 */}
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
