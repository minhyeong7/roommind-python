import React, { useState } from "react";
import axios from "axios";
import "./AddressForm.css";

function AddressForm({ userId, userEmail, onClose, onAdded }) {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    recipient: "",
    phone: "",
    email: userEmail || "",
    address: "",
    detailAddress: "",
    isDefault: 0,
  });

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // 카카오 주소검색
  const openDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        update("address", data.roadAddress || data.jibunAddress);
      },
    }).open();
  };

  // 전화번호 자동 하이픈
  const handlePhoneInput = (value) => {
    let digits = value.replace(/[^0-9]/g, "");
    if (digits.length > 11) digits = digits.slice(0, 11);

    let formatted = digits;
    if (digits.length > 3 && digits.length <= 7) {
      formatted = digits.replace(/(\d{3})(\d+)/, "$1-$2");
    } else if (digits.length > 7) {
      formatted = digits.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
    }

    update("phone", formatted);
  };

  // 저장
  const saveAddress = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.post(
        "http://13.209.6.113:8080/api/address",
        {
          userId,
          recipient: form.recipient,
          phone: form.phone,
          email: form.email,
          address: form.address,           // zipcode 제거됨
          detailAddress: form.detailAddress,
          isDefault: form.isDefault,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("배송지가 추가되었습니다!");
      if (onAdded) onAdded();
      onClose();
    } catch (err) {
      console.error("❌ 배송지 저장 실패:", err);
      alert("배송지 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="address-form-overlay">
      <div className="address-form-box">

        <div className="address-form-title">신규 배송지 추가</div>

        {/* 이름 */}
        <div className="form-group">
          <label>이름</label>
          <input
            value={form.recipient}
            onChange={(e) => update("recipient", e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </div>

        {/* 전화번호 */}
        <div className="form-group">
          <label>전화번호</label>
          <input
            value={form.phone}
            onChange={(e) => handlePhoneInput(e.target.value)}
            placeholder="010-0000-0000"
            maxLength={13}
          />
        </div>

        {/* 이메일 (UI 없음, 자동 세팅됨) */}

        {/* 주소 + 버튼 */}
        <div className="form-group">
          <label>주소</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input value={form.address} placeholder="주소" readOnly />
            <button
              type="button"
              className="address-search-btn"
              onClick={openDaumPostcode}
            >
              주소 찾기
            </button>
          </div>
        </div>

        {/* 상세주소 */}
        <div className="form-group">
          <label>상세주소</label>
          <input
            value={form.detailAddress}
            onChange={(e) => update("detailAddress", e.target.value)}
            placeholder="상세주소"
          />
        </div>

        {/* 버튼 */}
        <div className="address-form-buttons">
          <button className="address-form-cancel" onClick={onClose}>
            취소
          </button>
          <button className="address-form-save" onClick={saveAddress}>
            저장
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddressForm;
