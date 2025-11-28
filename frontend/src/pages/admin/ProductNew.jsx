import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { addProduct } from "../../api/adminApi";
import CategoryModal from "./CategoryModal";   // ⭐ 모달 import
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

  // ⭐ 카테고리 관리
  const [categories, setCategories] = useState([
    { id: 1, name: "침대" },
    { id: 2, name: "소파" },
    { id: 3, name: "책상" },
    { id: 4, name: "조명" },
  ]);

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("이미지를 선택해주세요!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

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
            
            {/* 상품명 */}
            <label>상품명</label>
            <input
              type="text"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              required
            />

            {/* 카테고리 */}
            <label>카테고리</label>
            <div className="category-row">
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">카테고리 선택</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
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

            {/* 원가 */}
            <label>원가</label>
            <input
              type="number"
              name="originalPrice"
              value={form.originalPrice}
              onChange={handleChange}
              required
            />

            {/* 판매가 */}
            <label>판매가</label>
            <input
              type="number"
              name="salePrice"
              value={form.salePrice}
              onChange={handleChange}
              required
            />

            {/* 재고 */}
            <label>재고</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
            />

            {/* 설명 */}
            <label>설명</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />

            {/* 이미지 업로드 */}
            <label>대표 이미지</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />

            <button type="submit" className="submit-btn">
              상품 등록하기
            </button>
          </form>
        </div>
      </div>

      {/* ⭐ 카테고리 관리 모달 */}
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
