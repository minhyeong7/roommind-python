import React, { useRef, useState, useEffect } from "react";
import "./DealSlider.css";

export default function DealSlider({ items }) {
  const sliderRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 좋아요 저장
  const [likes, setLikes] = useState({});

  // 좌/우 버튼 표시
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // 카드 크기 계산
  const getCardSize = () => {
    const slider = sliderRef.current;
    const card = slider?.querySelector(".deal-card");
    if (!card) return 0;

    const style = window.getComputedStyle(card);
    const width = card.offsetWidth;
    const margin = parseFloat(style.marginRight);

    return width + margin;
  };

  // 4개씩 슬라이드
  const slidePage = (direction) => {
    const slider = sliderRef.current;
    const cardSize = getCardSize();

    slider.scrollBy({
      left: direction === "left" ? -cardSize * 4 : cardSize * 4,
      behavior: "smooth",
    });

    setTimeout(updateButtons, 350);
  };

  // 드래그 시작
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  // 드래그 이동
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = x - startX;
    sliderRef.current.scrollLeft = scrollLeft - walk;

    updateButtons();
  };

  // 드래그 종료
  const handleMouseUp = () => setIsDragging(false);

  // 버튼 업데이트
  const updateButtons = () => {
    const slider = sliderRef.current;
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    setShowLeft(slider.scrollLeft > 0);
    setShowRight(slider.scrollLeft < maxScroll - 1);
  };

  useEffect(() => {
    updateButtons();
  }, []);

  // 하트 토글
  const toggleLike = (idx) => {
    setLikes((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="deal-slider-wrapper">

      {showLeft && (
        <button className="slide-btn left" onClick={() => slidePage("left")}>
          ❮
        </button>
      )}

      <div
        className="deal-slider"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        onScroll={updateButtons}
      >
        {items.map((item, idx) => (
          <div key={idx} className="deal-card">

            {/* 이미지 */}
            <div className="image-wrapper">
              {item.image ? (
                <img src={item.image} alt={item.title} className="deal-image" />
              ) : (
                <div className="img-placeholder">이미지 준비중</div>
              )}

              {/* 좋아요 */}
              <div
                className={`bookmark ${likes[idx] ? "active" : ""}`}
                onClick={() => toggleLike(idx)}
              >
                {likes[idx] ? "❤️" : "🤍"}
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="item-info">
              {item.brand && <p className="brand">{item.brand}</p>}

              <p className="title">{item.title}</p>

              <div className="price-box">
                <span className="discount">{item.discount}%</span>
                <span className="price">{item.price.toLocaleString()}원</span>
              </div>

              {/* ⭐ 별점 */}
              {item.rating && (
                <div className="best-rating">
                  ⭐ {item.rating} 리뷰 {item.reviewCount?.toLocaleString()}
                </div>
              )}

              {/* 무료배송 */}
              {item.free && <div className="best-free">무료배송</div>}
            </div>

          </div>
        ))}
      </div>

      {showRight && (
        <button className="slide-btn right" onClick={() => slidePage("right")}>
          ❯
        </button>
      )}
    </div>
  );
}
