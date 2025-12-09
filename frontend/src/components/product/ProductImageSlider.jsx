import React from "react";
import "./ProductImageSlider.css";

function ProductImageSlider({ images }) {
  // 기본 이미지
  const defaultImage = "/images/default-product.jpg";

  // 이미지가 문자열 배열이면 정상 처리
  const mainImage = Array.isArray(images) && images.length > 0
    ? images[0]
    : defaultImage;

  return (
    <div className="product-image-slider">
      <div className="product-main-image">
        <img src={mainImage} alt="상품 이미지" />
      </div>
    </div>
  );
}

export default ProductImageSlider;
