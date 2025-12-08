// src/pages/OrderSuccess.js

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmPayment } from "../../api/paymentApi";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState("LOADING"); // LOADING / SUCCESS / FAIL
  const [message, setMessage] = useState("결제 검증 중입니다...");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // PortOne Redirect에 따라 이름이 다를 수 있어 여러 후보 체크
    const paymentId =
      params.get("paymentId") ||
      params.get("payment_id") ||
      params.get("paymentKey");

    const orderIdStr = sessionStorage.getItem("orderId");
    const orderId = orderIdStr ? Number(orderIdStr) : null;

    if (!paymentId || !orderId) {
      setStatus("FAIL");
      setMessage("필수 결제 정보가 누락되었습니다. (orderId 또는 paymentId)");
      return;
    }

    (async () => {
      try {
        const res = await confirmPayment({ orderId, paymentId });

        setOrder(res);
        setStatus("SUCCESS");
        setMessage("결제가 성공적으로 완료되었습니다!");

        // 더 이상 필요없으니 제거
        sessionStorage.removeItem("orderId");
      } catch (err) {
        console.error("결제 검증 실패:", err);
        setStatus("FAIL");
        setMessage(
          "결제 검증 중 오류가 발생했습니다. 결제 내역을 확인 후 관리자에게 문의해주세요."
        );
      }
    })();
  }, [location.search]);

  const goHome = () => navigate("/");
  const goMyOrders = () => navigate("/mypage/orders"); // 마이페이지 주문내역 경로에 맞게 수정

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      {status === "LOADING" && (
        <>
          <h2>결제를 처리 중입니다...</h2>
          <p>{message}</p>
        </>
      )}

      {status === "SUCCESS" && (
        <>
          <h2>결제가 성공적으로 완료되었습니다!</h2>
          <p>{message}</p>

          {order && (
            <div style={{ marginTop: "24px" }}>
              <p>
                <strong>주문 번호:</strong> {order.orderId}
              </p>
              <p>
                <strong>결제 금액:</strong>{" "}
                {order.totalPrice?.toLocaleString()}원
              </p>
              <p>
                <strong>주문 상태:</strong> {order.status}
              </p>
            </div>
          )}

          <div style={{ marginTop: "32px" }}>
            <button onClick={goHome} style={{ marginRight: "16px" }}>
              홈으로 가기
            </button>
            <button onClick={goMyOrders}>주문내역 보러가기</button>
          </div>
        </>
      )}

      {status === "FAIL" && (
        <>
          <h2>결제 처리에 실패했습니다.</h2>
          <p>{message}</p>
          <div style={{ marginTop: "32px" }}>
            <button onClick={goHome}>홈으로 가기</button>
          </div>
        </>
      )}
    </div>
  );
}
