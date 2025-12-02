import React, { useState } from "react";
import "./CategoryModal.css";

export default function CategoryModal({
  categories,
  setCategories,
  onClose,
}) {
  const [majorInput, setMajorInput] = useState("");
  const [middleInput, setMiddleInput] = useState("");

  // 모든 대분류 목록
  const majorList = [...new Set(categories.map(c => c.major_category))];

  // 탭에서 선택된 대분류
  const [activeMajor, setActiveMajor] = useState(majorList[0] || "");

  // 해당 대분류의 중분류
  const middleList = categories.filter(
    c => c.major_category === activeMajor && c.middle_category !== null
  );

  // 대분류 추가
  const handleAddMajor = () => {
    if (!majorInput.trim()) return;

    if (majorList.includes(majorInput)) {
      alert("이미 존재하는 대분류입니다.");
      return;
    }

    const newMajor = {
      category_id: Date.now(),
      major_category: majorInput,
      middle_category: null
    };

    setCategories([...categories, newMajor]);
    setMajorInput("");
    setActiveMajor(majorInput);
  };

  // 중분류 추가
  const handleAddMiddle = () => {
    if (!middleInput.trim()) return;

    const newMiddle = {
      category_id: Date.now(),
      major_category: activeMajor,
      middle_category: middleInput
    };

    setCategories([...categories, newMiddle]);
    setMiddleInput("");
  };

  // 중분류 삭제
  const handleDeleteMiddle = (id) => {
    setCategories(categories.filter(c => c.category_id !== id));
  };

  // 대분류 삭제
  const handleDeleteMajor = (major) => {
    const hasChildren = categories.some(
      (c) => c.major_category === major && c.middle_category
    );

    if (hasChildren) {
      alert("중분류가 있어 삭제할 수 없습니다.");
      return;
    }

    setCategories(categories.filter((c) => c.major_category !== major));

    // 탭이 삭제된 경우 자동으로 첫 번째 대분류로 이동
    const updated = majorList.filter(m => m !== major);
    setActiveMajor(updated[0] || "");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <h2>카테고리 관리</h2>

        {/* 대분류 */}
        <h3>대분류</h3>
        <ul className="category-list">
          {majorList.map((major) => (
            <li key={major}>
              {major}
              <button className="delete-btn" onClick={() => handleDeleteMajor(major)}>
                ✕
              </button>
            </li>
          ))}
        </ul>

        <div className="add-category-row">
          <input
            type="text"
            placeholder="새 대분류 입력"
            value={majorInput}
            onChange={(e) => setMajorInput(e.target.value)}
          />
          <button className="add-btn" onClick={handleAddMajor}>추가</button>
        </div>

        {/* 중분류 */}
        <h3 style={{ marginTop: "25px" }}>중분류</h3>

        {/* 탭 메뉴 */}
        <div className="major-tabs">
          {majorList.map((major) => (
            <div
              key={major}
              className={`major-tab ${activeMajor === major ? "active" : ""}`}
              onClick={() => setActiveMajor(major)}
            >
              {major}
            </div>
          ))}
        </div>

        {/* 중분류 리스트 */}
        <ul className="category-list">
          {middleList.map((c) => (
            <li key={c.category_id}>
              {c.middle_category}
              <button
                className="delete-btn"
                onClick={() => handleDeleteMiddle(c.category_id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {/* 중분류 추가 */}
        <div className="add-category-row">
          <input
            type="text"
            placeholder={`${activeMajor}의 새 중분류 입력`}
            value={middleInput}
            onChange={(e) => setMiddleInput(e.target.value)}
          />
          <button className="add-btn" onClick={handleAddMiddle}>추가</button>
        </div>
      </div>
    </div>
  );
}
