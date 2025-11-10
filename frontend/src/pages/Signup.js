import React, { useState } from "react";
import { registerUser } from "../api/userApi";
import "./Signup.css";

function Signup() {
  const [form, setForm] = useState({
    username: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await registerUser(form);
      alert("✅ 회원가입이 완료되었습니다!");
      console.log(result);
    } catch (error) {
      alert("❌ 회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label>이름</label>
        <input type="text" name="username" value={form.username} onChange={handleChange} required />

        <label>전화번호</label>
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />

        <label>주소</label>
        <input type="text" name="address" value={form.address} onChange={handleChange} required />

        <label>이메일</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>비밀번호</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />

        <button type="submit" className="signup-btn">회원가입</button>
      </form>
    </div>
  );
}

export default Signup;
