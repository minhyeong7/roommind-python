import React, { useEffect, useState } from "react";
import BannerSlider from "../components/BannerSlider";
import Card from "../components/Card";
import { fetchAllProducts } from "../api/productApi"; // ⭐ 실제 API import
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

const loadProducts = async () => {
  try {
    const list = await fetchAllProducts();

    console.log("🔥 홈 전체 상품:", list);


    setProducts(list.slice(0, 5));
    setHotProducts(list.slice(5, 10));
    setSaleProducts(list.filter(p => p.salePrice < p.originalPrice));

  } catch (err) {
    console.error("상품 불러오기 실패:", err);
  }
};


  return (
    <div className="home">
      <BannerSlider />

      <h2 className="home-section-title">이 가구 어때요?</h2>
      <div className="card-grid">
        {products.map(item => (
          <Card key={item.productId} product={item} />
        ))}
      </div>

      <h2 className="home-section-title">요즘 핫한 인기상품!</h2>
      <div className="card-grid">
        {hotProducts.map(item => (
          <Card key={item.productId} product={item} />
        ))}
      </div>

      <h2 className="home-section-title">세일 중인 상품</h2>
      <div className="card-grid">
        {saleProducts.map(item => (
          <Card key={item.productId} product={item} />
        ))}
      </div>
    </div>
  );
}

export default Home;
