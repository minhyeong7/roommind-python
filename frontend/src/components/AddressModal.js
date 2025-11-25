import React, { useState } from "react";
import AddressForm from "./AddressForm";
import "./AddressModal.css";

function AddressModal({ closeModal, onSelect }) {
  const [openForm, setOpenForm] = useState(false);

  const [addressList, setAddressList] = useState([
    {
      id: 1,
      name: "김노아",
      phone: "010-0000-0000",
      email: "noa@example.com",
      zipcode: "12345",
      address1: "인천광역시 남동구 석산로 216번길",
      address2: "202호",
    },
    {
      id: 2,
      name: "김노아",
      phone: "010-0000-0000",
      email: "noa@example.com",
      zipcode: "12345",
      address1: "인천광역시 부평구 부평동 441-29",
      address2: "명신빌라 402호",
    },
  ]);

  const addAddress = (newAddr) => {
    setAddressList((prev) => [...prev, { ...newAddr, id: Date.now() }]);
    setOpenForm(false);
  };

  const deleteAddress = (id) => {
    setAddressList((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="modal-overlay">

      <div className="modal-box">
        <div className="modal-header">
          <h3>배송지 선택</h3>
          <button className="close-btn" onClick={closeModal}>✕</button>
        </div>

        {/* 배송지 목록 */}
        <div className="address-list">
          {addressList.map((addr) => (
            <div key={addr.id} className="address-item">
              <p className="addr-name">{addr.name}</p>
              <p>{addr.address1} {addr.address2}</p>
              <p className="small-text">{addr.phone}</p>

              <div className="addr-buttons">
                <button onClick={() => deleteAddress(addr.id)}>삭제</button>
                <button onClick={() => onSelect(addr)}>선택</button>
              </div>
            </div>
          ))}
        </div>

        {/* 신규 배송지 추가 */}
        <button
          className="add-address-btn"
          onClick={() => setOpenForm(true)}
        >
          + 배송지 추가
        </button>

        {/* 신규 배송지 입력폼 */}
        {openForm && (
          <AddressForm 
            onSave={addAddress}
            onClose={() => setOpenForm(false)}
          />
        )}
      </div>

    </div>
  );
}

export default AddressModal;
