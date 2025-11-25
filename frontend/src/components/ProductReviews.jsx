import React, { useState } from "react";
import "./ProductReviews.css";

const dummyReviews = [
  {
    id: 1,
    user: "뚜비럼바",
    rating: 5,
    date: "2025.11.20",
    option: "캘린더형 / S",
    content:
      "제가 교대근무 하는데 남편이 맨날 까먹어서 현관문에 붙여놨어요ㅋㅋ 활용도 최고예요!!",
    image: "https://via.placeholder.com/120x120.png?text=Review",
    helpful: 14,
  },
  {
    id: 2,
    user: "서리태콩국수",
    rating: 4,
    date: "2025.09.12",
    option: "화이트 / M",
    content: "깔끔하고 예뻐요! 배송도 빨라서 만족!",
    image: "https://via.placeholder.com/120x120.png?text=Review",
    helpful: 9,
  },
];

function ProductReviews() {
  const [sortType, setSortType] = useState("best");
  const [filterStar, setFilterStar] = useState("");
  const [filterOption, setFilterOption] = useState("");

  const sorted = [...dummyReviews]
    .filter((r) => (filterStar ? r.rating === Number(filterStar) : true))
    .filter((r) => (filterOption ? r.option.includes(filterOption) : true))
    .sort((a, b) =>
      sortType === "best"
        ? b.helpful - a.helpful
        : new Date(b.date) - new Date(a.date)
    );

  return (
    <div className="review-wrapper">

      {/* 정렬 + 필터 */}
      <div className="review-header">
        <div className="review-sort-left">
          <button
            className={sortType === "best" ? "active" : ""}
            onClick={() => setSortType("best")}
          >
            베스트순
          </button>
          <button
            className={sortType === "latest" ? "active" : ""}
            onClick={() => setSortType("latest")}
          >
            최신순
          </button>
        </div>

        <div className="review-filter-right">
          <select
            value={filterStar}
            onChange={(e) => setFilterStar(e.target.value)}
          >
            <option value="">별점 전체</option>
            <option value="5">★ 5점</option>
            <option value="4">★ 4점</option>
            <option value="3">★ 3점</option>
            <option value="2">★ 2점</option>
            <option value="1">★ 1점</option>
          </select>

          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="">옵션 전체</option>
            <option value="S">S 사이즈</option>
            <option value="M">M 사이즈</option>
            <option value="화이트">화이트</option>
          </select>
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="review-list">
        {sorted.map((review) => (
          <div className="review-card" key={review.id}>
            <img src={review.image} className="review-img" alt="review" />

            <div className="review-content">
              <div className="review-header-line">
                <span className="review-user">{review.user}</span>
                <span className="review-rating">{"★".repeat(review.rating)}</span>
                <span className="review-date">{review.date}</span>
              </div>

              <div className="review-option">{review.option}</div>

              <div className="review-text">{review.content}</div>

              <button className="help-btn">
                👍 도움이 돼요 {review.helpful}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductReviews;
