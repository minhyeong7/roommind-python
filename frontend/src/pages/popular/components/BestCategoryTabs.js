import React, { useState } from "react";
import BestList from "./BestList";
import { bestItems } from "../dummy/bestItems";
// import "./BestCategoryTabs.css";

export default function BestCategoryTabs() {
  const [activeTab, setActiveTab] = useState("전체");

  const tabs = ["전체", "가구", "패브릭", "데코", "조명", "생활용품"];

  const filtered =
    activeTab === "전체"
      ? bestItems
      : bestItems.filter(item => item.category === activeTab);

  return (
    <div className="best-tabs-section">
      <div className="best-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <BestList items={filtered} />
    </div>
  );
}
