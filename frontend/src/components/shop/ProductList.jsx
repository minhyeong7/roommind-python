import React from "react";
import "./ProductList.css";
import { products } from "../../data/products";

function ProductList({ category }) {
  const filtered = category
    ? products.filter((p) => p.category === category)
    : products;

  return (
    <div className="product-list">
      {filtered.map((p) => (
        <div key={p.id} className="product-card">
          <div className="card-image">
            <img src={p.image} alt={p.name} />
            <div className="badge">특가</div>
          </div>

          <div className="card-info">
            <p className="brand">{p.brand}</p>
            <p className="name">{p.name}</p>

            <div className="price-wrap">
              <span className="discount">{p.discount}%</span>
              <span className="price">{p.price.toLocaleString()}원</span>
            </div>

            <div className="rating">
              ⭐ {p.rating} <span>리뷰 {p.reviews.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
