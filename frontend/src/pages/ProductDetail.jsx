import React, { useState } from "react";
import ProductImageSlider from "../components/ProductImageSlider";
import ProductBuyBox from "../components/ProductBuyBox";

import ProductDetailContent from "../components/ProductDetailContent";
import ProductReviews from "../components/ProductReviews";
import ProductQA from "../components/ProductQA";
import ProductRecommend from "../components/ProductRecommend";

import "./ProductDetail.css";

function ProductDetail() {
  // ⭐ 현재 선택된 탭
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="product-detail-page">

      {/* 상단: 이미지 + 구매박스 */}
      <div className="product-detail-wrapper">
        <div className="product-detail-left">
          <ProductImageSlider />
        </div>

        <div className="product-detail-right">
          <ProductBuyBox />
        </div>
      </div>

      {/* ⭐ 탭 */}
      <div className="product-detail-tabs">
        <div
          className={activeTab === "info" ? "active" : ""}
          onClick={() => setActiveTab("info")}
        >
          상품정보
        </div>

        <div
          className={activeTab === "review" ? "active" : ""}
          onClick={() => setActiveTab("review")}
        >
          리뷰
        </div>

        <div
          className={activeTab === "qa" ? "active" : ""}
          onClick={() => setActiveTab("qa")}
        >
          문의
        </div>

        <div
          className={activeTab === "recommend" ? "active" : ""}
          onClick={() => setActiveTab("recommend")}
        >
          추천상품
        </div>
      </div>

      {/* ⭐ 선택된 탭만 보여주기 */}
      <div className="product-section">
        {activeTab === "info" && <ProductDetailContent />}
        {activeTab === "review" && <ProductReviews />}
        {activeTab === "qa" && <ProductQA />}
        {activeTab === "recommend" && <ProductRecommend />}
      </div>

    </div>
  );
}

export default ProductDetail;
