import api from "./header.js";

// 카테고리 전체 조회
export const fetchCategories = () =>
  api.get("/categories");


// 카테고리 단일 조회
export const fetchCategory = (id) => api.get(`/categories/${id}`);