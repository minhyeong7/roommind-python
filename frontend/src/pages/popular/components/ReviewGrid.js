import React from "react";
import { reviews } from "../dummy/reviews";

export default function ReviewGrid() {
  return (
    <div className="review-grid">
      {reviews.map((item) => (
        <div className="review-card" key={item.id}>
          <img src={item.image} alt="review" />
          <span className="review-user">@{item.user}</span>
        </div>
      ))}
    </div>
  );
}
