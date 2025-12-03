import { useState, useEffect } from "react";
import "./CategorySidebar.css";
import { fetchCategories } from "../../api/categoryApi";

function CategorySidebar({ onSelectCategory }) {
  const [openMain, setOpenMain] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null); // ⭐ 선택된 중분류 상태

  useEffect(() => {
    fetchCategories().then((res) => {
      const grouped = groupCategories(res.data);
      setCategories(grouped);
    });
  }, []);

  const groupCategories = (categoryList) => {
    const map = {};

    categoryList.forEach((c) => {
      if (!map[c.majorCategory]) {
        map[c.majorCategory] = [];
      }
      map[c.majorCategory].push(c.middleCategory);
    });

    return Object.keys(map).map((major) => ({
      name: major,
      sub: map[major],
    }));
  };

  return (
    <div className="category-container">
      {categories.map((main, mainIndex) => (
        <div key={main.name} className="main-category">

          {/* 대분류 버튼 */}
          <button
            className="main-btn"
            onClick={() =>
              setOpenMain(openMain === mainIndex ? null : mainIndex)
            }
          >
            <span className={openMain === mainIndex ? "active-text" : ""}>
              {main.name}
            </span>
            <span className="arrow">{openMain === mainIndex ? "▲" : "▼"}</span>
          </button>

          {/* 중분류 리스트 */}
          {openMain === mainIndex && (
            <ul className="sub-list">
              {main.sub.map((item) => (
                <li
                  key={item}
                  className={`sub-item ${selectedSub === item ? "active-sub" : ""}`}
                  onClick={() => {
                    setSelectedSub(item); // ⭐ 선택 표시
                    onSelectCategory({
                      major: main.name,
                      middle: item,
                    });
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}

        </div>
      ))}
    </div>
  );
}


export default CategorySidebar;
