import api from "./userApi";  // 기존 axios + interceptor 그대로 사용

// ✅ 전체 회원 조회
export const fetchAllUsers = () => api.get("/admin/users");

// ✅ 특정 회원 상세 조회
export const fetchUserDetail = (id) => api.get(`/admin/users/${id}`);

// ✅ 회원 권한 변경 (user ↔ admin)
export const updateUserRole = (id, role) =>
  api.put(`/admin/users/${id}/role`, { role });
