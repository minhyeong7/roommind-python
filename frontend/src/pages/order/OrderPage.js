// src/pages/OrderPage.js

import React, { useState, useContext, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../cart/CartContext";
import AddressModal from "../../components/AddressModal";
import api from "../../api/userApi";
import { createOrder } from "../../api/orderApi";
import "./OrderPage.css";

function OrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useContext(CartContext);

  /* ============================
      ⭐ 바로구매 데이터
  ============================ */
  const buyNowItem = location.state?.buyNowItem || null;

  /* 장바구니 선택 주문용 */
  const selectedIds = location.state?.selectedItems || null;

  /* ============================
      ⭐ 주문 상품 계산 (핵심 수정 부분)
  ============================ */
  const orderItems = useMemo(() => {
    // ➤ 1. 바로구매라면 buyNowItem만 주문상품
    if (buyNowItem) return [buyNowItem];

    // ➤ 2. 장바구니 전체 주문
    if (!selectedIds || selectedIds.length === 0) return cartItems;

    // ➤ 3. 장바구니에서 선택한 상품만 주문
    return cartItems.filter((item) =>
      selectedIds.includes(String(item.uniqueId))
    );
  }, [cartItems, selectedIds, buyNowItem]);

  /* 주문 총액 */
  const orderTotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [orderItems]
  );

  /* 주소 파싱 */
  const splitAddress = (full) => {
    if (!full) return ["", ""];
    const regex = /(.*)\s(\d+호|\d+층|\d+동|\d+호수?)$/;
    const match = full.match(regex);
    if (match) return [match[1], match[2]];
    return [full, ""];
  };

  /* 배송지 정보 */
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    email: "",
    zipcode: "",
    address1: "",
    address2: "",
  });

  /* 주문자 정보 */
  const [buyer, setBuyer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [sameAsAddress, setSameAsAddress] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [payMethod, setPayMethod] = useState("TOSSPAY");

  /* ============================
      회원 정보 불러오기
  ============================ */
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

        if (user.address?.includes("||")) {
          const parts = user.address.split("||");
          zipcode = parts[0] || "";
          addr1 = parts[1] || "";
          addr2 = parts[2] || "";
        } else if (user.address) {
          const [base, detail] = splitAddress(user.address);
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
  }, [sameAsAddress]);

  /* 주소 모달에서 선택 시 */
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

  /* ============================
      PortOne 결제 요청
  ============================ */

  const TOSS_CHANNEL_KEY = process.env.REACT_APP_TOSS_CHANNEL_KEY;

  const channelKeyMap = {
    CARD: "channel_test_81cb64f5-4954-47bf-85d3-1fa9d6af4540",
    TOSSPAY: TOSS_CHANNEL_KEY,
    NAVERPAY: "channel_test_55bba057-85ce-4fb1-af98-dc4c8c7f5555",
    KAKAOPAY: "channel_test_c11c113c-a31a-4a7e-9f8b-3123123bbb11",
  };

  const requestPortOne = async (method, amount) => {
    if (!window.PortOne) throw new Error("결제 모듈 로딩 실패");

    const firstName = orderItems[0]?.name || "가구 상품";

    const baseConfig = {
      storeId: "store-bc957181-cc9e-4901-a983-39117669bd68",
      paymentId: `payment_${Date.now()}`,
      orderName: firstName,
      totalAmount: amount,
      currency: "KRW",
      customer: {
        fullName: buyer.name,
        phoneNumber: buyer.phone,
        email: buyer.email,
      },
      redirectUrl: `${window.location.origin}/order/success`,
      failUrl: `${window.location.origin}/order/fail`,
    };

    if (method === "TOSSPAY") {
      return window.PortOne.requestPayment({
        ...baseConfig,
        channelKey: channelKeyMap.TOSSPAY,
        payMethod: "CARD",
      });
    }

    if (method === "CARD") {
      return window.PortOne.requestPayment({
        ...baseConfig,
        channelKey: channelKeyMap.CARD,
        payMethod: "CARD",
      });
    }

    return window.PortOne.requestPayment({
      ...baseConfig,
      channelKey: channelKeyMap[method],
      payMethod: "EASY_PAY",
      easyPayProvider: method,
    });
  };

  /* ============================
      결제하기
  ============================ */
  const handlePayment = async () => {
    if (orderItems.length === 0) {
      alert("주문할 상품이 없습니다.");
      return;
    }

    try {
      const orderData = {
        deliveryAddress: `${address.address1} ${address.address2}`.trim(),
        items: orderItems.map((item) => ({
          productId: Number(item.productId),
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const createdOrder = await createOrder(orderData);
      sessionStorage.setItem("orderId", createdOrder.orderId);

      const res = await requestPortOne(payMethod, createdOrder.totalPrice);

      if (res.code) {
        navigate(`/order/fail?message=${encodeURIComponent(res.message)}`);
        return;
      }

      const paymentId =
        res.paymentId || res.payment_id || res.paymentKey || res.txId;

      if (!paymentId) {
        navigate("/order/fail?message=결제정보 누락");
        return;
      }

      navigate(`/order/success?paymentId=${paymentId}`);
    } catch (err) {
      console.error("결제 오류:", err);
      navigate(`/order/fail?message=결제 중 오류 발생`);
    }
  };

  return (
    <div className="order-page">
      <div className="order-left">
        {/* 배송지 */}
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
            배송지 정보와 동일
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
          {orderItems.map((item) => (
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
                onClick={() => {
                  if (m !== "TOSSPAY") {
                    alert("현재 서비스 예정중입니다. 토스페이를 이용해주세요.");
                    return;
                  }
                  setPayMethod(m);
                }}
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

      {/* 우측 요약 */}
      <div className="order-right">
        <div className="summary-box">
          <h3>결제 금액</h3>

          <div className="sum-row">
            <span>총 상품 금액</span>
            <span>{orderTotal.toLocaleString()}원</span>
          </div>

          <div className="sum-row">
            <span>배송비</span>
            <span>0원</span>
          </div>

          <hr />

          <div className="sum-final">
            <span>최종 결제 금액</span>
            <span className="final-price">
              {orderTotal.toLocaleString()}원
            </span>
          </div>

          <button className="pay-btn" onClick={handlePayment}>
            결제하기
          </button>
        </div>
      </div>

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
