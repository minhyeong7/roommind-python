import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserInfo, logoutUser } from "../api/userApi";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔹 검색 관련
  const handleInputChange = (e) => setSearchTerm(e.target.value);
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // ✅ 로그인 상태 확인 함수
  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const data = await fetchUserInfo();
        setUser(data);
      } catch {
        logoutUser();
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  // ✅ 초기 실행 + 로그인/로그아웃 감지
  useEffect(() => {
    loadUser();

    // ✅ 다른 탭 or 페이지에서 localStorage 바뀔 때 감지 (로그인/로그아웃 반영)
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        loadUser(); // 토큰이 바뀌면 상태 갱신
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // ✅ cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ✅ 로그인 성공 후 직접 이벤트 트리거 (Login.js에서)
  useEffect(() => {
    const handleLoginEvent = () => loadUser();
    window.addEventListener("loginSuccess", handleLoginEvent);
    return () => window.removeEventListener("loginSuccess", handleLoginEvent);
  }, []);

  // 🔹 로그아웃
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    alert("👋 로그아웃되었습니다.");
    navigate("/");
  };

  // 🔹 이동 함수
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

      {/* 오른쪽 */}
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

        {/* 로그인 상태 표시 */}
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
