// src/admin/ProductNew.js
import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { addProduct } from "../../api/adminApi";
import api from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import "./ProductNew.css";

export default function ProductNew() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    categoryId: null, 
    originalPrice: "",
    salePrice: "",
    stock: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [major, setMajor] = useState("");
  const [middleList, setMiddleList] = useState([]);

  /** 카테고리 불러오기 */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/admin/categories");
        setCategories(res.data);
        console.log("카테고리 데이터:", res.data);
      } catch (err) {
        console.error("카테고리 불러오기 실패:", err);
      }
    };
    loadCategories();
  }, []);

  /**  대분류 리스트 */
  const majorList = [...new Set(categories.map((c) => c.majorCategory))];

  /** 중분류 리스트 자동 필터링 */
  useEffect(() => {
    if (major) {
      setMiddleList(categories.filter((c) => c.majorCategory === major));
      setForm((prev) => ({ ...prev, categoryId: null }));
    } else {
      setMiddleList([]);
    }
  }, [major, categories]);

  /** 입력 변경 */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** 파일 선택 */
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  /** 상품 등록 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.categoryId) return alert("카테고리를 선택해주세요!");
    if (!image) return alert("이미지를 선택해주세요!");

    const formData = new FormData();

    const productJson = new Blob([JSON.stringify(form)], {
      type: "application/json",
    });

    formData.append("product", productJson);
    formData.append("file", image);

    try {
      await addProduct(formData);
      alert("상품이 등록되었습니다!");
      navigate("/admin/products");
    } catch (error) {
      console.error("상품 등록 실패:", error);
      alert("등록 실패!");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-content-container">
        <div className="product-add-container">
          <h1>상품 등록</h1>

          <form className="product-add-form" onSubmit={handleSubmit}>
            
            <label>상품명</label>
            <input
              type="text"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              required
            />

            <label>대분류</label>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              required
            >
              <option value="">대분류 선택</option>
              {majorList.map((m, idx) => (
                <option key={idx} value={m}>{m}</option>
              ))}
            </select>

            <label>중분류</label>
            <div className="category-row">
              <select
                value={form.categoryId || ""}
                onChange={(e) =>
                  setForm({ ...form, categoryId: Number(e.target.value) })
                }
                disabled={!major}
                required
              >
                <option value="">중분류 선택</option>

                {middleList.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.middleCategory}
                  </option>
                ))}
              </select>

              {/* 관리 버튼 → 카테고리 관리 페이지로 이동 */}
              <button
                type="button"
                className="category-add-btn"
                onClick={() => navigate("/admin/categories")}
              >
                관리
              </button>
            </div>

            <label>원가</label>
            <input
              type="number"
              name="originalPrice"
              value={form.originalPrice}
              onChange={handleChange}
              required
            />

            <label>판매가</label>
            <input
              type="number"
              name="salePrice"
              value={form.salePrice}
              onChange={handleChange}
              required
            />

            <label>재고</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
            />

            <label>설명</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />

            <label>대표 이미지</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />

            <button type="submit" className="submit-btn">
              상품 등록하기
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
