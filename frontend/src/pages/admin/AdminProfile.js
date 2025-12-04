import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminProfile.css";
import AdminSidebar from "./AdminSidebar";

export default function AdminProfile() {
  const [info, setInfo] = useState({
    userName: "",
    email: "",
    phone: "",
  });

  const [passwords, setPasswords] = useState({
    currentPw: "",
    newPw: "",
    confirmPw: "",
  });

  // 비밀번호 보기/숨기기 상태
  const [showPassword, setShowPassword] = useState({
    currentPw: false,
    newPw: false,
    confirmPw: false,
  });

  // 비밀번호 강도 표시 상태
  const [passwordStrength, setPasswordStrength] = useState("");

  // CapsLock 활성화 상태
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const token = localStorage.getItem("token");

  // ================================
  // 로그인한 관리자 정보 불러오기
  // ================================
  useEffect(() => {
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const email = payload.sub;

    axios
      .get(`http://localhost:8080/api/users/email/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.data;
        setInfo({
          userName: data.userName,
          email: data.email,
          phone: data.phone || "",
        });
      })
      .catch((err) => console.error(err));
  }, [token]);

  // ================================
  // 입력 변경
  // ================================
  const onChangeInfo = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onChangePassword = (e) => {
    const { name, value } = e.target;

    setPasswords((prev) => ({ ...prev, [name]: value }));

    // 강도 체크는 newPw만
    if (name === "newPw") checkPasswordStrength(value);
  };

  // ================================
  // CapsLock 감지
  // ================================
  const handleKeyCheck = (e) => {
    const caps = e.getModifierState("CapsLock");
    setIsCapsLockOn(caps);
  };

  // ================================
  // 비밀번호 보기/숨기기 토글
  // ================================
  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // ================================
  // 비밀번호 강도 체크
  // ================================
  const checkPasswordStrength = (pw) => {
    if (pw.length < 8) {
      setPasswordStrength("weak");
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(pw);
    const hasNumber = /\d/.test(pw);
    const hasSpecial = /[@$!%*?&]/.test(pw);

    const validCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

    if (validCount === 1) setPasswordStrength("weak");
    else if (validCount === 2) setPasswordStrength("medium");
    else if (validCount === 3) setPasswordStrength("strong");
  };

  // ================================
  // 프로필 업데이트
  // ================================
  const onSaveProfile = () => {
    axios
      .put(
        "http://localhost:8080/api/users/update",
        {
          email: info.email,
          userName: info.userName,
          phone: info.phone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => alert("내 정보가 수정되었습니다!"))
      .catch((err) => console.error(err));
  };

  // ================================
  // 비밀번호 변경
  // ================================
  const onSavePassword = () => {
    const { currentPw, newPw, confirmPw } = passwords;

    if (!currentPw || !newPw || !confirmPw) {
      alert("모든 비밀번호 입력란을 채워주세요!");
      return;
    }

    if (newPw !== confirmPw) {
      alert("새 비밀번호 확인이 일치하지 않습니다!");
      return;
    }

    // 백엔드와 동일한 정규식 검사
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPw)) {
      alert("비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.");
      return;
    }

    axios
      .put(
        "http://localhost:8080/api/users/password",
        { email: info.email, currentPw, newPw },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("비밀번호가 변경되었습니다!");
        setPasswords({ currentPw: "", newPw: "", confirmPw: "" });
        setPasswordStrength("");
      })
      .catch(() => alert("현재 비밀번호가 틀렸습니다."));
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="profile-container">
        <h3 className="profile-section-title">기본 정보</h3>

        {/* ========== 기본 정보 ========== */}
        <label>이름</label>
        <input
          className="profile-input"
          name="userName"
          value={info.userName}
          onChange={onChangeInfo}
        />

        <label>이메일</label>
        <input className="profile-input" name="email" value={info.email} disabled />

        <label>전화번호</label>
        <input
          className="profile-input"
          name="phone"
          value={info.phone}
          onChange={onChangeInfo}
        />

        <button className="profile-save-btn" onClick={onSaveProfile}>
          정보 수정하기
        </button>

        {/* ========== 비밀번호 변경 ========== */}
        <div className="password-box">
          <h3 className="profile-section-title">비밀번호 변경</h3>

             {/* CapsLock 경고 */}
          {isCapsLockOn && (
            <div className="caps-warning">⚠️ CapsLock이 켜져 있습니다!</div>
          )}

          {/* 현재 비밀번호 */}
          <label>현재 비밀번호</label>
          <div className="pw-input-wrapper">
            <input
              type={showPassword.currentPw ? "text" : "password"}
              className="password-input"
              name="currentPw"
              value={passwords.currentPw}
              onChange={onChangePassword}
              onKeyDown={handleKeyCheck}
              onKeyUp={handleKeyCheck}
            />
            <span className="pw-toggle" onClick={() => togglePassword("currentPw")}>
              {showPassword.currentPw ? "👁‍🗨" : "👁"}
            </span>
          </div>

          {/* 새 비밀번호 */}
          <label>새 비밀번호</label>
          <div className="pw-input-wrapper">
            <input
              type={showPassword.newPw ? "text" : "password"}
              className="password-input"
              name="newPw"
              value={passwords.newPw}
              onChange={onChangePassword}
              onKeyDown={handleKeyCheck}
              onKeyUp={handleKeyCheck}
            />
            <span className="pw-toggle" onClick={() => togglePassword("newPw")}>
              {showPassword.newPw ? "👁‍🗨" : "👁"}
            </span>
          </div>

          {/* 비밀번호 강도 표시 */}
          {passwords.newPw && (
            <div className={`pw-strength ${passwordStrength}`}>
              {passwordStrength === "weak" && "약함 (Weak)"}
              {passwordStrength === "medium" && "보통 (Medium)"}
              {passwordStrength === "strong" && "강함 (Strong)"}
            </div>
          )}

       

          {/* 새 비밀번호 확인 */}
          <label>새 비밀번호 확인</label>
          <div className="pw-input-wrapper">
            <input
              type={showPassword.confirmPw ? "text" : "password"}
              className="password-input"
              name="confirmPw"
              value={passwords.confirmPw}
              onChange={onChangePassword}
              onKeyDown={handleKeyCheck}
              onKeyUp={handleKeyCheck}
            />
            <span
              className="pw-toggle"
              onClick={() => togglePassword("confirmPw")}
            >
              {showPassword.confirmPw ? "👁‍🗨" : "👁"}
            </span>
          </div>

          {/* 저장 버튼 */}
          <button className="profile-save-btn" onClick={onSavePassword}>
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  );
}
