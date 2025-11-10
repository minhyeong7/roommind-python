import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/userApi";
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
      const response = await loginUser(form);

      if (response.status === 200) {
        alert("✅ 로그인 성공! 메인 페이지로 이동합니다.");
        console.log("로그인 성공:", response.data);

        // 세션 or 토큰 저장 (JWT 사용 시)
        localStorage.setItem("token", response.data.token);

        navigate("/"); // 메인 페이지로 이동
      }
    } catch (error) {
      alert("❌ 로그인 실패. 이메일 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="signup-container">
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
    </div>
  );
}

export default Login;
