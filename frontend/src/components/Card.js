import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

function Card({
  image = "",
  brand = "",              // 기본값 추가
  title = "",
  price = "",
  originalPrice = "",
  rating = 0,              // 기본값 추가
  reviewCount = 0,         // 기본값 추가
  link = "#"
}) {
  const priceNum = parseInt(price.replace(/,/g, ""), 10);
  const originalNum = parseInt(originalPrice.replace(/,/g, ""), 10);

  const discountRate =
    originalNum && priceNum
      ? Math.round(((originalNum - priceNum) / originalNum) * 100)
      : 0;

  return (
    <Link to={link} className="card-link">
      <div className="card">

        {/* 이미지 영역 */}
        <div className="card-image-wrapper">
          <img src={image} alt={title} className="card-image" />
        </div>

        {/* 아래 설명 영역 */}
        <div className="card-info">

          {/* 브랜드명 */}
          {brand && <p className="card-brand">{brand}</p>}

          {/* 상품명 */}
          <p className="card-title">{title}</p>

          {/* 가격 라인: 할인율 + 현재가격 */}
          <div className="card-price-row">
            {discountRate > 0 && (
              <span className="discount-rate">{discountRate}%</span>
            )}

            <span className="discount-price">
              {price}원
            </span>
          </div>

          {/* 원래 가격 */}
          {originalPrice && (
            <p className="original-price">{originalPrice}원</p>
          )}

          {/* 리뷰 + 별점 */}
          <div className="rating-row">
            <span className="rating-star">⭐ {rating}</span>
            <span className="review-count">리뷰 {reviewCount.toLocaleString()}</span>
          </div>

        </div>
      </div>
    </Link>
  );
}

export default Card;
