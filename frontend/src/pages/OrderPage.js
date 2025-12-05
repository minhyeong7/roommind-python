// src/pages/OrderPage.js

import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import AddressModal from "../components/AddressModal";
import api from "../api/userApi";
import "./OrderPage.css";

function OrderPage() {
  const { cartItems, totalPrice } = useContext(CartContext);

  /* ======================================================
      상세주소 자동 분리 함수 ⭐ 추가됨
  ====================================================== */
  const splitAddress = (full) => {
    if (!full) return ["", ""];

    // 상세주소가 끝에 붙은 경우 ex) "판교로 166 202호"
    const regex = /(.*)\s(\d+호|\d+층|\d+동|\d+호수?)$/;

    const match = full.match(regex);
    if (match) {
      return [match[1], match[2]]; // [기본주소, 상세주소]
    }

    // 규칙에 안 맞으면 상세주소 없음
    return [full, ""];
  };

  // 배송지 정보
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    email: "",
    zipcode: "",
    address1: "",
    address2: "",
  });

  // 주문자 정보
  const [buyer, setBuyer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [sameAsAddress, setSameAsAddress] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [payMethod, setPayMethod] = useState("CARD");

  /* ======================================================
      🔥 회원 정보 불러오기 + 주소 자동 파싱
  ====================================================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const email = JSON.parse(atob(token.split(".")[1])).sub;

    api
      .get(`/users/email/${email}`)
      .then((res) => {
        const user = res.data.data;

        let zipcode = "";
        let addr1 = "";
        let addr2 = "";

        /* -----------------------------------------
           CASE 1: "12345||주소||상세" (정상 저장된 경우)
        ------------------------------------------ */
        if (user.address?.includes("||")) {
          const parts = user.address.split("||");
          zipcode = parts[0] || "";
          addr1 = parts[1] || "";
          addr2 = parts[2] || "";
        }
        /* -----------------------------------------
           CASE 2: "경기 성남시 ~~ 202호" 같은 한 줄 주소
           → 자동으로 기본주소 + 상세주소 분리 ⭐ 변경됨
        ------------------------------------------ */
        else if (user.address) {
          const [base, detail] = splitAddress(user.address);
          zipcode = "";
          addr1 = base;
          addr2 = detail;
        }

        const addrObj = {
          name: user.userName,
          phone: user.phone,
          email: user.email,
          zipcode,
          address1: addr1,
          address2: addr2,
        };

        setAddress(addrObj);

        if (sameAsAddress) {
          setBuyer({
            name: user.userName,
            phone: user.phone,
            email: user.email,
          });
        }
      })
      .catch((err) => console.error("회원 정보 조회 실패:", err));
  }, []);

  /* ======================================================
      배송지 선택 모달에서 선택했을 때
  ====================================================== */
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

  /* ======================================================
      🔥 포트원 결제 요청
  ====================================================== */
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
      await window.PortOne.requestPayment({
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

        redirectUrl: `${window.location.origin}/order/success`,
      });
    } catch (err) {
      console.error(err);
      alert("결제 실패 또는 취소되었습니다.");
    }
  };

  /* ======================================================
      결제하기
  ====================================================== */
  const handlePayment = () => {
    if (payMethod === "BANK") {
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
            <button onClick={() => setOpenModal(true)}>배송지 변경</button>
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
            {["CARD", "TOSSPAY", "NAVERPAY", "KAKAOPAY", "BANK"].map((m) => (
              <button
                key={m}
                className={`pm ${payMethod === m ? "active" : ""}`}
                onClick={() => setPayMethod(m)}
              >
                {m === "CARD"
                  ? "카드 결제"
                  : m === "TOSSPAY"
                  ? "토스페이"
                  : m === "NAVERPAY"
                  ? "네이버페이"
                  : m === "KAKAOPAY"
                  ? "카카오페이"
                  : "무통장입금"}
              </button>
            ))}
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
