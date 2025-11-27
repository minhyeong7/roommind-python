// src/admin/ProductManage.js
import React, { useEffect, useState } from "react";
import "./ProductManage.css";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductManage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [category, setCategory] = useState("");

  // 상품 불러오기
  const fetchProducts = async () => {
    const res = await axios.get("/api/admin/products", {
      params: { 
        search: search || "",
        sort: sort || "latest",
        category: category || ""   // undefined 방지!
      },
    });
    setProducts(res.data);
  };


  useEffect(() => {
    fetchProducts();
  }, [search, sort, category]);

  // 삭제
  const handleDelete = async (productId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    await axios.delete(`/api/admin/products/${productId}`);
    fetchProducts();
  };

  return (
    <div className="admin-layout">

      {/* 🔥 왼쪽 사이드바 */}
      <AdminSidebar />

      {/* 🔥 오른쪽 콘텐츠 */}
      <div className="product-manage-wrapper">

        <div className="product-manage-header">
          <h2>상품 관리 페이지</h2>

          <button
            className="add-product-btn"
            onClick={() => navigate("/admin/product/new")}
          >
            + 상품 등록
          </button>
        </div>

        {/* 검색 + 정렬 */}
        <div className="product-filter-box">
          <input
            type="text"
            placeholder="상품명 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setSort(e.target.value)}>
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="high-price">가격 높은순</option>
            <option value="low-price">가격 낮은순</option>
          </select>

          <select onChange={(e) => setCategory(e.target.value)}>
            <option value="">전체 카테고리</option>
            <option value="1">가구</option>
            <option value="2">조명</option>
            <option value="3">패브릭</option>
          </select>
        </div>

        {/* 상품 테이블 */}
        <table className="product-table">
          <thead>
            <tr>
              <th>사진</th>
              <th>상품명</th>
              <th>가격</th>
              <th>할인률</th>
              <th>재고</th>
              <th>등록일</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.product_id}>
                <td>
                  <img src={p.thumbnail} alt="" className="product-img" />
                </td>

                <td
                  className="product-name-link"
                  onClick={() =>
                    navigate(`/admin/product/${p.product_id}`)
                  }
                >
                  {p.product_name}
                </td>

                <td>{p.sale_price.toLocaleString()}원</td>
                <td>{Math.round((1 - p.sale_price / p.original_price) * 100)}%</td>
                <td>{p.stock}</td>
                <td>{p.created_date.slice(0, 10)}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(p.product_id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
