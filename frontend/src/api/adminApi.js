import api from "./userApi";  // 기존 api 그대로 재사용

// 전체 회원 조회
export const fetchAllUsers = () => api.get("/api/admin/users");

// 특정 회원 상세조회
export const fetchUserDetail = (id) => api.get(`/api/admin/users/${id}`);

// 권한 변경
export const updateUserRole = (id, role) =>
  api.put(`/api/admin/users/${id}/role`, { role });
