import React from "react";

export default function BestItemCard({ item }) {
  return (
    <div className="best-card">
      <img src={item.image} alt={item.title} />
      <p className="best-title">{item.title}</p>
      <p className="best-price">{item.price}</p>
      <p className="best-rating">
        ⭐ {item.rating} 리뷰 {item.reviews}
      </p>
    </div>
  );
}
