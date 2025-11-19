import React, { useState } from "react";
import BestItemCard from "./BestItemCard";
import { bestItems } from "../dummy/bestItems";

export default function BestCategoryTabs() {
  const [activeTab, setActiveTab] = useState("전체");

  const tabs = ["전체", "가구", "패브릭", "데코", "조명", "생활용품"];

  return (
    <>
      <div className="best-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="best-grid">
        {bestItems.map((item) => (
          <BestItemCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
