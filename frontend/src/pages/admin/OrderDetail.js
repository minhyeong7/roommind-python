import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";   // ← navigate 추가
import "./OrderDetail.css";
import AdminSidebar from "./AdminSidebar";
import api from "../../api/userApi";

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();   // ← 뒤로가기 기능
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    try {
      const res = await api.get(`/admin/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error("결제 상세 조회 실패:", err);
    }
  };

  if (!order) return <div>로딩 중...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="order-detail-wrapper">
        
        {/* 뒤로가기 버튼 */}
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← 뒤로가기
        </button>

        <h1>주문 상세 정보</h1>

        <div className="order-box">
          <p><strong>주문번호:</strong> {order.orderId}</p>
          <p><strong>주문자:</strong> {order.userName}</p>
          <p><strong>총 금액:</strong> {order.totalPrice.toLocaleString()}원</p>
          <p><strong>배송지:</strong> {order.deliveryAddress}</p>
          <p><strong>주문일자:</strong> {order.createdDate?.slice(0, 10)}</p>

          <p>
            <strong>주문상태:</strong>{" "}
            <span className={`status-badge ${order.status}`}>
              {order.status === "PENDING" && "결제 대기"}
              {order.status === "PAID" && "결제 완료"}
              {order.status === "SHIPPED" && "배송 중"}
              {order.status === "DELIVERED" && "배송 완료"}
              {order.status === "CANCELLED" && "취소됨"}
            </span>
          </p>
        </div>

        <h2>주문 상품 목록</h2>

        <table className="order-detail-table">
          <thead>
            <tr>
              <th>상품명</th>
              <th>수량</th>
              <th>가격</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item) => (
              <tr key={item.orderDetailId}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
