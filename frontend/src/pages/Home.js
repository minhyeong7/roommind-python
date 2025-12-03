import React from "react";
import BannerSlider from "../components/BannerSlider";
import Card from "../components/Card";
import "./Home.css";

function Home() {
  const products = [
    {
      image: "/images/whiteTable.jpg",
      title: "화이트 원목 테이블",
      price: "129,000",
      originalPrice: "169,000",
      link: "/product/white-table",
    },
    {
      image: "/images/minimalStand.jpg",
      title: "미니멀 조명 스탠드",
      price: "89,000",
      originalPrice: "119,000",
      link: "/product/minimal-stand",
    },
    {
      image: "/images/catTower.jpg",
      title: "캣타워",
      price: "176,000",
      originalPrice: "209,000",
      link: "/product/catTower",
    },
    {
      image: "/images/catTower2.jpg",
      title: "원목 캣타워",
      price: "118,000",
      originalPrice: "159,000",
      link: "/product/catTower2",
    },
    {
      image: "/images/dressingTable.webp",
      title: "화이트 수납 화장대",
      price: "89,000",
      originalPrice: "168,000",
      link: "/product/dressingTable",
    },
  ];

  const hotProducts = [
    {
      image: "/images/chair.jpg",
      title: "우드 체어",
      price: "99,000",
      originalPrice: "129,000",
      link: "/product/wood-chair",
    },
    {
      image: "/images/modernLamp.jpg",
      title: "모던 플로어 램프",
      price: "149,000",
      originalPrice: "199,000",
      link: "/product/modern-lamp",
    },
    {
      image: "/images/fabricSofa.jpg",
      title: "패브릭 소파",
      price: "269,000",
      originalPrice: "329,000",
      link: "/product/fabric-sofa",
    },
    {
      image: "/images/roundMirror.jpg",
      title: "라운드 거울",
      price: "69,000",
      originalPrice: "99,000",
      link: "/product/round-mirror",
    },
    {
      image: "/images/roundMirror.jpg",
      title: "라운드 거울",
      price: "69,000",
      originalPrice: "99,000",
      link: "/product/round-mirror2",
    },
  ];

  const saleProducts = [
    {
      image: "/images/sofaSale.jpg",
      title: "세일 소파",
      price: "199,000",
      originalPrice: "299,000",
      link: "/product/sale-sofa",
    },
    {
      image: "/images/tableSale.jpg",
      title: "세일 테이블",
      price: "79,000",
      originalPrice: "129,000",
      link: "/product/sale-table",
    },
    {
      image: "/images/lampSale.jpg",
      title: "세일 조명",
      price: "49,000",
      originalPrice: "89,000",
      link: "/product/sale-lamp",
    },
  ];

  return (
    <div className="home">
      <BannerSlider />

      {/* 첫 번째 섹션 */}
      <h2 className="home-section-title">이 가구 어때요 ?</h2>
      <div className="card-grid">
        {products.map((item, i) => (
          <Card key={i} {...item} product={item} />
        ))}
      </div>

      {/* 두 번째 섹션 */}
      <h2 className="home-section-title">요즘 핫한 인기상품!</h2>
      <div className="card-grid">
        {hotProducts.map((item, i) => (
          <Card key={i} {...item} product={item} />
        ))}
      </div>

      {/* 세 번째 섹션 */}
      <h2 className="home-section-title">세일 중인 상품</h2>
      <div className="card-grid">
        {saleProducts.map((item, i) => (
          <Card key={i} {...item} product={item} />
        ))}
      </div>
    </div>
  );
}

export default Home;
