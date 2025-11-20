import React from "react";
import "./BestItemCard.css";

export default function BestItemCard({ item }) {
  return (
    <div className="best-card">
      <div className="best-img-wrapper">
        <img src={item.image} alt={item.title} className="best-img" />

        <div className="best-rank">{item.rank}</div>

        {item.badge && <div className="best-badge">{item.badge}</div>}

        <button className="best-bookmark">♡</button>
      </div>

      <div className="best-info">
        <p className="best-brand">{item.brand}</p>
        <p className="best-title">{item.title}</p>

        <div className="best-price-row">
          <span className="best-discount">{item.discount}%</span>
          <span className="best-price">{item.price.toLocaleString()}원</span>
        </div>

        <p className="best-rating">
          ⭐ {item.rating} <span className="review-count">리뷰 {item.reviews}</span>
        </p>

        {item.freeShipping && <span className="best-free">무료배송</span>}
      </div>
    </div>
  );
}
