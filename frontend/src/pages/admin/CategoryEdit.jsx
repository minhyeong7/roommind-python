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
    middleCategory: "",
    sortOrder: 0
  });

  /* =======================================================
      ⭐ 드래그 상태 관리
  ======================================================= */
  const [draggingId, setDraggingId] = useState(null);

  const handleDragStart = (id) => setDraggingId(id);

  /* =======================================================
      ⭐ 드래그 이동 (UI 순서 변경)
  ======================================================= */
  const handleDragEnter = (targetId) => {
    if (draggingId === targetId) return;

    setCategories((prev) => {
      const list = [...prev];
      const from = list.findIndex((c) => c.categoryId === draggingId);
      const to = list.findIndex((c) => c.categoryId === targetId);

      if (from === -1 || to === -1) return prev;
      if (list[from].majorCategory !== list[to].majorCategory) return prev;

      const temp = list[from];
      list[from] = list[to];
      list[to] = temp;

      return list;
    });
  };

  /* =======================================================
      ⭐ 드래그 종료 → 서버에 sortOrder 저장
  ======================================================= */
  const handleDragEnd = async () => {
    if (!draggingId) return;

    const dragged = categories.find((c) => c.categoryId === draggingId);
    if (!dragged) return;

    const major = dragged.majorCategory;

    const subList = categories
      .filter((c) => c.majorCategory === major && c.middleCategory)
      .sort(
        (a, b) =>
          categories.findIndex((x) => x.categoryId === a.categoryId) -
          categories.findIndex((x) => x.categoryId === b.categoryId)
      );

    const reorderPayload = subList.map((c, idx) => ({
      categoryId: c.categoryId,
      sortOrder: idx + 1,
    }));

    try {
      await api.post("/admin/categories/reorder", reorderPayload);
      console.log("정렬 저장:", reorderPayload);
      fetchCategories();
    } catch (err) {
      console.error("정렬 저장 실패:", err);
    }

    setDraggingId(null);
  };

  /* =======================================================
      목록 로딩
  ======================================================= */
  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("카테고리 목록 실패:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* =======================================================
      단일 조회
  ======================================================= */
  const handleSelect = async (categoryId) => {
    try {
      const res = await api.get(`/admin/categories/${categoryId}`);
      setForm(res.data);
      setSelected(categoryId);
      setMode("edit");
    } catch (err) {
      console.error("조회 실패:", err);
    }
  };

  /* =======================================================
      추가 기능
  ======================================================= */
  const newMajor = () => {
    setForm({
      categoryId: null,
      majorCategory: "",
      middleCategory: null,
      sortOrder: 0
    });
    setMode("new-major");
    setSelected(null);
  };

  const newMiddle = (major) => {
    setForm({
      categoryId: null,
      majorCategory: major,
      middleCategory: "",
      sortOrder: 0
    });
    setMode("new-middle");
    setSelected(null);
  };

  /* =======================================================
      삭제 기능
  ======================================================= */
  const deleteMiddle = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;

    try {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("중분류 삭제 실패:", err);
    }
  };

  const deleteMajor = async (major) => {
    if (!window.confirm(`${major} 대분류 전체 삭제?`)) return;

    const targets = categories.filter((c) => c.majorCategory === major);

    try {
      for (const c of targets) {
        await api.delete(`/admin/categories/${c.categoryId}`);
      }
      fetchCategories();
    } catch (err) {
      console.error("대분류 삭제 실패:", err);
    }
  };

  /* =======================================================
      저장 기능
  ======================================================= */
  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        sortOrder: form.sortOrder ?? 0
      };

      if (mode === "edit") {
        await api.put(`/admin/categories/${selected}`, payload);
      } else {
        await api.post(`/admin/categories`, payload);
      }

      alert("저장 완료!");
      fetchCategories();
      setMode("none");
    } catch (err) {
      console.error("저장 실패:", err);
    }
  };

  /* =======================================================
      렌더링
  ======================================================= */
  const majorList = [...new Set(categories.map((c) => c.majorCategory))];

  const middleList = (major) =>
    categories.filter(
      (c) => c.majorCategory === major && c.middleCategory !== null
    );

  return (
    <AdminLayout>
      <div className="category-edit-container">
        <div className="category-list-box">
          <h2>카테고리 목록</h2>

          <button className="main-add-btn" onClick={newMajor}>
            + 대분류 추가
          </button>

          {majorList.map((major, i) => (
            <div key={i} className="major-block">
              <div className="major-top">
                <span
                  className="major-title"
                  onClick={() => {
                    const majorItem = categories.find(
                      (c) =>
                        c.majorCategory === major && c.middleCategory === null
                    );
                    if (majorItem) handleSelect(majorItem.categoryId);
                  }}
                >
                  {major}
                </span>

                <div className="major-btn-set">
                  <button className="middle-add-btn" onClick={() => newMiddle(major)}>
                    + 중분류
                  </button>
                  <button className="del-btn" onClick={() => deleteMajor(major)}>
                    삭제
                  </button>
                </div>
              </div>

              <div className="middle-list">
                {middleList(major).map((mid) => (
                  <div
                    key={mid.categoryId}
                    className="middle-item-row"
                    draggable
                    onDragStart={() => handleDragStart(mid.categoryId)}
                    onDragEnter={() => handleDragEnter(mid.categoryId)}
                    onDragEnd={handleDragEnd}
                    style={{
                      opacity: draggingId === mid.categoryId ? 0.3 : 1,
                      transition: "0.2s",
                    }}
                  >
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
