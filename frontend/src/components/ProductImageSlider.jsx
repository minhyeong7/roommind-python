import React from "react";
import "./ProductImageSlider.css";

function ProductImageSlider({ images }) {
  //  기본 이미지 지정
  const defaultImage = "/images/default-product.jpg"; // public/images/ 에 넣기
  const mainImage = images && images.length > 0 ? images[0] : defaultImage;

  return (
    <div className="product-image-slider">
      <div className="product-main-image">
        <img
          src={mainImage}
          alt="상품 이미지"
        />
      </div>
    </div>
  );
}

export default ProductImageSlider;
