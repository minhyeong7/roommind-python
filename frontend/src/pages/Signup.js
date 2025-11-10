import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import { registerUser } from "../api/userApi";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate(); // ✅ 페이지 이동용
  const [form, setForm] = useState({
    username: "",
    phone: "",
    address: "",
    detailAddress: "",
    emailId: "",
    emailDomain: "",
    password: "",
  });
  const [agreement, setAgreement] = useState(null);
  const [showTerms, setShowTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const emailDomains = ["naver.com", "daum.net", "gmail.com", "nate.com", "직접 입력"];

  // 📞 전화번호 자동 하이픈
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);
    if (!match) return value;
    return [match[1], match[2], match[3]].filter(Boolean).join("-");
  };

  // 🧠 비밀번호 강도 계산 함수
  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (password.length === 0) return "";
    if (score <= 1) return "약함 🔴";
    if (score === 2) return "보통 🟡";
    if (score >= 3) return "강함 🟢";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: name === "phone" ? formatPhoneNumber(value) : value };

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (agreement !== true) {
      alert("❌ 약관에 동의하지 않으면 회원가입이 어렵습니다.");
      return;
    }

    if (!form.emailId || !form.emailDomain) {
      alert("이메일을 정확히 입력해주세요.");
      return;
    }

    const fullEmail = `${form.emailId}@${form.emailDomain}`;
    const fullAddress = `${form.address} ${form.detailAddress}`.trim();

    try {
      const result = await registerUser({ ...form, email: fullEmail, address: fullAddress });
      alert("✅ 회원가입이 완료되었습니다! 메인 페이지로 이동합니다.");
      console.log(result);

      navigate("/"); // ✅ 회원가입 완료 후 메인으로 이동
    } catch (error) {
      alert("❌ 회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <p className="welcome-text">
        RoomMind에 오신 것을 환영합니다 👋<br />아래 정보를 입력해 주세요.
      </p>

      <form onSubmit={handleSubmit} className="signup-form">
        <label>이름</label>
        <input type="text" name="username" value={form.username} onChange={handleChange} required />

        <label>전화번호</label>
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} maxLength="13" required />

        <label>주소</label>
        <div className="address-wrapper">
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="주소 검색 버튼을 눌러주세요"
            readOnly
            required
          />
          <button type="button" className="address-btn" onClick={() => openDaumPostcode(setForm, form)}>
            주소 검색
          </button>
        </div>

        <label>상세주소</label>
        <input
          type="text"
          name="detailAddress"
          value={form.detailAddress}
          onChange={handleChange}
          placeholder="예: 101동 202호"
          required
        />

        {/* 📧 이메일 */}
        <label>이메일</label>
        <div className="email-wrapper">
          <input
            type="text"
            name="emailId"
            value={form.emailId}
            onChange={handleChange}
            placeholder="이메일 아이디"
            required
          />
          <span>@</span>
          <select
            name="emailDomain"
            value={form.emailDomain}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "직접 입력") {
                setForm({ ...form, emailDomain: "" });
              } else {
                setForm({ ...form, emailDomain: value });
              }
            }}
            required
          >
            <option value="">선택</option>
            {emailDomains.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>

        {form.emailDomain === "" && (
          <input
            type="text"
            name="emailDomain"
            placeholder="직접 입력"
            value={form.emailDomain}
            onChange={handleChange}
            required
            className="email-direct"
          />
        )}

        {/* 🔒 비밀번호 */}
        <label>비밀번호</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />
        {passwordStrength && (
          <p
            className={`password-strength ${
              passwordStrength.includes("강함")
                ? "strong"
                : passwordStrength.includes("보통")
                ? "medium"
                : "weak"
            }`}
          >
            비밀번호 강도: {passwordStrength}
          </p>
        )}

        {/* ✅ 약관 */}
        <div className="agreement-section">
          <p>
            회원가입 약관에{" "}
            <span className="terms-link" onClick={() => setShowTerms(true)}>
              [내용보기]
            </span>{" "}
            동의하십니까?
          </p>
          <div className="agreement-options">
            <label>
              <input
                type="radio"
                name="agreement"
                value="yes"
                onChange={() => setAgreement(true)}
                checked={agreement === true}
              />
              동의함
            </label>
            <label>
              <input
                type="radio"
                name="agreement"
                value="no"
                onChange={() => setAgreement(false)}
                checked={agreement === false}
              />
              동의안함
            </label>
          </div>
        </div>

        <button type="submit" className="signup-btn">
          회원가입
        </button>
      </form>

      {/* 📜 약관 모달 */}
      {showTerms && (
        <div className="modal-overlay" onClick={() => setShowTerms(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>회원가입 약관</h3>
            <div className="terms-scroll">
              <p>[제1조 목적] 본 약관은 RoomMind 서비스 이용에 필요한 기본 조건을 규정합니다.</p>
              <p>[제2조 회원가입] 회원은 본 약관에 동의함으로써 가입할 수 있습니다.</p>
              <p>[제3조 개인정보 보호] 회사는 관련 법령에 따라 개인정보를 관리합니다.</p>
              <p>[제4조 서비스 이용] 회원은 타인의 정보를 도용해서는 안 됩니다.</p>
              <p>[제5조 계약 해지] 회원은 언제든지 탈퇴할 수 있습니다.</p>
            </div>
            <button className="close-btn" onClick={() => setShowTerms(false)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ✅ 다음(카카오) 주소 API */
function openDaumPostcode(setForm, form) {
  new window.daum.Postcode({
    oncomplete: function (data) {
      setForm({
        ...form,
        address: data.address,
      });
    },
  }).open();
}

export default Signup;
