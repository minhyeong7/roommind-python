// src/components/AddressModal.js

import React, { useState, useEffect } from "react";
import "./AddressModal.css";
import api from "../api/userApi";
import AddressForm from "./AddressForm"; // 이미 만든 배송지 추가 폼

function AddressModal({ closeModal, onSelect }) {
  const [addressList, setAddressList] = useState([]);
  const [user, setUser] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /** JWT email 추출 */
  const getEmail = () => {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
  };

  /** 유저 정보 → 배송지 목록 불러오기 */
  useEffect(() => {
    const email = getEmail();
    if (!email) return;

    api
      .get(`/users/email/${email}`)
      .then((res) => {
        const userData = res.data.data;
        setUser(userData);
        loadAddressList(userData.userId);
      })
      .catch((err) => console.error("❌ 유저 정보 불러오기 실패:", err));
  }, []);

  /** 배송지 목록 조회 */
  const loadAddressList = (userId) => {
    api
      .get(`/address/${userId}`)
      .then((res) => {
        setAddressList(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => console.error("❌ 배송지 불러오기 실패:", err));
  };

  /** 배송지 삭제 */
  const deleteAddress = (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    api
      .delete(`/address/${id}`)
      .then(() => {
        loadAddressList(user.userId);
      })
      .catch((err) => console.error("삭제 실패:", err));
  };

  /** 배송지 추가 완료 후 새로고침 */
  const handleAdded = () => {
    loadAddressList(user.userId);
    setOpenForm(false);
  };

  if (loading) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <div className="modal-header">
          <h3>배송지 선택</h3>
          <button className="close-btn" onClick={closeModal}>✕</button>
        </div>

        {/* 배송지 목록 */}
        <div className="address-list">
          {addressList.length === 0 ? (
            <p className="empty">등록된 배송지가 없습니다.</p>
          ) : (
            addressList.map((addr) => (
              <div key={addr.addressId} className="address-item">
                <p className="addr-name">{addr.recipient}</p>
                <p>{addr.address} {addr.detailAddress}</p>
                <p className="small-text">{addr.phone}</p>

                <div className="addr-buttons">
                  <button className="delete-btn" onClick={() => deleteAddress(addr.addressId)}>
                    삭제
                  </button>
                  <button
                    className="select-btn"
                    onClick={() =>
                      onSelect({
                        name: addr.recipient,       // 받는사람
                        phone: addr.phone,          // 전화번호
                        email: user?.email || "",   // 로그인 이메일
                        zipcode: addr.zipcode || "", // 우편번호
                        address1: addr.address,     // 기본 주소
                        address2: addr.detailAddress || "", // 상세주소
                      })
                    }
                  >
                    선택
                  </button>

                </div>
              </div>
            ))
          )}
        </div>

        {/* 신규 배송지 추가 버튼 */}
        <button
          className="add-address-btn"
          onClick={() => setOpenForm(true)}
        >
          + 배송지 추가
        </button>

        {/* 배송지 추가 폼 */}
        {openForm && (
          <AddressForm
            userId={user.userId}
            userEmail={user.email}
            onClose={() => setOpenForm(false)}
            onAdded={handleAdded}
          />
        )}
      </div>
    </div>
  );
}

export default AddressModal;
