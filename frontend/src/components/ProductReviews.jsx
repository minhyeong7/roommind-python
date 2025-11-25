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
      "제가 교대근무 하는데 매번 남편이 까먹어 현관문에 붙여놔요ㅋㅋㅋ 활용도 어마어마 합니다 남편도 만족하고 저도 까먹을 일 없어 좋아요!!",
    image:
      "https://via.placeholder.com/120x120.png?text=Review+Image",
    helpful: 14,
  },
  {
    id: 2,
    user: "서리태콩국수",
    rating: 4,
    date: "2025.09.12",
    option: "화이트 / M",
    content: "깔끔하고 좋아요! 배송도 빨라서 만족합니다.",
    image:
      "https://via.placeholder.com/120x120.png?text=Review+Image",
    helpful: 9,
  },
];

function ReviewSection() {
  const [sortType, setSortType] = useState("best");
  const [filterStar, setFilterStar] = useState("");
  const [filterOption, setFilterOption] = useState("");

  const sortedReviews = [...dummyReviews]
    .filter((r) => (filterStar ? r.rating === Number(filterStar) : true))
    .filter((r) =>
      filterOption ? r.option.includes(filterOption) : true
    )
    .sort((a, b) =>
      sortType === "best" ? b.helpful - a.helpful : new Date(b.date) - new Date(a.date)
    );

  return (
    <div className="review-container">
      <div className="review-top">
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

      <div className="review-list">
        {sortedReviews.map((review) => (
          <div className="review-card" key={review.id}>
            <img
              className="review-img"
              src={review.image}
              alt="review"
            />

            <div className="review-content">
              <div className="review-user-info">
                <span className="review-user">{review.user}</span>
                <span className="review-rating">{"★".repeat(review.rating)}</span>
                <span className="review-date">{review.date}</span>
              </div>

              <div className="review-option">{review.option}</div>
              <div className="review-text">{review.content}</div>

              <div className="help-btn">
                👍 도움이 돼요 {review.helpful}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSection;
