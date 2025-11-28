import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { addProduct } from "../../api/adminApi";
import CategoryModal from "./CategoryModal";
import api from "../../api/userApi";
import "./ProductNew.css";

export default function ProductNew() {
  const [form, setForm] = useState({
    productName: "",
    categoryId: "",
    originalPrice: "",
    salePrice: "",
    stock: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [major, setMajor] = useState("");
  const [middleList, setMiddleList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // 🔥 카테고리 불러오기
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/admin/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("카테고리 불러오기 실패:", err);
      }
    };
    loadCategories();
  }, []);

  // 🔥 대분류 리스트 (camelCase!)
  const majorList = [...new Set(categories.map((c) => c.majorCategory))];

  // 🔥 중분류 필터링
  useEffect(() => {
    if (major) {
      setMiddleList(categories.filter((c) => c.majorCategory === major));
    } else {
      setMiddleList([]);
    }
  }, [major, categories]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // 🔥 상품 등록
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.categoryId) return alert("카테고리를 선택해주세요!");
    if (!image) return alert("이미지를 선택해주세요!");

    const formData = new FormData();

    const formDataObj = {
      ...form,
      categoryId: Number(form.categoryId),
    };

    const productJson = new Blob([JSON.stringify(formDataObj)], {
      type: "application/json",
    });

    formData.append("product", productJson);
    formData.append("file", image);

    try {
      await addProduct(formData);
      alert("상품이 등록되었습니다!");
      window.location.href = "/admin/products";
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
              onChange={(e) => {
                setMajor(e.target.value);
                setForm({ ...form, categoryId: "" });
              }}
            >
              <option value="">대분류 선택</option>
              {majorList.map((m, idx) => (
                <option key={idx} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <label>중분류</label>
            <div className="category-row">
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                required
                disabled={!major}
              >
                <option value="">중분류 선택</option>

                {middleList.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.middleCategory}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="category-add-btn"
                onClick={() => setShowModal(true)}
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

      {showModal && (
        <CategoryModal
          categories={categories}
          setCategories={setCategories}
          onClose={() => setShowModal(false)}
          currentCategoryId={form.categoryId}
          clearSelectedCategory={() =>
            setForm({ ...form, categoryId: "" })
          }
        />
      )}
    </AdminLayout>
  );
}
