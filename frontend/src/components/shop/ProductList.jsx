// src/components/product/ProductList.jsx
import React, { useEffect, useState } from "react";
import { fetchFilteredProducts } from "../../api/productApi";
import "./ProductList.css";

function ProductList({ category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const params = {};
    if (category?.major) params.major = category.major;
    if (category?.middle) params.middle = category.middle;

    fetchFilteredProducts(params)
      .then((res) => setProducts(res))
      .catch((err) => console.error("상품 불러오기 실패:", err));
  }, [category]);

  return (
    <div className="product-list">
      {products.length === 0 ? (
        <div className="no-products">등록된 상품이 없습니다.</div>
      ) : (
        products.map((p) => {
          const img = p.images && p.images.length > 0 ? p.images[0] : null;
          const imageUrl = img
            ? `http://localhost:8080/${img.saveDir}/${img.fileName}`
            : "/images/no-image.png";

          const discountAmount = p.originalPrice - p.salePrice;
          const discountRate =
            p.originalPrice > 0
              ? Math.round((1 - p.salePrice / p.originalPrice) * 100)
              : 0;

          return (
            <div key={p.productId} className="card">
              <div className="card-img-box">
                <img src={imageUrl} alt={p.productName} />

                {/* 필요하면 특가 배지 유지 */}
                <div className="card-badge">특가</div>
              </div>

              <div className="card-info">
                <div className="card-brand">{p.brand}</div>
                <div className="card-title">{p.productName}</div>

                <div className="card-price-line">
                  {p.originalPrice > p.salePrice && (
                    <span className="card-discount">{discountRate}%</span>
                  )}
                  <span className="card-price">
                    {p.salePrice.toLocaleString()}원
                  </span>
                </div>

                {p.originalPrice > p.salePrice && (
                  <div className="card-original">
                    {p.originalPrice.toLocaleString()}원
                  </div>
                )}

                {p.originalPrice > p.salePrice && (
                  <div className="card-discount-amount">
                    {discountAmount.toLocaleString()}원 할인
                  </div>
                )}

                <div className="card-review">⭐ 0 리뷰 0</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ProductList;
