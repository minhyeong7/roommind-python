import React, { useEffect, useState } from "react";
import "./OrderManage.css";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";
import api from "../../api/userApi";

export default function OrderManage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // 정렬 & 필터 상태
  const [sortOption, setSortOption] = useState("latest");
  const [filterStatus, setFilterStatus] = useState("ALL");

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

  // 숫자 포맷
  const formatNumber = (v) => (v ? Number(v).toLocaleString() : "-");

  // 주문 상태 한글 변환
  const statusToKorean = (status) => {
    switch (status) {
      case "PENDING":
        return "결제대기";
      case "PAID":
        return "결제완료";
      case "SHIPPED":
        return "배송중";
      case "DELIVERED":
        return "배송완료";
      case "CANCELLED":
        return "취소됨";
      default:
        return status;
    }
  };

  // 상태 변경 함수
  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      alert("상태가 변경되었습니다.");
      fetchOrders(); // 리스트 새로고침
    } catch (err) {
      console.error("상태 변경 실패:", err);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  // ====== 정렬 + 필터 적용된 데이터 만들기 ======
  const processedOrders = [...orders]
    .filter((o) => filterStatus === "ALL" || o.status === filterStatus)
    .sort((a, b) => {
      switch (sortOption) {
        case "latest":
          return new Date(b.createdDate) - new Date(a.createdDate);
        case "oldest":
          return new Date(a.createdDate) - new Date(b.createdDate);
        case "priceDesc":
          return b.totalPrice - a.totalPrice;
        case "priceAsc":
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    });

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="order-manage-wrapper">
        <h1>주문 관리</h1>

        {/* 정렬/필터 UI 영역 */}
        <div className="order-sort-box">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="latest">최신 주문순</option>
            <option value="oldest">오래된 주문순</option>
            <option value="priceDesc">금액 높은순</option>
            <option value="priceAsc">금액 낮은순</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="sort-select"
          >
            <option value="ALL">전체 상태</option>
            <option value="PENDING">결제대기</option>
            <option value="PAID">결제완료</option>
            <option value="SHIPPED">배송중</option>
            <option value="DELIVERED">배송완료</option>
            <option value="CANCELLED">취소됨</option>
          </select>
        </div>

        {/* 주문 테이블 */}
        <table className="order-table">
          <thead>
            <tr>
              <th>주문번호</th>
              <th>주문자</th>
              <th>총 금액</th>
              <th>상태</th>
              <th>주문일자</th>
              <th>상세</th>
            </tr>
          </thead>

          <tbody>
            {processedOrders.length === 0 ? (
              <tr>
                <td colSpan="6">주문 데이터가 없습니다.</td>
              </tr>
            ) : (
              processedOrders.map((o) => (
                <tr key={o.orderId}>
                  <td>{o.orderId}</td>
                  <td>{o.userName}</td>
                  <td>{formatNumber(o.totalPrice)}원</td>

                  {/* 상태 변경 SELECT */}
                  <td>
                    <select
                      className="status-select"
                      value={o.status}
                      onChange={(e) => updateStatus(o.orderId, e.target.value)}
                    >
                      <option value="PENDING">결제대기</option>
                      <option value="PAID">결제완료</option>
                      <option value="SHIPPED">배송중</option>
                      <option value="DELIVERED">배송완료</option>
                      <option value="CANCELLED">취소됨</option>
                    </select>
                  </td>

                  <td>{o.createdDate?.slice(0, 10)}</td>

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
