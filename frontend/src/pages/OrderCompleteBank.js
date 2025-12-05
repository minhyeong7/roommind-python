import React from "react";
import "./OrderCompleteBank.css";
import { Link } from "react-router-dom";

function OrderCompleteBank() {
  return (
    <div className="complete-wrapper">

      <div className="complete-box">

        <div className="check-icon">✔</div>

        <h2 className="complete-title">무통장입금 주문이 완료되었습니다</h2>
        <p className="complete-sub">
          입금이 확인되면 상품 준비가 시작됩니다.
        </p>

        <div className="bank-box">
          <h3>입금 계좌 정보</h3>
          <p><strong>카카오뱅크</strong> 3333-12-3456789</p>
          <p>예금주: (주)룸마인드</p>
        </div>

        <div className="notice-text">
          ※ 입금자명이 다를 경우 고객센터로 꼭 연락해주세요.
        </div>

        <div className="btn-area">
          <Link to="/" className="btn-home">메인으로</Link>
          <Link to="/mypage/orders" className="btn-order">주문내역 보기</Link>
        </div>

      </div>

    </div>
  );
}

export default OrderCompleteBank;
