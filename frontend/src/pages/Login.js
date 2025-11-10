import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/userApi";
import Swal from "sweetalert2";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ 전체 response 받기
      const response = await loginUser(form);

      // ✅ token 존재 확인
      const token = response?.data?.token;
      if (token) {
        // ✅ 토큰 로컬스토리지 저장 (userApi에서 이미 저장하지만, 안전하게 한 번 더)
        localStorage.setItem("token", token);

        Swal.fire({
          icon: "success",
          title: "로그인 성공 🎉",
          text: "RoomMind에 오신 걸 환영합니다!",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "로그인 실패",
          text: "이메일 또는 비밀번호를 확인해주세요.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "로그인 실패",
        text: "서버 연결 오류 또는 잘못된 입력입니다.",
      });
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <p className="welcome-text">RoomMind에 다시 오신 것을 환영합니다 🪑</p>

      {/* 일반 로그인 */}
      <form onSubmit={handleSubmit} className="signup-form">
        <label>이메일</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="이메일을 입력하세요"
          required
        />

        <label>비밀번호</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="비밀번호를 입력하세요"
          required
        />

        <button type="submit" className="signup-btn">
          로그인
        </button>

        <p className="login-footer">
          아직 회원이 아니신가요?{" "}
          <span className="terms-link" onClick={() => navigate("/signup")}>
            회원가입 하기
          </span>
        </p>
      </form>

      {/* ✅ 소셜 로그인 섹션 */}
      <div className="social-login-section">
        <p>또는 간편 로그인</p>
        <div className="social-buttons">
          <button
            className="social-btn kakao"
            onClick={() => handleSocialLogin("kakao")}
          >
            <img src="/images/kakao.png" alt="카카오 로그인" />
            카카오 로그인
          </button>

          <button
            className="social-btn naver"
            onClick={() => handleSocialLogin("naver")}
          >
            <img src="/images/naver.png" alt="네이버 로그인" />
            네이버 로그인
          </button>

          <button
            className="social-btn google"
            onClick={() => handleSocialLogin("google")}
          >
            <img src="/images/google.png" alt="구글 로그인" />
            Google 로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
