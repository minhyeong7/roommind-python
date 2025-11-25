import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import AddressModal from "../components/AddressModal";
import "./OrderPage.css";

function OrderPage() {
  const { cartItems, totalPrice } = useContext(CartContext);

  // 기본 배송지 정보
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

  const [sameAsAddress, setSameAsAddress] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  // 선택된 결제수단
  const [payMethod, setPayMethod] = useState("CARD");

  // 주소 선택 시
  const handleSelectAddress = (addr) => {
    setAddress(addr);
    if (sameAsAddress) {
      setBuyer({
        name: addr.name,
        phone: addr.phone,
        email: addr.email,
      });
    }
    setOpenModal(false);
  };

  // =============================
  // PortOne 결제 요청
  // =============================
  const requestPortOne = async (method) => {
    if (!window.PortOne) {
      alert("결제 모듈 로딩 실패! 새로고침 후 다시 시도해주세요.");
      return;
    }

    const channelKeyMap = {
      CARD: "channel_test_81cb64f5-4954-47bf-85d3-1fa9d6af4540",
      TOSSPAY: "channel_test_ed04567d-9a71-487b-9c63-e38d1f00cbba",
      NAVERPAY: "channel_test_55bba057-85ce-4fb1-af98-dc4c8c7f5555",
      KAKAOPAY: "channel_test_c11c113c-a31a-4a7e-9f8b-3123123bbb11",
    };

    try {
      const response = await window.PortOne.requestPayment({
        storeId: "store_test_72bbef3b-8348-47f9-9a6a-65cc5e9022d3",
        channelKey: channelKeyMap[method],
        payMethod: method,
        paymentId: `payment_${Date.now()}`,
        orderName:
          cartItems.length > 1
            ? `${cartItems[0].name} 외 ${cartItems.length - 1}개`
            : cartItems[0].name,
        totalAmount: totalPrice,
        currency: "KRW",

        customer: {
          fullName: buyer.name,
          phoneNumber: buyer.phone,
          email: buyer.email,
        },

        // ⭐ 결제 완료 페이지로 이동
        redirectUrl: `${window.location.origin}/order/success`,
      });

      console.log("결제 응답:", response);
    } catch (err) {
      console.error(err);
      alert("결제 실패 또는 취소되었습니다.");
    }
  };

  // =============================
  // 결제하기 버튼 클릭
  // =============================
  const handlePayment = () => {
    if (payMethod === "BANK") {
      // ⭐ 무통장입금은 바로 완료 페이지 이동
      window.location.href = "/order/bank";
      return;
    }

    requestPortOne(payMethod);
  };

  return (
    <div className="order-page">
      <div className="order-left">
        
        {/* 배송지 정보 */}
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

        {/* 주문자 정보 */}
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
              onChange={(e) => setBuyer((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="input-row">
            <label>전화번호</label>
            <input
              value={buyer.phone}
              onChange={(e) => setBuyer((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="input-row">
            <label>이메일</label>
            <input
              value={buyer.email}
              onChange={(e) => setBuyer((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </section>

        {/* 주문 상품 */}
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

        {/* 쿠폰/포인트 */}
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

        {/* 결제수단 */}
        <section className="order-box">
          <h3>결제수단</h3>

          <div className="payment-methods">
            <button className={`pm ${payMethod === "CARD" ? "active" : ""}`} onClick={() => setPayMethod("CARD")}>카드 결제</button>
            <button className={`pm ${payMethod === "TOSSPAY" ? "active" : ""}`} onClick={() => setPayMethod("TOSSPAY")}>토스페이</button>
            <button className={`pm ${payMethod === "NAVERPAY" ? "active" : ""}`} onClick={() => setPayMethod("NAVERPAY")}>네이버페이</button>
            <button className={`pm ${payMethod === "KAKAOPAY" ? "active" : ""}`} onClick={() => setPayMethod("KAKAOPAY")}>카카오페이</button>
            <button className={`pm ${payMethod === "BANK" ? "active" : ""}`} onClick={() => setPayMethod("BANK")}>무통장입금</button>
          </div>
        </section>
      </div>

      {/* 결제 요약 */}
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
            <span className="final-price">{totalPrice.toLocaleString()}원</span>
          </div>

          <button className="pay-btn" onClick={handlePayment}>
            결제하기
          </button>
        </div>
      </div>

      {/* 주소 모달 */}
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
