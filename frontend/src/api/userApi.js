// src/api/userApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ===========================================
// 🔥 JWT 내부 payload exp 읽기 (패키지 없이)
// ===========================================
const getJwtExp = (token) => {
  try {
    const payloadBase64 = token.split(".")[1];
    const json = JSON.parse(atob(payloadBase64)); // header.payload.signature
    return json.exp * 1000; // exp는 초 단위 → ms 변환
  } catch (e) {
    console.error("JWT decode 실패:", e);
    return null;
  }
};

// ===========================================
// 🔥 자동 로그아웃 타이머
// ===========================================
let logoutTimer = null;

const scheduleAutoLogout = (token) => {
  const expTime = getJwtExp(token);
  if (!expTime) return;

  const remaining = expTime - Date.now();

  if (remaining <= 0) {
    logoutUser();
    return;
  }

  console.log(
    `⏳ JWT 만료까지 남은 시간: ${Math.floor(remaining / 1000)}초`
  );

  if (logoutTimer) clearTimeout(logoutTimer);

  logoutTimer = setTimeout(() => {
    logoutUser();
  }, remaining);
};

// ===========================================
// 🔥 로그아웃 기능
// ===========================================
export const logoutUser = () => {
  localStorage.removeItem("token");

  if (logoutTimer) clearTimeout(logoutTimer);

  console.log("⛔ JWT 만료 → 자동 로그아웃 됨");
  window.location.href = "/login";
};

// ===========================================
// 🔥 회원가입
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
      localStorage.setItem("token", token);

      // ⭐ exp 기반 자동 로그아웃 설정
      scheduleAutoLogout(token);

      console.log("💡 JWT 로그인 성공 (exp 기반 체크 시작)");
    }

    return response.data;
  } catch (err) {
    console.error("❌ 로그인 오류:", err);
    throw err;
  }
};

// ===========================================
// 🔥 페이지 새로고침 시에도 exp 기반 로그아웃 유지
// ===========================================
(() => {
  const token = localStorage.getItem("token");
  if (token) {
    scheduleAutoLogout(token);
  }
})();

// ===========================================
// 🔥 Axios 요청 인터셉터 — JWT 자동 첨부
// ===========================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
