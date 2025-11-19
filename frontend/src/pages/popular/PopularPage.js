import React from "react";
import "./PopularPage.css";

import DealSlider from "./components/DealSlider";
import ReviewGrid from "./components/ReviewGrid";
import EventBanner from "./components/EventBanner";
import BestCategoryTabs from "./components/BestCategoryTabs";
import HomeRecommendGrid from "./components/HomeRecommendGrid";

export default function PopularPage() {
  return (
    <div className="popular-wrapper">

      <section className="popular-section">
        <h2>오늘의딜</h2>
        <DealSlider />
      </section>

      <section className="popular-section">
        <h2>유저들의 인테리어 시공 리뷰</h2>
        <ReviewGrid />
      </section>

      <section className="popular-section">
        <h2>오늘의 기획전</h2>
        <EventBanner />
      </section>

      <section className="popular-section">
        <h2>베스트</h2>
        <BestCategoryTabs />
      </section>

      <section className="popular-section">
        <h2>오늘의 추천 집들이</h2>
        <HomeRecommendGrid />
      </section>

    </div>
  );
}
