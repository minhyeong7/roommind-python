import React from "react";
import "./ProductImageSlider.css";

function ProductImageSlider() {
  return (
    <div className="product-image-slider">

      <div className="product-main-image">
        <img
          src="https://via.placeholder.com/600x600"
          alt="상품이미지"
          style={{ width: "100%" }}
        />
      </div>

    </div>
  );
}

export default ProductImageSlider;
