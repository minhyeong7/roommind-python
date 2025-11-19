import React from "react";
import { deals } from "../dummy/deals";

export default function DealSlider() {
  return (
    <div className="deal-slider">
      {deals.map((item) => (
        <div className="deal-card" key={item.id}>
          <img src={item.image} alt={item.title} />
          <div className="deal-info">
            <span className="discount">{item.discount}</span>
            <p className="title">{item.title}</p>
            <p className="price">{item.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
