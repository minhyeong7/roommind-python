// src/pages/OrderFail.js

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderFail.css";

export default function OrderFail() {
  const location = useLocation();
  const navigate = useNavigate();

  const [errorInfo, setErrorInfo] = useState({
    type: "",
    code: "",
    message: "결제가 취소되었습니다."
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // PortOne에서 전달하는 에러 정보 (결제 자체 실패)
    const errorCode = params.get("code") || params.get("errorCode");
    const errorMsg = params.get("message") || params.get("errorMsg");
    
    // 검증 실패로 리다이렉트된 경우
    const type = params.get("type"); // 'verify' = 검증 실패

    if (errorCode || errorMsg || type) {
      setErrorInfo({
        type: type || "payment",
        code: errorCode || "",
        message: errorMsg || "결제 중 오류가 발생했습니다."
      });
    }

    // sessionStorage 정리
    sessionStorage.removeItem("orderId");
  }, [location.search]);

  const goHome = () => navigate("/");
  const goCart = () => navigate("/cart");
  const retry = () => navigate(-1);

  return (
    <div className="order-result-page fail">
      <div className="result-container">
        <div className="icon-box fail-icon">✕</div>
        <h2>결제에 실패했습니다</h2>
        
        <div className="error-detail">
          <p className="error-message">{errorInfo.message}</p>
          {errorInfo.code && (
            <p className="error-code">오류 코드: {errorInfo.code}</p>
          )}
        </div>

        <div className="notice-box error">
          {errorInfo.type === "verify" ? (
            <>
              <h4>결제 검증 실패 안내</h4>
              <ul>
                <li>결제는 완료되었으나 서버 검증 중 문제가 발생했습니다.</li>
                <li>주문 내역에서 결제 상태를 확인해주세요.</li>
                <li>중복 결제가 우려되신다면 고객센터로 문의해주세요.</li>
                <li>문의: 1588-0000</li>
              </ul>
            </>
          ) : (
            <>
              <h4>결제 실패 안내</h4>
              <ul>
                <li>결제가 정상적으로 처리되지 않았습니다.</li>
                <li>카드 한도, 비밀번호 오류 등을 확인해주세요.</li>
                <li>문제가 지속되면 다른 결제 수단을 이용해주세요.</li>
                <li>계속 실패 시 고객센터(1588-0000)로 문의해주세요.</li>
              </ul>
            </>
          )}
        </div>

        <div className="button-group">
          <button className="btn-secondary" onClick={goHome}>
            홈으로 가기
          </button>
          <button className="btn-secondary" onClick={goCart}>
            장바구니로
          </button>
          <button className="btn-primary" onClick={retry}>
            다시 시도
          </button>
        </div>
      </div>
    </div>
  );
}