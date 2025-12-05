import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../api/header"; 
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
    totalQna: 0,
    totalCommunityPosts: 0,
    recentCommunityPosts: [],
    lowStockProducts: []
  });

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(res => {
        console.log("🔥 서버 응답:", res.data);

        // undefined 들어오는 값 방지
        setStats({
          totalUsers: res.data?.totalUsers ?? 0,
          totalProducts: res.data?.totalProducts ?? 0,
          totalOrders: res.data?.totalOrders ?? 0,
          totalRevenue: res.data?.totalRevenue ?? 0,
          todayOrders: res.data?.todayOrders ?? 0,
          todayRevenue: res.data?.todayRevenue ?? 0,
          pendingQna: res.data?.pendingQna ?? 0,
          totalQna: res.data?.totalQna ?? 0,
          totalCommunityPosts: res.data?.totalCommunityPosts ?? 0,
          recentCommunityPosts: res.data?.recentCommunityPosts ?? [],
          lowStockProducts: res.data?.lowStockProducts ?? []
        });
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <AdminLayout>
      <h1>관리자 대시보드</h1>

      {/* ---- 상단 KPI 카드 ---- */}
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

      {/* ---- Q&A / 커뮤니티 정보 ---- */}
      <div className="kpi-container">

        <div className="kpi-card">
          <h3>총 Q&A 수</h3>
          <p>{stats.totalQna}건</p>
        </div>

        <div className="kpi-card">
          <h3>미답변 Q&A</h3>
          <p>{stats.pendingQna}건</p>
        </div>

        <div className="kpi-card">
          <h3>커뮤니티 글 수</h3>
          <p>{stats.totalCommunityPosts}건</p>
        </div>
      </div>

      {/* ---- 최근 커뮤니티 글 ---- */}
      <div className="recent-posts-section">
        <h2>최근 등록된 커뮤니티 글</h2>

        {(stats.recentCommunityPosts?.length || 0) === 0 ? (
          <p>최근 작성된 글이 없습니다.</p>
        ) : (
          <table className="recent-table">
            <thead>
              <tr>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
              </tr>
            </thead>

            <tbody>
              {stats.recentCommunityPosts.map(post => (
                <tr key={post.communityId}>
                  <td>{post.title}</td>
                  <td>{post.userId}</td>
                  <td>{post.createdDate?.substring(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ---- 재고 부족 상품 ---- */}
      <div className="low-stock-section">
        <h2>재고 부족 상품 (10개 미만)</h2>

        {(stats.lowStockProducts?.length || 0) === 0 ? (
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
