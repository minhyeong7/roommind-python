// src/admin/ProductNew.js
import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { addProduct } from "../../api/adminApi";
import api from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import "./ProductNew.css";

/** 숫자 제한 상수 */
const MAX_PRICE = 100000000; // 1억
const MAX_STOCK = 10000;

export default function ProductNew() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    categoryId: null,
    originalPrice: "",
    salePrice: "",
    stock: "",
    description: "",
    brand: "",
  });

  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [major, setMajor] = useState("");
  const [middleList, setMiddleList] = useState([]);

  /** 카테고리 불러오기 */
  useEffect(() => {
    api.get("/admin/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("카테고리 불러오기 실패:", err));
  }, []);

  /** 대분류 리스트 */
  const majorList = [...new Set(categories.map((c) => c.majorCategory))];

  /** 중분류 리스트 */
  useEffect(() => {
    if (major) {
      setMiddleList(categories.filter((c) => c.majorCategory === major));
      setForm((prev) => ({ ...prev, categoryId: null }));
    } else {
      setMiddleList([]);
    }
  }, [major, categories]);

  /** 입력 변경 (숫자 검증 포함) */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 숫자 필드 검증
    if (["originalPrice", "salePrice"].includes(name)) {
      if (value === "") {
        setForm({ ...form, [name]: "" });
        return;
      }

      const num = Number(value);
      if (!Number.isSafeInteger(num)) return;
      if (num < 0 || num > MAX_PRICE) return;

      setForm({ ...form, [name]: num });
      return;
    }

    if (name === "stock") {
      if (value === "") {
        setForm({ ...form, stock: "" });
        return;
      }

      const num = Number(value);
      if (!Number.isInteger(num)) return;
      if (num < 0 || num > MAX_STOCK) return;

      setForm({ ...form, stock: num });
      return;
    }

    setForm({ ...form, [name]: value });
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

    if (form.salePrice > form.originalPrice) {
      return alert("판매가는 원가보다 클 수 없습니다.");
    }

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

            <label>브랜드</label>
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              required
            />

            <label>대분류</label>
            <select value={major} onChange={(e) => setMajor(e.target.value)} required>
              <option value="">대분류 선택</option>
              {majorList.map((m, idx) => (
                <option key={idx} value={m}>{m}</option>
              ))}
            </select>

            <label>중분류</label>
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

            <label>원가</label>
            <input
              type="number"
              name="originalPrice"
              min="0"
              max={MAX_PRICE}
              step="1"
              value={form.originalPrice}
              onChange={handleChange}
              required
            />

            <label>판매가</label>
            <input
              type="number"
              name="salePrice"
              min="0"
              max={MAX_PRICE}
              step="1"
              value={form.salePrice}
              onChange={handleChange}
              required
            />

            <label>재고</label>
            <input
              type="number"
              name="stock"
              min="0"
              max={MAX_STOCK}
              step="1"
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
