import React from "react";
import { Link } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-title">관리자 메뉴</h2>

      <ul>
        <li>
          <Link to="/admin">📊 관리자 메인</Link>
        </li>
        <li>
          <Link to="/admin/qna">📝 Q&A 관리</Link>
        </li>
        <li>
          <Link to="/admin/products">📦 상품 관리</Link>
        </li>
        <li>
          <Link to="/admin/users">👥 회원 관리</Link>
        </li>
        <li>
        <Link to="/admin/profile">⚙️ 내 정보 수정</Link>
      </li>

      </ul>
    </aside>
  );
}
