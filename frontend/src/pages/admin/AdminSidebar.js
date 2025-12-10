import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-title">관리자 메뉴</h2>

      <ul>
        <li>
        <NavLink to="/admin" end className="sidebar-link">
          📊 관리자 메인
        </NavLink>

        </li>

        <li>
          <NavLink to="/admin/qna" className="sidebar-link">
            📝 Q&A 관리
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/products" className="sidebar-link">
            📦 상품 관리
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/users" className="sidebar-link">
            👥 회원 관리
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/orders" className="sidebar-link">
            🔆 결제 관리
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/profile" className="sidebar-link">
            ⚙️ 내 정보 수정
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
