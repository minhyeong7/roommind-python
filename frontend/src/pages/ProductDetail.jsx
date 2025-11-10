import React from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();

  // 임시 예시 데이터 (나중에 DB나 API 연동 가능)
  const productData = {
    "white-table": {
      title: "화이트 원목 테이블",
      image: "/images/whiteTable.jpg",
      price: "129,000",
      originalPrice: "169,000",
      description: "심플하고 내추럴한 감성의 원목 테이블입니다. 거실이나 다이닝룸에 잘 어울립니다.",
    },
    "fabric-sofa": {
      title: "패브릭 소파",
      image: "/images/fabricSofa.jpg",
      price: "329,000",
      originalPrice: "389,000",
      description: "포근한 촉감의 패브릭 소재와 넉넉한 크기로 편안한 휴식을 제공합니다.",
    },
  };

  const product = productData[id];

  if (!product) return <div className="detail"><p>상품을 찾을 수 없습니다.</p></div>;

  const priceNum = parseInt(product.price.replace(/,/g, ""), 10);
  const originalNum = parseInt(product.originalPrice.replace(/,/g, ""), 10);
  const discountRate = Math.round(((originalNum - priceNum) / originalNum) * 100);

  return (
    <div className="detail">
      <div className="detail-container">
        <img src={product.image} alt={product.title} className="detail-image" />
        <div className="detail-info">
          <h2>{product.title}</h2>
          <div className="detail-prices">
            <span className="detail-discount">{product.price}원</span>
            <span className="detail-original">{product.originalPrice}원</span>
            <span className="detail-rate">(-{discountRate}%)</span>
          </div>
          <p className="detail-desc">{product.description}</p>
          <button className="buy-btn">장바구니 담기</button>
          <Link to="/" className="back-link">← 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
