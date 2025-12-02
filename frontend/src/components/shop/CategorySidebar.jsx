import { useState, useEffect } from "react";
import "./CategorySidebar.css";
import { fetchCategories } from "../../api/categoryApi"; // 네 API 경로에 맞게 수정

function CategorySidebar() {
  const [openMain, setOpenMain] = useState(null);
  const [categories, setCategories] = useState([]);  // ⭐ 실제 서버 데이터 저장

  // 1) 서버에서 카테고리 가져오기
  useEffect(() => {
    fetchCategories().then((res) => {
      const data = res.data;

      // majorCategory 기준 그룹핑
      const grouped = groupCategories(data);

      setCategories(grouped);
    });
  }, []);

  // 2) majorCategory 기준 그룹핑 함수
  const groupCategories = (categoryList) => {
    const map = {};

    categoryList.forEach((c) => {
      if (!map[c.majorCategory]) {
        map[c.majorCategory] = [];
      }
      map[c.majorCategory].push(c.middleCategory);
    });

    // [{ name: "가구", sub: ["소파","침대"...] }, ... ] 형태로 변환
    return Object.keys(map).map((major) => ({
      name: major,
      sub: map[major],
    }));
  };

  return (
    <div className="category-container">
      {categories.map((main, mainIndex) => (
        <div key={main.name} className="main-category">
          {/* 대분류 */}
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

          {/* 중분류 */}
          {openMain === mainIndex && (
            <ul className="sub-list">
              {main.sub.map((item) => (
                <li key={item} className="sub-item">
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
