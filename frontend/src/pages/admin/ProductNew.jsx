import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { addProduct } from "../../api/adminApi";
import CategoryModal from "./CategoryModal";
import "./ProductNew.css";

export default function ProductNew() {
  // ✔ form
  const [form, setForm] = useState({
    productName: "",
    categoryId: "", // 최종 선택된 중분류 category_id
    originalPrice: "",
    salePrice: "",
    stock: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  // ✔ DB 형태의 카테고리 데이터
  const [categories, setCategories] = useState([
    { category_id: 1, major_category: "가구", middle_category: "침대" },
    { category_id: 2, major_category: "가구", middle_category: "소파" },
    { category_id: 3, major_category: "가구", middle_category: "책상" },
    { category_id: 4, major_category: "디지털", middle_category: "TV" },
    { category_id: 5, major_category: "디지털", middle_category: "냉장고" },
  ]);

  // ✔ 대분류 / 중분류 상태관리
  const [major, setMajor] = useState("");
  const [middleList, setMiddleList] = useState([]);

  const [showModal, setShowModal] = useState(false);

  // 🔥 대분류 목록(중복 제거)
  const majorList = [...new Set(categories.map((c) => c.major_category))];

  // 🔥 major 선택되면 해당 major에 맞는 middle 목록만 필터링
  useEffect(() => {
    if (major) {
      const filtered = categories.filter(
        (c) => c.major_category === major
      );
      setMiddleList(filtered);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return alert("대표 이미지를 넣어주세요!");
    if (!form.categoryId) return alert("카테고리를 선택해주세요!");

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

            {/* 🔥 대분류 선택 */}
            <label>대분류</label>
            <select
              value={major}
              onChange={(e) => {
                setMajor(e.target.value);
                setForm({ ...form, categoryId: "" }); // 중분류 초기화
              }}
            >
              <option value="">대분류 선택</option>
              {majorList.map((m, idx) => (
                <option key={idx} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* 🔥 중분류 선택 */}
            <label>중분류</label>
            <div className="category-row">
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                disabled={!major}
                required
              >
                <option value="">중분류 선택</option>
                {middleList.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.middle_category}
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

            {/* 이미지 */}
            <label>대표 이미지</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />

            <button type="submit" className="submit-btn">
              상품 등록하기
            </button>
          </form>
        </div>
      </div>

      {/* 카테고리 관리 모달 */}
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
