import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser, getTokenRemainingTime } from "../api/userApi";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null); // 🔥 토큰 남은 시간
  const navigate = useNavigate();

  /** ✅ 로그인 상태 불러오기 */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleLoginSuccess = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) setUser(JSON.parse(updatedUser));
    };

    window.addEventListener("loginSuccess", handleLoginSuccess);
    return () => {
      window.removeEventListener("loginSuccess", handleLoginSuccess);
    };
  }, []);

  /** 🔥 로그인 시 토큰 만료 타이머 시작 */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const interval = setInterval(() => {
      const sec = getTokenRemainingTime(token);
      setRemainingTime(sec);

      if (sec <= 0) {
        console.log("⛔ 토큰 만료됨 → 자동 로그아웃");
        logoutUser();
        navigate("/login");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  /** 🕒 남은 시간 포맷 */
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m > 0) return `${m}분 ${s}초`;
    return `${s}초`;
  };

  /** ❌ 로그아웃 */
  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("user");
    setUser(null);
    alert("👋 로그아웃되었습니다.");
    navigate("/");
  };

  /** 🔍 검색 */
  const handleInputChange = (e) => setSearchTerm(e.target.value);
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  /** 🔹 이동 */
  const handleSignupClick = () => navigate("/signup");
  const handleLoginClick = () => navigate("/login");
  const handleCartClick = () => navigate("/cart");
  const handleMypageClick = () => navigate("/mypage");

  return (
    <header className="navbar">
      {/* 왼쪽 로고 */}
      <div className="navbar-left">
        <Link to="/" className="logo">RoomMind</Link>
      </div>

      {/* 중앙 메뉴 */}
      <ul className="navbar-menu">
        <li><Link to="/">홈</Link></li>
        <li><Link to="/popular">인기</Link></li>
        <li><Link to="/shop">쇼핑</Link></li>
        <li><Link to="/interior">AI 인테리어 추천</Link></li>
        <li><Link to="/community">커뮤니티</Link></li>
        <li><Link to="/qna">Q & A</Link></li>
      </ul>

      {/* 오른쪽 영역 */}
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

        {/* 장바구니 */}
        <button className="basket-btn" onClick={handleCartClick}>
          <i className="bi bi-cart-fill"></i>
        </button>

        {/* 로그인 상태 영역 */}
        <div className={`navbar-auth ${user ? "logged-in" : ""}`}>
          {user ? (
            <>
              {/* 환영 문구 */}
              <span className="welcome-text">
                환영합니다,&nbsp;
                <strong>{user.userName || user.name || "회원"}</strong>님!
              </span>

              {/* 🔥 토큰 남은 시간 표시 */}
              {remainingTime !== null && (
                <span className="token-timer">
                 {formatTime(remainingTime)} 
                </span>
              )}

              {/* 마이페이지 */}
              <button className="mypage-btn" onClick={handleMypageClick}>
                마이페이지
              </button>

              {/* 로그아웃 */}
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
