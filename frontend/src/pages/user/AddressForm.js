import { useState } from "react";
import axios from "axios";
import "./AddressForm.css";

const AddressForm = ({ onClose, userId, onAdded }) => {
  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isDefault, setIsDefault] = useState(0);

  const token = localStorage.getItem("token");

  /** 전화번호 자동 하이픈 */
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만

    if (value.length < 4) {
      value = value;
    } else if (value.length < 8) {
      value = value.replace(/(\d{3})(\d{1,4})/, "$1-$2");
    } else {
      value = value.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3");
    }

    setPhone(value);
  };

  /** 주소 검색 */
  const handleSearchAddress = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setAddress(data.address);
      }
    }).open();
  };

  /** 저장 (배송지 추가 API) */
  const handleSubmit = async () => {
    if (!recipient || !phone || !address) {
      alert("필수 정보를 입력해주세요.");
      return;
    }

    try {
      await axios.post(
        "http://13.209.6.113:8080/api/address",
        {
          userId,
          recipient,
          phone,
          address,
          detailAddress,
          isDefault: isDefault ? 1 : 0
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("배송지가 추가되었습니다!");
      if (onAdded) onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      alert("추가 실패!");
    }
  };

  return (
    <div className="address-modal">
      <h3>새 배송지 추가</h3>

      <div className="form-box">

        <label>받는 사람</label>
        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />

        <label>전화번호</label>
        <input
          value={phone}
          onChange={handlePhoneChange}  
          maxLength={13}
        />

        <label>주소</label>
        <div className="address-row">
          <input className="address-input" value={address} readOnly />
          <button className="search-btn" onClick={handleSearchAddress}>
            찾기
          </button>
        </div>

        <label>상세 주소</label>
        <input
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
        />

        <div className="default-row">
          <input
            type="checkbox"
            checked={isDefault === 1}
            onChange={(e) => setIsDefault(e.target.checked ? 1 : 0)}
          />
          <span className="default-row-check">기본 배송지로 설정</span>
        </div>

        <div className="form-buttons">
          <button className="btn-primary" onClick={handleSubmit}>
            저장
          </button>
          <button className="btn-cancel" onClick={onClose}>
            취소
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddressForm;
