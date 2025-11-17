import React from "react";
import "./ProductBuyBox.css";

function ProductBuyBox() {
  return (
    <div className="product-buy-box">

      <h2 className="product-name">상품명 자리</h2>

      <div className="product-price-box">
        <div className="discount-rate">38%</div>
        <div className="sale-price">31,800원</div>
      </div>

      <div className="original-price">52,000원</div>

      <select className="option-select">
        <option>옵션 선택</option>
      </select>

      <div className="product-buy-btns">
        <button className="cart-btn">장바구니</button>
        <button className="buy-btn">바로구매</button>
      </div>

    </div>
  );
}

export default ProductBuyBox;
