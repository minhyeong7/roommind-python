import React from "react";
import "./PopularPage.css";

// Components
import DealSlider from "./components/DealSlider";
import ReviewGrid from "./components/ReviewGrid";
import EventBanner from "./components/EventBanner";
import BestCategoryTabs from "./components/BestCategoryTabs";
import HomeRecommendGrid from "./components/HomeRecommendGrid";

// Dummy Data
import { deals } from "./dummy/deals";
import { reviews } from "./dummy/reviews";
import { events } from "./dummy/events";
import { bestItems } from "./dummy/bestItems";
import { homes } from "./dummy/homes";

export default function PopularPage() {
  return (
    <div className="popular-wrapper">

      {/* 오늘의 딜 */}
      <section className="popular-section">
        <h2>오늘의 딜</h2>
        <DealSlider items={deals} />
      </section>

      {/* 인테리어 시공 리뷰 */}
      <section className="popular-section">
        <h2>유저들의 인테리어 시공 리뷰</h2>
        <ReviewGrid items={reviews} />
      </section>

      {/* 기획전 */}
      <section className="popular-section">
        <h2>오늘의 기획전</h2>
        <EventBanner items={events} />
      </section>

      {/* 베스트 카테고리 */}
      <section className="popular-section">
        <h2>베스트</h2>
        <BestCategoryTabs items={bestItems} />
      </section>

      {/* 오늘의 추천 집들이 */}
      <section className="popular-section">
        <h2>오늘의 추천 집들이</h2>
        <HomeRecommendGrid items={homes} />
      </section>

    </div>
  );
}
