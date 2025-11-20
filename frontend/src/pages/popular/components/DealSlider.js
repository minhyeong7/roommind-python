import React, { useRef, useState, useEffect } from "react";
import "./DealSlider.css";

export default function DealSlider({ items }) {
  const sliderRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 버튼 표시 여부
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // 카드 하나의 width + gap 계산
  const getCardSize = () => {
    const slider = sliderRef.current;
    const card = slider?.querySelector(".deal-card");
    if (!card) return 0;

    const style = window.getComputedStyle(card);
    const width = card.offsetWidth;
    const margin = parseFloat(style.marginRight);

    return width + margin; // 카드 1개 전체 너비
  };

  // 페이지 단위 이동
  const slidePage = (direction) => {
    const slider = sliderRef.current;
    const cardSize = getCardSize();

    const moveAmount = cardSize * 4; // 🔥 한 번에 카드 4개 이동

    slider.scrollBy({
      left: direction === "left" ? -moveAmount : moveAmount,
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

  // 드래그 중
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = x - startX;

    sliderRef.current.scrollLeft = scrollLeft - walk;
    updateButtons();
  };

  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 버튼 숨김 제어
  const updateButtons = () => {
    const slider = sliderRef.current;

    const maxScroll = slider.scrollWidth - slider.clientWidth;

    setShowLeft(slider.scrollLeft > 0);
    setShowRight(slider.scrollLeft < maxScroll - 1);
  };

  // 컴포넌트 로드시 한 번 체크
  useEffect(() => {
    updateButtons();
  }, []);

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

            <div className="image-wrapper">
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
                <span className="price">{item.price.toLocaleString()} 원</span>
              </div>
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
