import React, { useRef } from "react";
import "./DealSlider.css";

export default function DealSlider({ items }) {
  const sliderRef = useRef(null);

  // 왼쪽 이동
  const slideLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  // 오른쪽 이동
  const slideRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="deal-slider-wrapper">
      <button className="slide-btn left" onClick={slideLeft}>◀</button>

      <div className="deal-slider" ref={sliderRef}>
        {items.map((item, idx) => (
          <div key={idx} className="deal-card">
            <div className="deal-img">
              {item.image ? (
                <img src={item.image} alt="" />
              ) : (
                <div className="img-placeholder">No Image</div>
              )}
            </div>

            <div className="deal-info">
              <span className="discount">{item.discount}%</span>
              <p className="title">{item.title}</p>
              <p className="price">{item.price.toLocaleString()}원</p>
            </div>
          </div>
        ))}
      </div>

      <button className="slide-btn right" onClick={slideRight}>▶</button>
    </div>
  );
}
