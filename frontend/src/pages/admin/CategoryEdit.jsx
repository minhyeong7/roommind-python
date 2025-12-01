import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import api from "../../api/userApi";

export default function CategoryEdit() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const isNew = id === "new";

  const [form, setForm] = useState({
    majorCategory: "",
    middleCategory: ""
  });

  useEffect(() => {
    if (!isNew) {
      fetchDetail();
    }
  }, []);

  const fetchDetail = async () => {
    const res = await api.get(`/admin/categories/${id}`);
    setForm(res.data);
  };

  const handleSubmit = async () => {
    if (isNew) {
      await api.post("/admin/categories", form);
    } else {
      await api.put(`/admin/categories/${id}`, form);
    }

    alert("저장되었습니다!");
    navigate("/admin/categories");
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <AdminLayout>
      <div className="category-edit-container">
        <h1>{isNew ? "카테고리 추가" : "카테고리 수정"}</h1>

        <label>대분류</label>
        <input
          name="majorCategory"
          value={form.majorCategory}
          onChange={handleInput}
        />

        <label>중분류</label>
        <input
          name="middleCategory"
          value={form.middleCategory}
          onChange={handleInput}
        />

        <button className="save-btn" onClick={handleSubmit}>
          저장
        </button>
        <button
          className="cancel-btn"
          onClick={() => navigate("/admin/categories")}
        >
          취소
        </button>
      </div>
    </AdminLayout>
  );
}
