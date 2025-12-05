import React, { useRef, useState } from "react";
import BestItemCard from "./BestItemCard";
import "./BestList.css";

export default function BestList({ items }) {
  const sliderRef = useRef(null);
  const [index, setIndex] = useState(0);

  const visible = 3;
  const maxIndex = Math.ceil(items.length / visible) - 1;

  const next = () => {
    if (index < maxIndex) {
      setIndex(index + 1);
      sliderRef.current.scrollBy({ left: 1200, behavior: "smooth" });
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
      sliderRef.current.scrollBy({ left: -1200, behavior: "smooth" });
    }
  };

  return (
    <div className="best-section">
      {index > 0 && (
        <button className="best-btn left" onClick={prev}>❮</button>
      )}

      <div className="best-slider" ref={sliderRef}>
        {items.map(item => (
          <BestItemCard key={item.id} item={item} />
        ))}
      </div>

      {index < maxIndex && (
        <button className="best-btn right" onClick={next}>❯</button>
      )}
    </div>
  );
}
