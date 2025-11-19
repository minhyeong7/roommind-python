import React from "react";
import { homes } from "../dummy/homes";

export default function HomeRecommendGrid() {
  return (
    <div className="home-grid">
      {homes.map((home) => (
        <div className="home-card" key={home.id}>
          <img src={home.image} alt={home.title} />
          <p>{home.title}</p>
        </div>
      ))}
    </div>
  );
}
