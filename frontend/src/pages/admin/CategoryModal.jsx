import React, { useState } from "react";
import "./CategoryModal.css";

export default function CategoryModal({
  categories,
  setCategories,
  onClose,
}) {
  const [majorInput, setMajorInput] = useState("");
  const [middleInput, setMiddleInput] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");

  // 🔥 현재 major 목록
  const majorList = [...new Set(categories.map(c => c.major_category))];

  // 🔥 major 선택 시 해당 중분류 목록 필터링
  const middleList = selectedMajor
    ? categories.filter(c => c.major_category === selectedMajor)
    : [];

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
      middle_category: null // 중분류 X
    };

    setCategories([...categories, newMajor]);
    setMajorInput("");
  };

  // 중분류 추가
  const handleAddMiddle = () => {
    if (!middleInput.trim() || !selectedMajor) {
      alert("대분류를 먼저 선택해주세요.");
      return;
    }

    const newMiddle = {
      category_id: Date.now(),
      major_category: selectedMajor,
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
    const hasChildren = categories.some(c => c.major_category === major && c.middle_category);

    if (hasChildren) {
      alert("해당 대분류에 속한 중분류가 있어 삭제할 수 없습니다.");
      return;
    }

    setCategories(categories.filter(c => c.major_category !== major));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <h2>카테고리 관리</h2>

        {/* ===================== */}
        {/* 대분류 관리 */}
        {/* ===================== */}
        <h3>대분류</h3>
        <ul className="category-list">
          {majorList.map((major) => (
            <li key={major}>
              {major}
              <button
                className="delete-btn"
                onClick={() => handleDeleteMajor(major)}
              >
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
          <button className="add-btn" onClick={handleAddMajor}>
            추가
          </button>
        </div>

        {/* ===================== */}
        {/* 중분류 관리 */}
        {/* ===================== */}
        <h3 style={{ marginTop: "20px" }}>중분류</h3>

        {/* 대분류 선택 */}
        <select
          value={selectedMajor}
          onChange={(e) => setSelectedMajor(e.target.value)}
        >
          <option value="">대분류 선택</option>
          {majorList.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* 해당 대분류의 중분류 목록 */}
        {selectedMajor && (
          <ul className="category-list" style={{ marginTop: "10px" }}>
            {middleList.map((c) =>
              c.middle_category ? (
                <li key={c.category_id}>
                  {c.middle_category}
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMiddle(c.category_id)}
                  >
                    ✕
                  </button>
                </li>
              ) : null
            )}
          </ul>
        )}

        {/* 중분류 추가 입력 */}
        {selectedMajor && (
          <div className="add-category-row">
            <input
              type="text"
              placeholder={`${selectedMajor}의 새 중분류 입력`}
              value={middleInput}
              onChange={(e) => setMiddleInput(e.target.value)}
            />
            <button className="add-btn" onClick={handleAddMiddle}>
              추가
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
