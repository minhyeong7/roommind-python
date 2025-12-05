import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
    pendingQna: 0,
    lowStockProducts: []
  });

  useEffect(() => {
    axios.get("http://localhost:8080/api/admin/dashboard")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <AdminLayout>
      <h1>관리자 대시보드</h1>

      {/* 🔶 상단 KPI 카드 */}
      <div className="kpi-container">
        <div className="kpi-card">
          <h3>총 회원 수</h3>
          <p>{stats.totalUsers}명</p>
        </div>

        <div className="kpi-card">
          <h3>총 상품 수</h3>
          <p>{stats.totalProducts}개</p>
        </div>

        <div className="kpi-card">
          <h3>총 주문 수</h3>
          <p>{stats.totalOrders}건</p>
          <span>오늘: {stats.todayOrders}건</span>
        </div>

        <div className="kpi-card">
          <h3>총 매출액</h3>
          <p>{stats.totalRevenue.toLocaleString()} 원</p>
          <span>오늘: {stats.todayRevenue.toLocaleString()} 원</span>
        </div>
      </div>

      {/* 🔶 미답변 Q&A */}
      <div className="small-card">
        <h3>미답변 Q&A</h3>
        <p>{stats.pendingQna}건</p>
      </div>

      {/* 🔶 재고 부족 상품 */}
      <div className="low-stock-section">
        <h2>재고 부족 상품 (10개 미만)</h2>

        {stats.lowStockProducts.length === 0 ? (
          <p>재고 부족 상품 없음</p>
        ) : (
          <table className="low-stock-table">
            <thead>
              <tr>
                <th>상품명</th>
                <th>현재 재고</th>
              </tr>
            </thead>
            <tbody>
              {stats.lowStockProducts.map(item => (
                <tr key={item.productId}>
                  <td>{item.name}</td>
                  <td>{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
