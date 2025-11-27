import React from "react";
import "./CategoryModal.css";

export default function CategoryModal({
  categories,
  setCategories,
  onClose,
  newCategory,
  setNewCategory,
  handleAddCategory,
  handleDeleteCategory
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()} // 배경 클릭만 닫히게
      >
        {/* 오른쪽 상단 닫기 버튼 */}
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>카테고리 관리</h2>

        {/* 카테고리 목록 */}
        <ul className="category-list">
          {categories.map((c) => (
            <li key={c.id}>
              {c.name}
              <button
                className="delete-btn"
                onClick={() => handleDeleteCategory(c.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {/* 새 카테고리 입력 */}
        <div className="add-category-row">
          <input
            type="text"
            placeholder="새 카테고리 입력"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button className="add-btn" onClick={handleAddCategory}>
            추가
          </button>
        </div>
      </div>
    </div>
  );
}
