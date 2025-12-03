import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductList.css";

function ProductList({ category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const params = {};
    if (category?.major) params.major = category.major;
    if (category?.middle) params.middle = category.middle;

    axios.get("/api/products/filter", { params })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("상품 불러오기 실패:", err));
  }, [category]);

  return (
    <div className="product-list">
      {products.map((p) => {
        const img = p.images && p.images.length > 0 ? p.images[0] : null;
        const imageUrl = img
          ? `http://localhost:8080/${img.saveDir}/${img.fileName}`
          : "/no-image.png"; // 기본 이미지

        return (
          <div key={p.productId} className="product-card">
            <div className="card-image">
              <img src={imageUrl} alt={p.productName} />
              <div className="badge">특가</div>
            </div>

            <div className="card-info">
              <p className="brand">{p.brand}</p>
              <p className="name">{p.productName}</p>

              <div className="price-wrap">
                <span className="price">
                  {p.salePrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductList;
