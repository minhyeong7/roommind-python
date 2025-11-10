import React from "react";
import BannerSlider from "../components/BannerSlider";
import Card from "../components/Card";
import "./Home.css";

function Home() {
  const products = [
    { image: "/images/whiteTable.jpg", title: "화이트 원목 테이블", price: "129,000", originalPrice: "169,000", link: "/product/white-table" },
    { image: "/images/minimalStand.jpg", title: "미니멀 조명 스탠드", price: "89,000", originalPrice: "119,000", link: "/product/minimal-stand" },
    { image: "/images/fabricSofa.jpg", title: "패브릭 소파", price: "329,000", originalPrice: "389,000", link: "/product/fabric-sofa" },
    { image: "/images/fabricSofa.jpg", title: "패브릭 소파", price: "329,000", originalPrice: "389,000", link: "/product/fabric-sofa" },
    { image: "/images/fabricSofa.jpg", title: "패브릭 소파", price: "329,000", originalPrice: "389,000", link: "/product/fabric-sofa" },
  ];

  const hotProducts = [
    { image: "/images/chair.jpg", title: "우드 체어", price: "99,000", originalPrice: "129,000", link: "/product/wood-chair" },
    { image: "/images/modernLamp.jpg", title: "모던 플로어 램프", price: "149,000", originalPrice: "199,000", link: "/product/modern-lamp" },
    { image: "/images/roundMirror.jpg", title: "라운드 거울", price: "69,000", originalPrice: "99,000", link: "/product/round-mirror" },
    { image: "/images/roundMirror.jpg", title: "라운드 거울", price: "69,000", originalPrice: "99,000", link: "/product/round-mirror" },
    { image: "/images/roundMirror.jpg", title: "라운드 거울", price: "69,000", originalPrice: "99,000", link: "/product/round-mirror" },
  ];

  return (
    <div className="home">
      <BannerSlider />

      {/* 첫 번째 섹션 */}
      <h2 className="section-title">이 가구 어때요 ?</h2>
      <div className="card-grid">
        {products.map((item, i) => <Card key={i} {...item} />)}
      </div>

      {/* 두 번째 섹션 */}
      <h2 className="section-title">요즘 핫한 인기상품!</h2>
      <div className="card-grid">
        {hotProducts.map((item, i) => <Card key={i} {...item} />)}
      </div>
    </div>
  );
}

export default Home;
