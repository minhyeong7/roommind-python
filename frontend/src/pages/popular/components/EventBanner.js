import React, { useRef, useState, useEffect } from "react";
import "./EventBanner.css";
import { events } from "../dummy/events";

export default function EventBanner() {
  const sliderRef = useRef(null);
  const cardRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);

  const totalItems = events.length;
  const visibleCount = 4; // 한 페이지 4개

  // 🔹 카드 하나의 width * 4 계산
  useEffect(() => {
    if (cardRef.current) {
      const cardStyle = getComputedStyle(cardRef.current);
      const cardWidth = cardRef.current.offsetWidth;
      const marginRight = parseInt(cardStyle.marginRight);

      setPageWidth((cardWidth + marginRight) * visibleCount);
    }
  }, []);

  const nextPage = () => {
    if (index < totalItems - visibleCount) {
      setIndex(index + visibleCount);
      sliderRef.current.scrollBy({ left: pageWidth, behavior: "smooth" });
    }
  };

  const prevPage = () => {
    if (index > 0) {
      setIndex(index - visibleCount);
      sliderRef.current.scrollBy({ left: -pageWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="event-section">

      {/* 더보기 버튼 */}
      <div className="event-header">
        <a href="/events" className="event-more">더보기</a>
      </div>

      <div className="event-slider-wrapper">

        {/* 왼쪽 버튼 */}
        {index > 0 && (
          <button className="event-btn left" onClick={prevPage}>❮</button>
        )}

        <div className="event-slider" ref={sliderRef}>
          {events.map((event, i) => (
            <div
              className="event-card"
              key={event.id + "_" + i}
              ref={i === 0 ? cardRef : null}
            >
              <div className="event-img-wrapper">
                <img src={event.image} alt={event.title} className="event-img" />
              </div>

              <p className="event-sub">{event.sub}</p>
              <p className="event-title">{event.title}</p>
            </div>
          ))}
        </div>

        {/* 오른쪽 버튼 */}
        {index < totalItems - visibleCount && (
          <button className="event-btn right" onClick={nextPage}>❯</button>
        )}
      </div>
    </div>
  );
}
