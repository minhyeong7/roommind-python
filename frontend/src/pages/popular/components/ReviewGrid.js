import React from "react";
import { reviews } from "../dummy/reviews";
import { Link } from "react-router-dom";
import "./ReviewGrid.css";

export default function ReviewGrid() {
  return (
    <div className="review-grid-section">

      {/* 제목 + 더보기 버튼 */}
      <div className="review-header">
        <Link to="/community" className="review-more">더보기</Link>
      </div>

      {/* 리뷰 카드 grid */}
      <div className="review-grid-wrapper">
        <div className="review-grid">
          {reviews.map((item) => (
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

    </div>
  );
}
