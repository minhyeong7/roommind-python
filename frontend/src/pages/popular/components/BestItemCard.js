import React, { useState } from "react";
import "./BestItemCard.css";

export default function BestItemCard({ item }) {
  const [bookmarked, setBookmarked] = useState(false); // ⭐ 하트 상태 추가

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <div className="best-card">

      {/* 이미지 영역 */}
      <div className="best-img-wrapper">
        <img src={item.image} alt={item.title} className="best-img" />

        {/* 순위 */}
        <div className="best-rank">{item.rank}</div>

        {/* 특가 라벨 */}
        {item.badge && <div className="best-badge">{item.badge}</div>}

        {/* 하트 버튼 */}
        <button
          className={`best-bookmark ${bookmarked ? "active" : ""}`}
          onClick={toggleBookmark}
        >
          {bookmarked ? "❤️" : "🤍"}
        </button>
      </div>

      {/* 상품 정보 */}
      <div className="best-info">
        <p className="best-brand">{item.brand}</p>

        <p className="best-title">{item.title}</p>

        <div className="best-price-row">
          <span className="best-discount">{item.discount}%</span>
          <span className="best-price">
            {item.price.toLocaleString()}원
          </span>
        </div>

        <p className="best-rating">
          ⭐ {item.rating} <span className="review-count">리뷰 {item.reviews}</span>
        </p>

        {item.freeShipping && (
          <span className="best-free">무료배송</span>
        )}
      </div>

    </div>
  );
}
