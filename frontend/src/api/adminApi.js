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

// 상품 등록
export const addProduct = (data) => api.post("/admin/products", data);

// 상품 수정
export const updateProduct = (id, data) =>
  api.put(`/admin/products/${id}`, data);

// 상품 삭제
export const deleteProduct = (id) =>
  api.delete(`/admin/products/${id}`);
