import React, { useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      // 예: 검색어를 쿼리 파라미터로 넘겨서 /search 페이지로 이동
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  // 엔터 키 눌렀을 때 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
    // 회원가입 버튼 클릭 시 이동
  const handleSignupClick = () => {
    navigate("/signup");
  };

  // 로그인 버튼 클릭 시 이동 (나중에 로그인 페이지 만들면)
  const handleLoginClick = () => {
    navigate("/login");
  };

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
        <input
          type="text"
          placeholder="통합검색"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>🔍</button>
      </div>

      {/* 오른쪽: 로그인 / 회원가입 */}
      <div className="navbar-auth">
        <button className="login" onClick={handleLoginClick}>로그인</button>
        <button className="signup" onClick={handleSignupClick}>회원가입</button>
      </div>
    </header>
  );
}

export default Navbar;
