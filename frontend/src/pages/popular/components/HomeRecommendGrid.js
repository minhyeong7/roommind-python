import React from "react";
import { homes } from "../dummy/homes";
import { Link } from "react-router-dom";
import "./HomeRecommendGrid.css";

export default function HomeRecommendGrid() {
  return (
    <section className="home-section">

      {/* 제목 + 더보기 */}
      <div className="home-header">
        <Link to="/community" className="home-more">더보기</Link>
      </div>

      {/* 카드 영역 */}
      <div className="home-grid">
        {homes.map((home) => (
          <div className="home-card" key={home.id}>
            <img src={home.image} alt={home.title} className="home-img" />
            <p className="home-title">{home.title}</p>
            <p className="home-sub">{home.sub}</p>

          </div>
        ))}
      </div>

    </section>
  );
}
