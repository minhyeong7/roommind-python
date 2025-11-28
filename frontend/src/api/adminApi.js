// src/api/adminApi.js
import api from "./userApi";

// ===============================
//  관리자 회원 API
// ===============================

// 전체 회원 조회 (검색 + 필터 + 정렬)
export const fetchAllUsers = (keyword, role, sort) =>
  api.get("/admin/users", {
    params: { keyword, role, sort },
  });

// 회원 상세 조회
export const fetchUserDetail = (id) => api.get(`/admin/users/${id}`);

// 회원 권한 변경
export const updateUserRole = (id, role) =>
  api.put(`/admin/users/${id}/role`, { role });


// ===============================
//  관리자 상품 API
// ===============================

export const fetchProducts = () => api.get("/admin/products");

// 필터 조회
export const filterProducts = (params) =>
  api.get("/admin/products/filter", { params });

// 단일 상품 조회
export const fetchProduct = (id) => api.get(`/admin/products/${id}`);

// 상품 등록 (이미지 + JSON)
export const addProduct = (formData) =>
  api.post("/admin/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });


// 상품 수정
export const updateProduct = (id, data) =>
  api.put(`/admin/products/${id}`, data);

// 상품 삭제
export const deleteProduct = (id) =>
  api.delete(`/admin/products/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  
// 카테고리 전체 조회
export const fetchCategories = () =>
  api.get("/admin/categories");

// 카테고리 등록
export const addCategory = (data) =>
  api.post("/admin/categories", data);

// 카테고리 수정
export const updateCategory = (id, data) =>
  api.put(`/admin/categories/${id}`, data);

// 카테고리 삭제
export const deleteCategory = (id) =>
  api.delete(`/admin/categories/${id}`);
