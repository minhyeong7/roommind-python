// src/pages/OrderSuccess.js

import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmPayment } from "../../api/paymentApi";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  // ⭐ 중복 실행 방지 플래그
  const isProcessing = useRef(false);

  useEffect(() => {
    // ⭐ 이미 처리 중이면 중단
    if (isProcessing.current) {
      console.log("⚠️ 이미 결제 검증 중입니다.");
      return;
    }

    const params = new URLSearchParams(location.search);

    const paymentId =
      params.get("paymentId") ||
      params.get("payment_id") ||
      params.get("paymentKey");

    const orderIdStr = sessionStorage.getItem("orderId");
    const orderId = orderIdStr ? Number(orderIdStr) : null;

    if (!paymentId || !orderId) {
      navigate("/order/fail?message=필수 결제 정보가 누락되었습니다.");
      return;
    }

    // ⭐ 이미 처리된 주문인지 확인 (중복 방지)
    const processedKey = `processed_${orderId}_${paymentId}`;
    if (sessionStorage.getItem(processedKey)) {
      console.log("⚠️ 이미 처리된 주문입니다.");
      setLoading(false);
      return;
    }

    // ⭐ 처리 시작
    isProcessing.current = true;
    console.log("🔄 결제 검증 시작:", { orderId, paymentId });

    (async () => {
      try {
        const res = await confirmPayment({ orderId, paymentId });

        console.log("✅ 결제 검증 완료:", res);
        
        setOrder(res);
        setLoading(false);

        // ⭐ 처리 완료 표시 (중복 방지)
        sessionStorage.setItem(processedKey, "true");
        sessionStorage.removeItem("orderId");

      } catch (err) {
        console.error("❌ 결제 검증 실패:", err);
        
        const errorMsg = err.response?.data?.message || "결제 검증 중 오류가 발생했습니다.";
        
        // 검증 실패 시 실패 페이지로
        navigate(`/order/fail?message=${encodeURIComponent(errorMsg)}&type=verify`);
      } finally {
        isProcessing.current = false;
      }
    })();

    // ⭐ Cleanup: 컴포넌트 언마운트 시 플래그 초기화
    return () => {
      isProcessing.current = false;
    };
  }, [location.search, navigate]);

  const goHome = () => navigate("/");
  const goMyOrders = () => navigate("/mypage/orders");

  if (loading) {
    return (
      <div className="order-result-page loading">
        <div className="result-container">
          <div className="loading-spinner"></div>
          <h2>결제를 처리 중입니다...</h2>
          <p>결제 검증 중입니다. 잠시만 기다려주세요...</p>
          <p className="warning-text">⚠️ 창을 새로고침하거나 닫지 마세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-result-page success">
      <div className="result-container">
        <div className="icon-box success-icon">✓</div>
        <h2>결제가 완료되었습니다!</h2>
        <p className="success-message">결제가 성공적으로 완료되었습니다!</p>

        {order && (
          <div className="order-info">
            <div className="info-row">
              <span className="label">주문 번호</span>
              <span className="value">{order.orderId}</span>
            </div>
            <div className="info-row">
              <span className="label">결제 금액</span>
              <span className="value highlight">
                {order.totalPrice?.toLocaleString()}원
              </span>
            </div>
            <div className="info-row">
              <span className="label">주문 상태</span>
              <span className="value status">{order.status}</span>
            </div>
          </div>
        )}

        <div className="notice-box">
          <p>주문하신 상품은 배송 준비 중입니다.</p>
          <p>배송 정보는 마이페이지에서 확인하실 수 있습니다.</p>
        </div>

        <div className="button-group">
          <button className="btn-secondary" onClick={goHome}>
            홈으로 가기
          </button>
          <button className="btn-primary" onClick={goMyOrders}>
            주문내역 보기
          </button>
        </div>
      </div>
    </div>
  );
}