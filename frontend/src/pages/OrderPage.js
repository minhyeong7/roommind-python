import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import AddressModal from "../components/AddressModal";
import "./OrderPage.css";


function OrderPage() {
  const { cartItems, totalPrice } = useContext(CartContext);

  // 배송지(기본값)
  const [address, setAddress] = useState({
    name: "김노아",
    phone: "010-0000-0000",
    email: "noa@example.com",
    zipcode: "12345",
    address1: "인천광역시 남동구 석산로 216번길",
    address2: "6 (구월동, 금영빌라) 금영빌라 202호",
  });

  // 주문자 정보
  const [buyer, setBuyer] = useState({
    name: "김노아",
    phone: "010-0000-0000",
    email: "noa@example.com",
  });

  // 주문자 정보 = 배송지 정보 동일
  const [sameAsAddress, setSameAsAddress] = useState(true);

  // 모달 표시
  const [openModal, setOpenModal] = useState(false);

  // 배송지 선택 시 실행
  const handleSelectAddress = (addr) => {
    setAddress(addr);

    // 주문자 정보도 함께 변경
    if (sameAsAddress) {
      setBuyer({
        name: addr.name,
        phone: addr.phone,
        email: addr.email,
      });
    }
    setOpenModal(false);
  };

  const handlePayment = async () => {
  const { PortOne } = window;

  try {
    const response = await PortOne.requestPayment({
      storeId: "store_test_f9c981b0-xxxx-xxxx", // 테스트용 storeId
      paymentId: `payment_${Date.now()}`,
      orderName: `${cartItems[0].name} 외 ${cartItems.length - 1}개`,
      totalAmount: totalPrice, // 총 결제 금액
      currency: "KRW",
      channelKey: "channel_test_6dd1b7cc-xxxx-xxxx",  // 카드결제 테스트 채널키
      payMethod: "CARD",

      customer: {
        fullName: buyer.name,
        phoneNumber: buyer.phone,
        email: buyer.email,
      },

      redirectUrl: `http://localhost:3000/order/success`,
    });

    console.log("결제 응답:", response);

  } catch (error) {
    alert("결제 실패 또는 취소됨");
    console.error(error);
  }
};


  return (
    <div className="order-page">

      {/* ============================= */}
      {/* 배송지 정보 */}
      {/* ============================= */}
      <div className="order-left">

        <section className="order-box address-box">
          <div className="box-header">
            <h3>배송지 정보</h3>

            <div className="address-actions">
              <button onClick={() => setOpenModal(true)}>배송지 변경</button>
            </div>
          </div>

          <div className="input-row">
            <label>우편번호</label>
            <input value={address.zipcode} readOnly />
          </div>

          <div className="input-row">
            <label>주소</label>
            <input value={address.address1} readOnly />
          </div>

          <div className="input-row">
            <label>상세주소</label>
            <input
              value={address.address2}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, address2: e.target.value }))
              }
            />
          </div>
        </section>

        {/* ============================= */}
        {/* 주문자 정보 */}
        {/* ============================= */}
        <section className="order-box">
          <h3>주문자 정보</h3>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={sameAsAddress}
              onChange={(e) => {
                setSameAsAddress(e.target.checked);

                if (e.target.checked) {
                  setBuyer({
                    name: address.name,
                    phone: address.phone,
                    email: address.email,
                  });
                }
              }}
            />
            주문 정보와 동일
          </label>

          <div className="input-row">
            <label>이름</label>
            <input
              value={buyer.name}
              onChange={(e) =>
                setBuyer((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="input-row">
            <label>전화번호</label>
            <input
              value={buyer.phone}
              onChange={(e) =>
                setBuyer((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>

          <div className="input-row">
            <label>이메일</label>
            <input
              value={buyer.email}
              onChange={(e) =>
                setBuyer((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
        </section>

        {/* ============================= */}
        {/* 주문 상품 */}
        {/* ============================= */}
        <section className="order-box">
          <h3>주문 상품</h3>

          {cartItems.map((item) => (
            <div className="order-product" key={item.uniqueId}>
              <img src={item.image} alt="" />

              <div className="p-info">
                <p className="p-name">{item.name}</p>
                <p className="p-option">옵션: {item.option}</p>
                <p className="p-qty">수량: {item.quantity}</p>
              </div>

              <div className="p-price">
                {(item.price * item.quantity).toLocaleString()}원
              </div>
            </div>
          ))}
        </section>

        {/* ============================= */}
        {/* 쿠폰 / 포인트 */}
        {/* ============================= */}
        <section className="order-box">
          <h3>쿠폰 / 포인트</h3>

          <div className="input-row">
            <label>쿠폰</label>
            <input placeholder="사용 가능한 쿠폰이 없습니다" readOnly />
          </div>

          <div className="input-row">
            <label>포인트</label>
            <input placeholder="0" readOnly />
          </div>
        </section>

        {/* ============================= */}
        {/* 결제수단 */}
        {/* ============================= */}
        <section className="order-box">
          <h3>결제수단</h3>
          <div className="payment-methods">
            <button className="pm active">카드</button>
            <button className="pm">토스페이</button>
            <button className="pm">네이버페이</button>
            <button className="pm">카카오페이</button>
            <button className="pm">무통장입금</button>
          </div>
        </section>
      </div>

      {/* ============================= */}
      {/* 오른쪽 결제 요약 */}
      {/* ============================= */}
      <div className="order-right">
        <div className="summary-box">
          <h3>결제 금액</h3>

          <div className="sum-row">
            <span>총 상품 금액</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>

          <div className="sum-row">
            <span>배송비</span>
            <span>0원</span>
          </div>

          <hr />

          <div className="sum-final">
            <span>최종 결제 금액</span>
            <span className="final-price">
              {totalPrice.toLocaleString()}원
            </span>
          </div>

          <button className="pay-btn" onClick={handlePayment}>
          결제하기
         </button>

        </div>
      </div>

      {/* 배송지 변경/추가 모달 */}
      {openModal && (
        <AddressModal
          closeModal={() => setOpenModal(false)}
          onSelect={handleSelectAddress}
        />
      )}
    </div>

    
  );
}

export default OrderPage;
