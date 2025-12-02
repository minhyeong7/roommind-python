// src/admin/ProductManage.js

import React, { useEffect, useState, useCallback } from "react";
import "./ProductManage.css";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";
import api from "../../api/userApi";

export default function ProductManage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  // 검색/필터
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  // 카테고리 필터
  const [categories, setCategories] = useState([]);
  const [majorList, setMajorList] = useState([]);
  const [middleList, setMiddleList] = useState([]);

  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedMiddle, setSelectedMiddle] = useState("");

  // 전체 선택 기능
  const [checkedItems, setCheckedItems] = useState([]);

  /* ==========================================
     카테고리 불러오기
  ========================================== */
  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategories(res.data);

      const majors = [...new Set(res.data.map((c) => c.majorCategory))];
      setMajorList(majors);
    } catch (err) {
      console.error("카테고리 조회 실패:", err);
    }
  };

  /* ==========================================
     상품 불러오기
  ========================================== */
  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get("/admin/products", {
        params: {
          keyword: search,
          sort,
          major: selectedMajor,
          middle: selectedMiddle,
        },
      });

      setProducts(res.data || []);
    } catch (err) {
      console.error("상품 조회 실패:", err);
    }
  }, [search, sort, selectedMajor, selectedMiddle]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ==========================================
     대분류 선택 → 중분류 자동 세팅
  ========================================== */
  useEffect(() => {
    if (!selectedMajor) {
      setMiddleList([]);
      setSelectedMiddle("");
      return;
    }

    const mids = categories.filter(
      (c) => c.majorCategory === selectedMajor && c.middleCategory
    );

    setMiddleList(mids);
    setSelectedMiddle(""); // 초기화
  }, [selectedMajor, categories]);

  /* ==========================================
     삭제 (단건)
  ========================================== */
  const handleDelete = async (productId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/admin/products/${productId}`);
      fetchProducts();
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  /* ==========================================
     전체 선택 체크박스
  ========================================== */
  const handleSelectAll = (checked) => {
    if (checked) {
      setCheckedItems(products.map((p) => p.productId));
    } else {
      setCheckedItems([]);
    }
  };

  const handleCheckItem = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  };

  /* ==========================================
     선택된 상품 일괄 삭제
  ========================================== */
  const handleDeleteSelected = async () => {
    if (checkedItems.length === 0) {
      alert("삭제할 상품을 선택해주세요.");
      return;
    }

    if (!window.confirm(`선택한 ${checkedItems.length}개 상품을 삭제하시겠습니까?`))
      return;

    try {
      for (const id of checkedItems) {
        await api.delete(`/admin/products/${id}`);
      }

      alert("삭제 완료!");
      setCheckedItems([]);
      fetchProducts();
    } catch (err) {
      console.error("일괄 삭제 실패:", err);
    }
  };

  /* ==========================================
     숫자 포맷
  ========================================== */
  const formatNumber = (v) => (v ? Number(v).toLocaleString() : "-");

  const calcDiscount = (sale, original) => {
    if (!sale || !original) return "-";
    return Math.round((1 - sale / original) * 100) + "%";
  };

  const getProductImage = (images) => {
    if (!images || images.length === 0) return "/no-image.png";
    const img = images[0];
    const fixedDir = img.saveDir.replace(/\\/g, "/");
    const folder = fixedDir.split("uploads/product/")[1];
    return `/uploads/product/${folder}/${img.fileName}`;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="product-manage-wrapper">
        {/* ================= 헤더 ================= */}
        <div className="product-manage-header">
          <h1>상품 관리</h1>

          <div className="header-btn-group">
            <button className="category-manage-btn" onClick={() => navigate("/admin/categories")}>
              카테고리 관리
            </button>

            <button className="add-product-btn" onClick={() => navigate("/admin/products/new")}>
              + 상품 등록
            </button>
          </div>
        </div>

        {/* ================= 필터 ================= */}
        <div className="product-filter-box">
          <input
            type="text"
            placeholder="상품명 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="high-price">가격 높은순</option>
            <option value="low-price">가격 낮은순</option>
          </select>

          {/* 대분류 */}
          <select
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
          >
            <option value="">전체 대분류</option>
            {majorList.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* 중분류 */}
          <select
            value={selectedMiddle}
            onChange={(e) => setSelectedMiddle(e.target.value)}
            disabled={!selectedMajor}
          >
            <option value="">전체 중분류</option>
            {middleList.map((m) => (
              <option key={m.categoryId} value={m.middleCategory}>
                {m.middleCategory}
              </option>
            ))}
          </select>

          {/* 선택삭제 */}
          <button className="delete-selected-btn" onClick={handleDeleteSelected}>
            선택 삭제
          </button>
        </div>

        {/* ================= 테이블 ================= */}
        <table className="product-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={checkedItems.length === products.length && products.length > 0}
                />
              </th>
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
                <td colSpan="8" className="empty-row">
                  등록된 상품이 없습니다.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.productId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(p.productId)}
                      onChange={() => handleCheckItem(p.productId)}
                    />
                  </td>

                  <td>
                    <img src={getProductImage(p.images)} alt="" className="product-img" />
                  </td>

                  <td
                    className="product-name-link"
                    onClick={() => navigate(`/admin/product/${p.productId}`)}
                  >
                    {p.productName}
                  </td>

                  <td>{formatNumber(p.salePrice)}원</td>

                  <td>{calcDiscount(p.salePrice, p.originalPrice)}</td>

                  <td>{formatNumber(p.stock)}</td>

                  <td>{p.createdDate?.slice(0, 10)}</td>

                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(p.productId)}>
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
