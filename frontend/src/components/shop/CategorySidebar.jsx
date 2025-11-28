import { useState } from "react";
import "./CategorySidebar.css";

const categories = [
  {
    name: "가구",
    sub: [
      "침대",
      "매트리스·토퍼",
      "테이블·식탁·책상",
      "소파",
      "서랍·수납장",
      "거실장·TV장",
      "선반",
      "진열장·책장",
      "의자",
      "행거·옷장",
      "거울",
      "화장대·콘솔",
      "유아동가구",
      "야외가구",
      "공간박스·정리함",
    ],
  },
  { name: "크리스마스", sub: ["트리", "장식", "조명", "쿠션커버", "소품"] },
  { name: "패브릭", sub: ["이불", "커튼", "러그", "베개", "쿠션", "패브릭소품"] },
  { name: "조명", sub: ["스탠드", "테이블조명", "천장조명", "벽조명"] },
  { name: "주방", sub: ["식기", "조리도구", "커트러리", "컵·텀블러"] },
  { name: "수납·정리", sub: ["행거", "바구니", "리빙박스", "정리용품"] },
  { name: "생활용품", sub: ["욕실용품", "청소용품", "세탁용품"] },
  { name: "홈데코", sub: ["캔들·디퓨저", "시계", "액자·포스터", "가드닝"] },
];

function CategorySidebar() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <aside className="category-sidebar">
      <h2 className="category-title">카테고리</h2>

      <ul className="category-list">
        {categories.map((c, i) => (
          <li key={c.name} className="category-wrapper">
            <button
              className={`category-item ${openIndex === i ? "active" : ""}`}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span>{c.name}</span>
              <span className="arrow">{openIndex === i ? "▲" : "▼"}</span>
            </button>

            {openIndex === i && (
              <ul className="subcategory-list">
                {c.sub.map((sub) => (
                  <li key={sub} className="subcategory-item">
                    {sub}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default CategorySidebar;
