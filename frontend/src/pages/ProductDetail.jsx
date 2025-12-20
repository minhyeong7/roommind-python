import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductImageSlider from "../components/product/ProductImageSlider";
import ProductBuyBox from "../components/product/ProductBuyBox";
import ProductDetailContent from "../components/product/ProductDetailContent";
import ProductReviews from "../components/product/ProductReviews";
import ProductQA from "../components/product/ProductQA";
import ProductRecommend from "../components/product/ProductRecommend";

import { fetchProductById } from "../api/productApi";
import "./ProductDetail.css";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        console.log("🔍 불러올 productId:", productId);
        const data = await fetchProductById(productId);
        console.log("✅ 받아온 데이터:", data);
        
        // ⭐ 데이터 구조 변환
        const transformedData = {
          ...data,
          id: data.productId,
          title: data.productName,
          price: data.salePrice,
          discount: data.originalPrice > 0 
            ? Math.round((1 - data.salePrice / data.originalPrice) * 100)
            : 0,
          // 이미지는 따로 처리
        };
        
        setProduct(transformedData);
      } catch (error) {
        console.error("❌ 상품 불러오기 실패:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return <div style={{ padding: "40px" }}>상품 정보를 불러오는 중...</div>;
  }

  if (!product) {
    return <div style={{ padding: "40px" }}>상품을 찾을 수 없습니다.</div>;
  }

  // ⭐ 이미지 URL 생성
  const imageList = product.images && product.images.length > 0
    ? product.images.map(img => `http://13.209.66.16:8080/${img.saveDir}/${img.fileName}`)
    : ["/images/no-image.png"];

  // ⭐ ProductBuyBox용 이미지 추가
  const productWithImage = {
    ...product,
    image: imageList[0] // 첫 번째 이미지
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-wrapper">
        <div className="product-detail-left">
          <ProductImageSlider images={imageList} />
        </div>

        <div className="product-detail-right">
          <ProductBuyBox product={productWithImage} />
        </div>
      </div>

      <div className="product-detail-tabs">
        <div className={activeTab === "info" ? "active" : ""} onClick={() => setActiveTab("info")}>
          상품정보
        </div>
        <div className={activeTab === "review" ? "active" : ""} onClick={() => setActiveTab("review")}>
          리뷰
        </div>
        <div className={activeTab === "qa" ? "active" : ""} onClick={() => setActiveTab("qa")}>
          문의
        </div>
        <div className={activeTab === "recommend" ? "active" : ""} onClick={() => setActiveTab("recommend")}>
          추천상품
        </div>
      </div>
      <div className={`product-section ${activeTab === "review" ? "review-mode" : ""}`}>
        
        {activeTab === "info" && <ProductDetailContent product={product} />}
        {activeTab === "review" && <ProductReviews productId={productId} />}   
        {activeTab === "qa" && <ProductQA />}
        {activeTab === "recommend" && <ProductRecommend />}
      </div>

    </div>
  );
}

export default ProductDetail;