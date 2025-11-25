import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import "./OrderPage.css";

function OrderPage() {
  const { cartItems, totalPrice } = useContext(CartContext);

  // 주문자 정보
  const [orderInfo, setOrderInfo] = useState({
    name: "김노아",
    phone: "010-0000-0000",
    email: "noa@example.com",
  });

  // 배송지
  const [address, setAddress] = useState({
    address: "인천광역시 남동구 석산로216번길 6",
    detail: "금영빌라 202호",
  });

  const handleChange = (e) => {
    setOrderInfo({
      ...orderInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePay = () => {
    alert("💳 결제 API 연동 예정입니다!");
  };

  return (
    <div className="order-page">

      <div className="order-container">

        {/* 좌측 영역 */}
        <div className="order-left">

          {/* 배송지 */}
          <div className="order-box">
            <h3>배송지 정보</h3>

            <input value={address.address} readOnly />
            <input value={address.detail} readOnly />

            <button className="addr-btn">배송지 변경</button>
          </div>

          {/* 주문자 정보 */}
          <div className="order-box">
            <h3>주문자 정보</h3>

            <input
              name="name"
              value={orderInfo.name}
              onChange={handleChange}
              placeholder="이름"
            />

            <input
              name="phone"
              value={orderInfo.phone}
              onChange={handleChange}
              placeholder="전화번호"
            />

            <input
              name="email"
              value={orderInfo.email}
              onChange={handleChange}
              placeholder="이메일"
            />
          </div>

          {/* 주문 상품 */}
          <div className="order-box">
            <h3>주문 상품</h3>

            {cartItems.map((item) => (
              <div className="order-item" key={item.uniqueId}>
                <img src={item.image} alt={item.name} />

                <div className="order-item-info">
                  <p className="name">{item.name}</p>
                  <p>옵션: {item.option}</p>
                  <p>수량: {item.quantity}</p>
                </div>

                <div className="order-item-price">
                  {(item.price * item.quantity).toLocaleString()}원
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* 우측 결제 박스 */}
        <div className="order-right">

          <div className="order-summary">

            <h3>결제 금액</h3>

            <div className="summary-row">
              <span>총 상품 금액</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>

            <div className="summary-row">
              <span>배송비</span>
              <span>0원</span>
            </div>

            <hr />

            <div className="summary-total">
              <span>최종 결제 금액</span>
              <span className="total-price">
                {totalPrice.toLocaleString()}원
              </span>
            </div>

            <button className="pay-btn" onClick={handlePay}>
              결제하기
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default OrderPage;
