import React, { useState } from "react";
import CategorySidebar from "./CategorySidebar";
import ProductList from "./ProductList";
import "./ShopPage.css";

function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="shop-container">
      {/* 왼쪽 카테고리 */}
      <CategorySidebar onSelectCategory={setSelectedCategory} />

      {/* 오른쪽 상품 영역 */}
      <div className="shop-content">
        <ProductList category={selectedCategory} />
      </div>
    </div>
  );
}

export default ShopPage;
