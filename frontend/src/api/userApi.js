// src/api/userApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===========================================
   🔥 JWT exp 검증 함수 (클라이언트에서 직접 체크)
=========================================== */
const isTokenExpired = (token) => {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = JSON.parse(atob(payloadBase64));
    const expSec = payloadJson.exp; // exp: 초 단위
    if (!expSec) {
      // exp 없으면 만료로 간주하거나 true/false 선택 가능
      return true;
    }
    const expTime = expSec * 1000;
    return Date.now() > expTime;
  } catch (e) {
    console.error("JWT decode 실패:", e);
    // 파싱 실패하면 안전하게 만료로 취급
    return true;
  }
};

/* ===========================================
   🔥 로그아웃 공통 함수
=========================================== */
export const logoutUser = (redirect = true) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  console.log("🚪 로그아웃 처리됨");

  if (redirect && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};


/* ===========================================
   🔥 Axios 요청 인터셉터 — 요청 전에 exp 직접 체크
=========================================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // 요청 보내기 전에 만료 여부 검사
      if (isTokenExpired(token)) {
        console.log("⛔ 토큰 만료 → 요청 차단 + 자동 로그아웃");
        logoutUser();
        return Promise.reject("TOKEN_EXPIRED");
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===========================================
   🔥 Axios 응답 인터셉터 — 401/403 오면 자동 로그아웃
=========================================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      console.log("🔐 서버 인증 오류 (", status, ") → 자동 로그아웃");
      logoutUser();
    }

    return Promise.reject(error);
  }
);

/* ===========================================
   🔥 회원가입
=========================================== */
export const registerUser = async (userData) => {
  const res = await api.post("/users/signup", userData);
  return res.data;
};

/* ===========================================
   🔥 일반 로그인
   - 백엔드에서 내려준 JWT 저장만 함
   - 소셜 로그인은 /login-success 페이지 등에서
     쿼리스트링으로 받은 token을 직접 localStorage에 저장할 수도 있음
=========================================== */
export const loginUser = async (loginData) => {
  try {
    const res = await api.post("/users/login", loginData);
    const token = res.data?.data?.token;

    if (token) {
      localStorage.setItem("token", token);
      console.log("✅ 로그인 성공, 토큰 저장");
    }

    return res.data;
  } catch (err) {
    console.error("❌ 로그인 오류:", err);
    throw err;
  }
};

export default api;
