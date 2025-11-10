import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      {/* 왼쪽: 로고 */}
      <div className="navbar-left">
        <Link to="/" className="logo">RoomMind</Link>
      </div>

      {/* 중앙: 메뉴 */}
      <ul className="navbar-menu">
        <li><Link to="/">홈</Link></li>
        <li><Link to="/popular">인기</Link></li>
        <li><Link to="/shop">쇼핑</Link></li>
        <li><Link to="/interior">AI 인테리어 추천</Link></li>
        <li><Link to="/event">이벤트</Link></li>
      </ul>

      {/* 중앙 오른쪽: 검색창 */}
      <div className="navbar-search">
        <input type="text" placeholder="통합검색" />
        <button>🔍</button>
      </div>

      {/* 오른쪽: 로그인 / 회원가입 */}
      <div className="navbar-auth">
        <button className="login">로그인</button>
        <button className="signup">회원가입</button>
      </div>
    </header>
  );
}

export default Navbar;
