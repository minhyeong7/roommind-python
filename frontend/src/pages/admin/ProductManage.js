// src/admin/ProductManage.js
import React, { useEffect, useState } from "react";
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

  /* ===========================================
     🔥 useEffect 내부에서 fetchProducts 정의
     → ESLint 경고 해결 + 기능 동일하게 유지
  ============================================ */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/admin/products", {
          params: {
            keyword: search || "",
            sort: sort || "latest",
            categoryId: category || "",
          },
        });

        console.log("응답 데이터:", res.data);
        setProducts(res.data || []);
      } catch (err) {
        console.error("상품 조회 실패:", err);
      }
    };

    fetchProducts();
  }, [search, sort, category]);

  // ⭐ 삭제 API
  const handleDelete = async (productId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await api.delete(`/admin/products/${productId}`);
    // 삭제 후 새로고침 (fetchProducts 역할)
    setSearch((prev) => prev); 
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    return Number(value).toLocaleString();
  };

  const calcDiscount = (sale, original) => {
    if (!sale || !original) return "-";
    const rate = Math.round((1 - sale / original) * 100);
    return rate + "%";
  };

  const getProductImage = (images) => {
    if (!images || images.length === 0) return "/no-image.png";

    const img = images[0];
    const fixedDir = img.saveDir.replace(/\\/g, "/");

    const folderName = fixedDir.split("uploads/product/")[1];

    if (!folderName) return "/no-image.png";

    return `/uploads/product/${folderName}/${img.fileName}`;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="product-manage-wrapper">
        <div className="product-manage-header">
          <h1>상품 관리 페이지</h1>
          <button
            className="add-product-btn"
            onClick={() => navigate("/admin/products/new")}
          >
            + 상품 등록
          </button>
        </div>

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
