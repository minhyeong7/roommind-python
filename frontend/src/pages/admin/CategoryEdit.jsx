// src/admin/CategoryEdit.js
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../api/userApi";
import "./CategoryEdit.css";

export default function CategoryEdit() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("none");
  const [form, setForm] = useState({
    categoryId: null,
    majorCategory: "",
    middleCategory: ""
  });

  // ===========================
  // 목록 불러오기
  // ===========================
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategories(res.data);
      console.log("카테고리 목록:", res.data);
    } catch (err) {
      console.error("카테고리 목록 불러오기 실패:", err);
    }
  };

  // ===========================
  // 단일 조회
  // ===========================
  const handleSelect = async (categoryId) => {
    try {
      const res = await api.get(`/admin/categories/${categoryId}`);
      setForm(res.data);
      setSelected(categoryId);
      setMode("edit");
    } catch (err) {
      console.error("카테고리 조회 실패:", err);
    }
  };

  // ===========================
  // 대분류 추가
  // ===========================
  const newMajor = () => {
    setForm({
      categoryId: null,
      majorCategory: "",
      middleCategory: null
    });
    setSelected(null);
    setMode("new-major");
  };

  // ===========================
  // 중분류 추가
  // ===========================
  const newMiddle = (major) => {
    setForm({
      categoryId: null,
      majorCategory: major,
      middleCategory: ""
    });
    setSelected(null);
    setMode("new-middle");
  };

  // ===========================
  // 삭제 기능
  // ===========================

  /** 중분류 삭제 */
  const deleteMiddle = async (categoryId) => {
    if (!window.confirm("중분류를 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/admin/categories/${categoryId}`);
      alert("삭제되었습니다.");
      fetchCategories();
    } catch (err) {
      console.error("중분류 삭제 실패:", err);
      alert("삭제 실패!");
    }
  };

  /** 대분류 삭제 (하위 중분류 모두 삭제) */
  const deleteMajor = async (major) => {
    if (!window.confirm(`"${major}" 대분류와 모든 중분류를 삭제하시겠습니까?`)) return;

    const targetList = categories.filter(c => c.majorCategory === major);

    try {
      for (const item of targetList) {
        await api.delete(`/admin/categories/${item.categoryId}`);
      }
      alert("대분류 및 하위 항목이 모두 삭제되었습니다.");
      fetchCategories();
    } catch (err) {
      console.error("대분류 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // ===========================
  // 입력 변경
  // ===========================
  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===========================
  // 저장
  // ===========================
  const handleSubmit = async () => {
    try {
      if (mode === "edit") {
        await api.put(`/admin/categories/${selected}`, form);
      } else {
        await api.post(`/admin/categories`, form);
      }
      alert("저장되었습니다!");
      fetchCategories();
      setMode("none");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("오류가 발생했습니다.");
    }
  };

  // ===========================
  // 대분류 / 중분류 분리
  // ===========================
  const majorList = [...new Set(categories.map((c) => c.majorCategory))];

  const middleList = (major) =>
    categories.filter((c) => c.majorCategory === major && c.middleCategory);

  return (
    <AdminLayout>
      <div className="category-edit-container">

        {/* 왼쪽 리스트 */}
        <div className="category-list-box">
          <h2>카테고리 목록</h2>

          <button className="main-add-btn" onClick={newMajor}>
            + 대분류 추가
          </button>

          {majorList.map((major, index) => (
            <div key={index} className="major-block">
              <div className="major-top">

                <span
                  className="major-title"
                  onClick={() => {
                    const majorItem = categories.find(
                      (c) => c.majorCategory === major && !c.middleCategory
                    );
                    if (majorItem) handleSelect(majorItem.categoryId);
                  }}
                >
                  {major}
                </span>

                <div className="major-btn-set">
                  <button
                    className="middle-add-btn"
                    onClick={() => newMiddle(major)}
                  >
                    + 중분류
                  </button>

                  <button
                    className="del-btn"
                    onClick={() => deleteMajor(major)}
                  >
                    삭제
                  </button>
                </div>
              </div>

              <div className="middle-list">
                {middleList(major).map((mid) => (
                  <div key={mid.categoryId} className="middle-item-row">
                    <span
                      className="middle-item"
                      onClick={() => handleSelect(mid.categoryId)}
                    >
                      {mid.middleCategory}
                    </span>

                    <button
                      className="del-btn small"
                      onClick={() => deleteMiddle(mid.categoryId)}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 오른쪽 폼 */}
        <div className="category-edit-box">
          <h2>
            {mode === "new-major"
              ? "대분류 추가"
              : mode === "new-middle"
              ? "중분류 추가"
              : mode === "edit"
              ? "카테고리 수정"
              : "카테고리 선택"}
          </h2>

          {mode !== "none" && (
            <>
              <label>대분류</label>
              <input
                className="small-input"
                name="majorCategory"
                value={form.majorCategory || ""}
                onChange={handleInput}
                disabled={mode === "new-middle"}
              />

              <label>중분류</label>
              <input
                className="small-input"
                name="middleCategory"
                value={form.middleCategory || ""}
                onChange={handleInput}
              />

              <button className="save-btn" onClick={handleSubmit}>
                저장
              </button>
            </>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
