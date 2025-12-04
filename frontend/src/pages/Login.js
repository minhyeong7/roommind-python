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

  // 비밀번호 보기/숨기기
  const [showPassword, setShowPassword] = useState(false);

  // CapsLock 상태
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  // ==========================
  // 입력 변경
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ==========================
  // CapsLock 감지
  // ==========================
  const handleKeyCheck = (e) => {
    setIsCapsLockOn(e.getModifierState("CapsLock"));
  };

  // ==========================
  // 비밀번호 보기 버튼
  // ==========================
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // ==========================
  // 로그인 요청
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(form);
      const token = response?.data?.token;
      const userData = response?.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        window.dispatchEvent(new Event("loginSuccess"));

        Swal.fire({
          icon: "success",
          title: "로그인 성공 🎉",
          text: "RoomMind에 오신 걸 환영합니다!",
          showConfirmButton: false,
          timer: 1500,
        });

        return navigate("/");
      }

      Swal.fire({
        icon: "error",
        title: "로그인 실패",
        text: "이메일 또는 비밀번호가 잘못되었습니다.",
      });
    } catch (error) {
      console.error(error);

      // 서버 응답이 있는 경우 (400, 401 등)
      if (error.response) {
        const status = error.response.status;

        if (status === 400 || status === 401) {
          Swal.fire({
            icon: "error",
            title: "로그인 실패",
            text: "이메일 또는 비밀번호가 틀렸습니다.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "서버 오류",
            text: "서버에서 오류가 발생했습니다.",
          });
        }
      } else {
        // 서버 자체가 안 켜짐
        Swal.fire({
          icon: "error",
          title: "연결 실패",
          text: "서버에 연결할 수 없습니다. 서버가 켜져 있는지 확인해주세요.",
        });
      }
    }
  };

  // 소셜 로그인
  const handleSocialLogin = (provider) => {
    if (provider === "kakao") {
      window.location.href = "http://localhost:8080/oauth/kakao";
    } else if (provider === "naver") {
      window.location.href = "http://localhost:8080/oauth/naver";
    } else if (provider === "google") {
      window.location.href = "http://localhost:8080/oauth/google";
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <p className="welcome-text">RoomMind에 다시 오신 것을 환영합니다 🪑</p>

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

        {/* 🔥 비밀번호 입력 + 눈 아이콘 + CapsLock */}
        <div className="pw-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            onKeyDown={handleKeyCheck}
            onKeyUp={handleKeyCheck}
            placeholder="비밀번호를 입력하세요"
            required
          />
          <span className="pw-toggle" onClick={togglePassword}>
            {showPassword ? "👁‍🗨" : "👁"}
          </span>
        </div>

        {/* 🔥 CapsLock 경고 */}
        {isCapsLockOn && (
          <div className="caps-warning">⚠️ CapsLock이 켜져 있습니다!</div>
        )}

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

      {/* 소셜 로그인 */}
      <div className="social-login-section">
        <p>또는 간편 로그인</p>

        <div className="social-buttons">
          <button className="social-btn kakao" onClick={() => handleSocialLogin("kakao")}>
            <img src="/images/kakao.png" alt="카카오 로그인" />
            카카오 로그인
          </button>

          <button className="social-btn naver" onClick={() => handleSocialLogin("naver")}>
            <img src="/images/naver.png" alt="네이버 로그인" />
            네이버 로그인
          </button>

          <button className="social-btn google" onClick={() => handleSocialLogin("google")}>
            <img src="/images/google.png" alt="구글 로그인" />
            Google 로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
