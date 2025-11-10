import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

function Card({ image, title, price, originalPrice, link }) {
  // 숫자만 추출해서 할인율 계산 (예: 169,000 → 169000)
  const priceNum = parseInt(price.replace(/,/g, ""), 10);
  const originalNum = parseInt(originalPrice.replace(/,/g, ""), 10);

  const discountRate =
    originalNum && priceNum
      ? Math.round(((originalNum - priceNum) / originalNum) * 100)
      : 0;

  return (
    <Link to={link} className="card-link">
      <div className="card">
        <div className="image-wrapper">
          <img src={image} alt={title} className="card-image" />
          {discountRate > 0 && (
            <div className="discount-badge">-{discountRate}%</div>
          )}
        </div>
        <div className="card-info">
          <h3 className="card-title">{title}</h3>
          <div className="card-price">
            <span className="discount-price">{price}원</span>
            {originalPrice && (
              <span className="original-price">{originalPrice}원</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Card;
