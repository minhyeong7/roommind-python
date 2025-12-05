// src/admin/ProductForm.js
import React, { useState } from "react";
import axios from "axios";
import "./ProductForm.css";

export default function ProductForm() {
  const [form, setForm] = useState({
    category_id: 1,
    product_name: "",
    original_price: 0,
    sale_price: 0,
    stock: 0,
    description: "",
    imageBase64: "",
  });

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setForm({ ...form, imageBase64: reader.result });
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    await axios.post("/api/admin/products", form);
    alert("상품 등록 완료!");
  };

  return (
    <div className="product-form-wrapper">
      <h2>상품 등록</h2>

      <input type="text" placeholder="상품명" onChange={(e) => setForm({ ...form, product_name: e.target.value })} />

      <input type="number" placeholder="원가" onChange={(e) => setForm({ ...form, original_price: e.target.value })} />

      <input type="number" placeholder="판매가" onChange={(e) => setForm({ ...form, sale_price: e.target.value })} />

      <input type="number" placeholder="재고" onChange={(e) => setForm({ ...form, stock: e.target.value })} />

      <textarea placeholder="설명" onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <input type="file" accept="image/*" onChange={handleImage} />

      <button onClick={handleSubmit}>등록하기</button>
    </div>
  );
}
