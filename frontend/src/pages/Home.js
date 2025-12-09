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

  const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};


const loadProducts = async () => {
  try {
    const list = await fetchAllProducts();

    // 전체 상품 셔플
    const shuffled = shuffleArray(list);

    // 이 가구 어때요? → 랜덤 5개
    setProducts(shuffled.slice(0, 5));

    // 요즘 핫한 인기상품! → 그다음 랜덤 5개
    setHotProducts(shuffled.slice(5, 10));

    // 세일중인 상품 랜덤 5개
    const saleList = list.filter(p => p.salePrice < p.originalPrice);
    const randomSale = shuffleArray(saleList).slice(0, 5);
    setSaleProducts(randomSale);

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
