import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import ProductImageSlider from "../components/ProductImageSlider";
import ProductBuyBox from "../components/ProductBuyBox";

import ProductDetailContent from "../components/ProductDetailContent";
import ProductReviews from "../components/ProductReviews";
import ProductQA from "../components/ProductQA";
import ProductRecommend from "../components/ProductRecommend";

import "./ProductDetail.css";

function ProductDetail() {
  const { state } = useLocation();
  const product = state?.product;

  const [activeTab, setActiveTab] = useState("info");

  if (!product) {
    return <div style={{ padding: "40px" }}>상품 정보 없음</div>;
  }

  return (
    <div className="product-detail-page">

      {/* 상단: 이미지 + 구매박스 */}
      <div className="product-detail-wrapper">
        <div className="product-detail-left">
      <ProductImageSlider images={[product.image]} />
        </div>


        <div className="product-detail-right">
          <ProductBuyBox product={product} />
        </div>
      </div>

      {/* 탭 */}
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

      {/* 아래 컨텐츠 */}
     <div className={`product-section ${activeTab === "review" ? "review-mode" : ""}`}>
        {activeTab === "info" && <ProductDetailContent product={product} />}
        {activeTab === "review" && <ProductReviews />}
        {activeTab === "qa" && <ProductQA />}
        {activeTab === "recommend" && <ProductRecommend />}
      </div>

    </div>
  );
}

export default ProductDetail;
