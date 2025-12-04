import React, { useEffect, useState } from "react";
import "./OrderManage.css";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";
import api from "../../api/userApi";

export default function OrderManage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("결제 정보 조회 실패:", err);
    }
  };

  const formatNumber = (v) => (v ? Number(v).toLocaleString() : "-");

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="order-manage-wrapper">
        <h1>결제 관리</h1>

        <table className="order-table">
          <thead>
            <tr>
              <th>주문번호</th>
              <th>주문자</th>
              <th>총 금액</th>
              <th>결제수단</th>
              <th>상태</th>
              <th>주문일자</th>
              <th>상세</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7">결제 데이터가 없습니다.</td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.orderId}>
                  <td>{o.orderId}</td>
                  <td>{o.userName}</td>
                  <td>{formatNumber(o.totalPrice)}원</td>
                  <td>{o.payMethod}</td>
                  <td>{o.status}</td>
                  <td>{o.createdDate?.slice(0,10)}</td>

                  <td>
                    <button 
                      className="detail-btn"
                      onClick={() => navigate(`/admin/orders/${o.orderId}`)}
                    >
                      보기
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
