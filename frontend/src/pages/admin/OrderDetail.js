import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./OrderDetail.css";
import AdminSidebar from "./AdminSidebar";
import api from "../../api/userApi";

export default function OrderDetail() {
  const { orderId } = useParams();
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
        <h1>주문 상세 정보</h1>

        <div className="order-box">
          <p><strong>주문번호:</strong> {order.orderId}</p>
          <p><strong>주문자:</strong> {order.userName}</p>
          <p><strong>총 금액:</strong> {order.totalPrice}원</p>
          <p><strong>결제수단:</strong> {order.payMethod}</p>
          <p><strong>결제상태:</strong> {order.status}</p>
        </div>

        <h2>주문 상품 목록</h2>

        <table className="order-detail-table">
          <thead>
            <tr>
              <th>이미지</th>
              <th>상품명</th>
              <th>수량</th>
              <th>가격</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map(item => (
              <tr key={item.orderItemId}>
                <td>
                  <img src={item.imageUrl} alt="" className="order-img"/>
                </td>
                <td>{item.productName}</td>
                <td>{item.count}</td>
                <td>{item.price.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
