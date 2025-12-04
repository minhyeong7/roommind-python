import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductImageSlider from "../components/ProductImageSlider";
import ProductBuyBox from "../components/ProductBuyBox";
import ProductDetailContent from "../components/ProductDetailContent";
import ProductReviews from "../components/ProductReviews";
import ProductQA from "../components/ProductQA";
import ProductRecommend from "../components/ProductRecommend";

import { fetchProductById } from "../api/productApi";
import "./ProductDetail.css";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    fetchProductById(productId)
      .then((data) => setProduct(data))
      .catch(() => setProduct(null));
    
  }, [productId]);

  if (!product) {
    return <div style={{ padding: "40px" }}>상품 정보를 불러오는 중...</div>;
  }

  console.log("🔥 필터된 상품:", product);


  const imageList = product.images
    ? product.images.map(img => `http://localhost:8080/${img.saveDir}/${img.fileName}`)
    : product.imageUrl
    ? [`http://localhost:8080${product.imageUrl}`]
    : ["/images/no-image.png"];

  return (
    <div className="product-detail-page">

      <div className="product-detail-wrapper">
        <div className="product-detail-left">
          <ProductImageSlider images={imageList} />
        </div>

        <div className="product-detail-right">
          <ProductBuyBox product={product} />
        </div>
      </div>

      <div className="product-detail-tabs">
        <div className={activeTab === "info" ? "active" : ""} onClick={() => setActiveTab("info")}>상품정보</div>
        <div className={activeTab === "review" ? "active" : ""} onClick={() => setActiveTab("review")}>리뷰</div>
        <div className={activeTab === "qa" ? "active" : ""} onClick={() => setActiveTab("qa")}>문의</div>
        <div className={activeTab === "recommend" ? "active" : ""} onClick={() => setActiveTab("recommend")}>추천상품</div>
      </div>

      <div className="product-section">
        {activeTab === "info" && <ProductDetailContent product={product} />}
        {activeTab === "review" && <ProductReviews />}
        {activeTab === "qa" && <ProductQA />}
        {activeTab === "recommend" && <ProductRecommend />}
      </div>
    </div>
  );
}

export default ProductDetail;
