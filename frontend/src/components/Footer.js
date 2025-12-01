import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* 좌측: 로고 및 소개 */}
        <div className="footer-left">
          <h2 className="footer-logo">RoomMind</h2>
          <p className="footer-desc">
            편안한 공간을 더 아름답게.<br />
            당신의 취향을 이해하는 가구 추천 플랫폼.
          </p>
        </div>

        {/* 중앙: 네비게이션 링크 */}
        <div className="footer-links">
          <h4>사이트 메뉴</h4>
          <ul>
            <li><Link to="/">홈</Link></li>
            <li><Link to="/shop">쇼핑</Link></li>
            <li><Link to="/interior">AI 인테리어</Link></li>
            <li><Link to="/event">이벤트</Link></li>
          </ul>
        </div>

        {/* 우측: 고객센터 / SNS */}
        <div className="footer-contact">
          <h4>고객센터</h4>
          <p><i className="bi bi-telephone-fill"></i> 1588-1234</p>
          <p><i className="bi bi-envelope-at-fill"></i> help@roommind.com</p>
          <div className="sns-icons">
          <div className="sns-icons">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="ri-instagram-line"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="ri-facebook-circle-line"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <i className="ri-youtube-line"></i>
            </a>
            </div>

          </div>
        </div>
      </div>

      {/* 하단 카피라이트 */}
      <div className="footer-bottom">
        <p>© 2025 RoomMind. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
