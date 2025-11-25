import React, { useState } from "react";
import "./AddressForm.css";

function AddressForm({ onSave, onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    zipcode: "",
    address1: "",
    address2: "",
  });

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  //  카카오 주소검색
  const openDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        update("zipcode", data.zonecode);
        update("address1", data.roadAddress || data.jibunAddress);
      },
    }).open();
  };

  // 전화번호 자동 포맷 (숫자만 + 자동 하이픈)
const handlePhoneInput = (value) => {
  // 숫자만 남기기
  let digits = value.replace(/[^0-9]/g, "");

  // 11자리 제한
  if (digits.length > 11) digits = digits.slice(0, 11);

  let formatted = digits;

  // 3-4-4 형식 자동 하이픈
  if (digits.length > 3 && digits.length <= 7) {
    formatted = digits.replace(/(\d{3})(\d+)/, "$1-$2");
  } else if (digits.length > 7) {
    formatted = digits.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
  }

  update("phone", formatted);
};


  return (
    <div className="address-form-overlay">
      <div className="address-form-box">

        <div className="address-form-title">신규 배송지 추가</div>

        {/* 이름 */}
        <div className="form-group">
          <label>이름</label>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
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

        {/* 이메일 */}
        <div className="form-group">
          <label>이메일</label>
          <input
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="example@email.com"
          />
        </div>

        {/* 우편번호 + 버튼 */}
        <div className="form-group">
          <label>우편번호</label>

          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={form.zipcode}
              placeholder="우편번호"
              readOnly
            />
            <button
              type="button"
              className="address-search-btn"
              onClick={openDaumPostcode}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                background: "#ff7f00",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              주소 찾기
            </button>
          </div>
        </div>

        {/* 주소 */}
        <div className="form-group">
          <label>주소</label>
          <input
            value={form.address1}
            placeholder="주소를 검색하세요"
            readOnly
          />
        </div>

        {/* 상세 주소 */}
        <div className="form-group">
          <label>상세주소</label>
          <input
            value={form.address2}
            onChange={(e) => update("address2", e.target.value)}
            placeholder="상세주소 입력"
          />
        </div>

        {/* 버튼 */}
        <div className="address-form-buttons">
          <button className="address-form-cancel" onClick={onClose}>
            취소
          </button>
          <button
            className="address-form-save"
            onClick={() => onSave(form)}
          >
            저장
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddressForm;
