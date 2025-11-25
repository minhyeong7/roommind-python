import React, { useState } from "react";
import "./AddressModal.css";

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

  return (
    <div className="form-box">
      <h4>신규 배송지 추가</h4>

      <input
        placeholder="이름"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
      />
      <input
        placeholder="전화번호"
        value={form.phone}
        onChange={(e) => update("phone", e.target.value)}
      />
      <input
        placeholder="이메일"
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
      />
      <input
        placeholder="우편번호"
        value={form.zipcode}
        onChange={(e) => update("zipcode", e.target.value)}
      />
      <input
        placeholder="주소"
        value={form.address1}
        onChange={(e) => update("address1", e.target.value)}
      />
      <input
        placeholder="상세주소"
        value={form.address2}
        onChange={(e) => update("address2", e.target.value)}
      />

      <div className="form-buttons">
        <button className="cancel" onClick={onClose}>취소</button>
        <button className="save" onClick={() => onSave(form)}>저장</button>
      </div>
    </div>
  );
}

export default AddressForm;
