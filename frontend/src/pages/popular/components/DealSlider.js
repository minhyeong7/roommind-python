import React, { useRef, useState } from "react";
import "./DealSlider.css";

export default function DealSlider({ items }) {
  const sliderRef = useRef(null);

  // Drag 상태
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 마우스 드래그 시작
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  // 마우스 드래그 중
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = x - startX;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 왼쪽 버튼 슬라이드
  const slideLeft = () => {
    sliderRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  // 오른쪽 버튼 슬라이드
  const slideRight = () => {
    sliderRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div className="deal-slider-wrapper">
      <button className="slide-btn left" onClick={slideLeft}>❮</button>

      <div
        className="deal-slider"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
      >
        {items.map((item, idx) => (
          <div key={idx} className="deal-card">

            <div className="image-wrapper">
              {item.timeLeft && (
                <div className="time-badge">{item.timeLeft}</div>
              )}

              {item.tag && (
                <div className="special-badge">{item.tag}</div>
              )}

              {item.image ? (
                <img src={item.image} alt="" className="deal-image" />
              ) : (
                <div className="img-placeholder">No Image</div>
              )}

              <div className="bookmark">♡</div>
            </div>

            <div className="item-info">
              <p className="brand">{item.brand}</p>
              <p className="title">{item.title}</p>

              <div className="price-box">
                <span className="discount">{item.discount}%</span>
                <span className="price">
                  {item.price.toLocaleString()} 원
                </span>
              </div>

              <div className="review-box">
                ⭐ {item.rating}
                <span className="review-count"> 리뷰 {item.reviews}</span>
              </div>

              {item.freeShipping && <div className="free">무료배송</div>}
            </div>

          </div>
        ))}
      </div>

      <button className="slide-btn right" onClick={slideRight}>❯</button>
    </div>
  );
}
