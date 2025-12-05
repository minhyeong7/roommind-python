import React from "react";
import { reviews } from "../dummy/reviews";
import { Link } from "react-router-dom";
import "./ReviewGrid.css";

export default function ReviewGrid() {
  return (
    <div className="review-section">

      {/* 더보기 버튼만 */}
      <div className="review-top-bar">
        <Link to="/community" className="review-more-btn">더보기</Link>
      </div>

      {/* 카드 3개 */}
      <div className="review-grid">
        {reviews.slice(0, 3).map((item) => (
          <div className="review-card" key={item.id}>
            <img src={item.image} alt="review" className="review-img" />

            <div className="review-info">
              <p className="review-title">{item.title}</p>
              <p className="review-text">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
