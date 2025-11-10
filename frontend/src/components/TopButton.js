// src/components/TopButton.js
import React, { useState, useEffect } from "react";
import "./TopButton.css";
import { FaArrowUp } from "react-icons/fa";

function TopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 위치 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setIsVisible(true);
      else setIsVisible(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 클릭 시 부드럽게 상단으로 이동
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isVisible && (
        <button className="top-btn" onClick={scrollToTop} title="맨 위로">
          <FaArrowUp />
        </button>
      )}
    </>
  );
}

export default TopButton;
