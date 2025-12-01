// src/admin/ProductManage.js
import React, { useEffect, useState, useCallback } from "react";
import "./ProductManage.css";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";
import api from "../../api/userApi";

export default function ProductManage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [category, setCategory] = useState("");

  /* ======================================================
     fetchProducts — 외부로 분리하여 삭제 후 즉시 호출 가능
  ====================================================== */
  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get("/admin/products", {
        params: {
          keyword: search || "",
          sort: sort || "latest",
          categoryId: category || "",
        },
      });

      setProducts(res.data || []);
    } catch (err) {
      console.error("상품 조회 실패:", err);
    }
  }, [search, sort, category]);

  /* ======================================================
     검색/정렬/카테고리 변경 시 상품 목록 새로 로드
  ====================================================== */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ======================================================
     삭제 API (삭제 후 즉시 fetchProducts 호출)
  ====================================================== */
  const handleDelete = async (productId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/admin/products/${productId}`);
      await fetchProducts(); // 🔥 삭제 즉시 목록 갱신
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  /* 숫자 포맷 */
  const formatNumber = (value) => {
    if (!value) return "-";
    return Number(value).toLocaleString();
  };

  /* 할인율 계산 */
  const calcDiscount = (sale, original) => {
    if (!sale || !original) return "-";
    return Math.round((1 - sale / original) * 100) + "%";
  };

  /* 이미지 경로 */
  const getProductImage = (images) => {
    if (!images || images.length === 0) return "/no-image.png";

    const img = images[0];
    const fixedDir = img.saveDir.replace(/\\/g, "/");
    const folder = fixedDir.split("uploads/product/")[1];

    if (!folder) return "/no-image.png";
    return `/uploads/product/${folder}/${img.fileName}`;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="product-manage-wrapper">
        {/* ---------------- 헤더 영역 ---------------- */}
        <div className="product-manage-header">
          <h1>상품 관리 페이지</h1>

          {/* 버튼 그룹 */}
          <div className="header-btn-group">
            <button
              className="category-manage-btn"
              onClick={() => navigate("/admin/categories")}
            >
              카테고리 관리
            </button>

            <button
              className="add-product-btn"
              onClick={() => navigate("/admin/products/new")}
            >
              + 상품 등록
            </button>
          </div>
        </div>

        {/* ---------------- 필터 영역 ---------------- */}
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

        {/* ---------------- 테이블 영역 ---------------- */}
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
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                  등록된 상품이 없습니다.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.productId}>
                  <td>
                    <img
                      src={getProductImage(p.images)}
                      alt=""
                      className="product-img"
                    />
                  </td>

                  <td
                    className="product-name-link"
                    onClick={() => navigate(`/admin/product/${p.productId}`)}
                  >
                    {p.productName || "-"}
                  </td>

                  <td>{formatNumber(p.salePrice)}원</td>
                  <td>{calcDiscount(p.salePrice, p.originalPrice)}</td>
                  <td>{formatNumber(p.stock)}</td>
                  <td>{p.createdDate?.slice(0, 10) || "-"}</td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(p.productId)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
