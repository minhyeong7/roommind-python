import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../api/userApi";
import { useNavigate } from "react-router-dom";

export default function AdminCategoryList() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    const res = await api.get("/admin/categories");
    setList(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const deleteCategory = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    await api.delete(`/admin/categories/${id}`);
    load();
  };

  return (
    <AdminLayout>
      <div className="category-container">
        <h1>카테고리 관리</h1>

        <button
          className="add-btn"
          onClick={() => navigate("/admin/categories/new")}
        >
          + 카테고리 추가
        </button>

        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>대분류</th>
              <th>중분류</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.categoryId}>
                <td>{c.categoryId}</td>
                <td>{c.majorCategory}</td>
                <td>{c.middleCategory}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(`/admin/categories/${c.categoryId}/edit`)
                    }
                  >
                    수정
                  </button>
                  <button
                    className="del-btn"
                    onClick={() => deleteCategory(c.categoryId)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
