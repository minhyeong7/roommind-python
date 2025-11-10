import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserInfo, logoutUser } from "../api/userApi";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null); // ✅ 로그인한 사용자 정보 저장
  const navigate = useNavigate();

  // 🔹 검색어 입력 핸들러
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 🔹 검색 실행
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  // 🔹 엔터로 검색
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // 🔹 페이지 로드 시 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserInfo()
        .then((data) => setUser(data))
        .catch(() => {
          logoutUser();
          setUser(null);
        });
    }
  }, []);

  // 🔹 로그아웃
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    alert("👋 로그아웃되었습니다.");
    navigate("/");
  };

  // 🔹 이동 함수들
  const handleSignupClick = () => navigate("/signup");
  const handleLoginClick = () => navigate("/login");
  const handleCartClick = () => navigate("/cart");
  const handleMypageClick = () => navigate("/mypage");

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
        <li><Link to="/event">커뮤니티</Link></li>
        <li><Link to="/qna">Q & A</Link></li>
      </ul>

      {/* 오른쪽: 검색 + 로그인 상태 */}
      <div className="navbar-right">
        {/* 검색창 */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="통합검색"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch} className="search-btn">
            <i className="bi bi-search"></i>
          </button>
        </div>

        {/* 장바구니 버튼 */}
        <button className="basket-btn" onClick={handleCartClick}>
          <i className="bi bi-cart-fill"></i>
        </button>

        {/* ✅ 로그인 상태에 따른 표시 */}
        <div className="navbar-auth">
          {user ? (
            <>
              <span className="welcome-text">
                환영합니다,&nbsp;<strong>{user.nickname || user.name || "회원"}</strong>님!
              </span>
              <button className="mypage-btn" onClick={handleMypageClick}>
                마이페이지
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button className="login" onClick={handleLoginClick}>로그인</button>
              <button className="signup" onClick={handleSignupClick}>회원가입</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
