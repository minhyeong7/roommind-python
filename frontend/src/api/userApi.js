// src/api/userApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://13.209.6.113:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===========================================
    JWT exp(만료시간) 검증 함수
   - exp 초/밀리초 자동 판별
=========================================== */
export const isTokenExpired = (token) => {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = JSON.parse(atob(payloadBase64));
    let exp = payloadJson.exp;

    if (!exp) return true;

    // 🔥 exp가 초인지 밀리초인지 자동 판별
    if (exp < 1000000000000) {
      // 10자리면 초 단위
      exp = exp * 1000;
    }

    return Date.now() > exp;
  } catch (e) {
    console.error("JWT decode 실패:", e);
    return true;
  }
};

/* ===========================================
    JWT 남은 시간(초) 계산 함수
=========================================== */
export const getTokenRemainingTime = (token) => {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = JSON.parse(atob(payloadBase64));
    let exp = payloadJson.exp;

    if (!exp) return 0;

    // 초/밀리초 자동 판별
    if (exp < 1000000000000) {
      exp = exp * 1000;
    }

    const diff = exp - Date.now();
    if (diff <= 0) return 0;

    return Math.floor(diff / 1000); // 초 단위 반환
  } catch (e) {
    console.error("JWT parse error:", e);
    return 0;
  }
};

/* ===========================================
    로그아웃 공통 함수
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
    Axios 요청 인터셉터 — 요청 전에 exp 직접 체크
=========================================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
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
    Axios 응답 인터셉터 — 401/403 자동 로그아웃
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
    회원가입
=========================================== */
export const registerUser = async (userData) => {
  const res = await api.post("/users/signup", userData);
  return res.data;
};

/* ===========================================
    일반 로그인
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

/* ===========================================
    로그인한 유저 정보 조회
=========================================== */
export const fetchUserInfo = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export default api;
