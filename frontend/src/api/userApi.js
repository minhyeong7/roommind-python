// src/api/userApi.js
import axios from "axios";

// 🔧 Axios 기본 설정
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ===========================================
// 🔥 자동 로그아웃 타이머 설정 (JWT 만료 1시간)
// ===========================================
let logoutTimer = null;

const scheduleAutoLogout = () => {
  const logoutAt = localStorage.getItem("logoutAt");

  if (!logoutAt) return;

  const remaining = logoutAt - Date.now();

  if (remaining <= 0) {
    logoutUser();
    return;
  }

  // 기존 타이머 제거
  if (logoutTimer) clearTimeout(logoutTimer);

  // 1시간 뒤 자동 로그아웃 실행
  logoutTimer = setTimeout(() => {
    logoutUser();
  }, remaining);
};

// ===========================================
// 🔥 로그아웃 기능
// ===========================================
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("logoutAt");
  if (logoutTimer) clearTimeout(logoutTimer);

  console.log("⛔ 자동 로그아웃됨 (1시간 만료)");
  window.location.href = "/login";
};

// ===========================================
// 🔥 회원가입 API
// ===========================================
export const registerUser = async (userData) => {
  const response = await api.post("/users/signup", userData);
  return response.data;
};

// ===========================================
// 🔥 로그인 API
// ===========================================
export const loginUser = async (loginData) => {
  try {
    const response = await api.post("/users/login", loginData);
    const token = response.data?.data?.token;

    if (token) {
      // 🔥 JWT 저장
      localStorage.setItem("token", token);

      // 🔥 1시간 뒤 자동 로그아웃 시간 기록
      localStorage.setItem("logoutAt", Date.now() + 3600000);

      // 🔥 타이머 즉시 실행
      scheduleAutoLogout();

      console.log("💡 로그인: 1시간 뒤 자동 로그아웃 예약 완료");
    }

    return response.data;
  } catch (err) {
    console.error("❌ 로그인 실패:", err);
    throw err;
  }
};

// ===========================================
// 🔥 새로고침 시에도 자동 로그아웃 유지
// ===========================================
scheduleAutoLogout();

// ===========================================
// 🔥 Axios 요청 인터셉터 — JWT 자동 첨부
// ===========================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
