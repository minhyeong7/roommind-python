import { useState, useEffect } from "react";
import axios from "axios";
import "./AddressEditForm.css";

const AddressEditForm = ({ address, onClose, onUpdated }) => {
  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [detail, setDetail] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const token = localStorage.getItem("token");

  /** 📌 자동 하이픈 */
  const formatPhone = (value) => {
    const onlyNums = value.replace(/[^0-9]/g, "");
    if (onlyNums.length <= 3) return onlyNums;
    if (onlyNums.length <= 7)
      return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
  };

  /** 📌 기존 값 넣기 + address/detailAddress 자동 분리 */
  useEffect(() => {
    if (address) {
      setRecipient(address.recipient || "");

      // 전화번호 포맷 적용
      setPhone(formatPhone(address.phone || ""));

      const raw = address.address || "";
      const parts = raw.trim().split(" ");
      const last = parts[parts.length - 1];

      // 마지막 단어가 숫자면 detail로 인식
      if (/^\d+$/.test(last)) {
        setAddr(parts.slice(0, -1).join(" "));
        setDetail(address.detailAddress || last);
      } else {
        setAddr(raw);
        setDetail(address.detailAddress || "");
      }

      setIsDefault(address.isDefault === 1);
    }
  }, [address]);

  /** 주소 검색 */
  const handleSearchAddress = () => {
    new window.daum.Postcode({
      oncomplete: (data) => setAddr(data.address)
    }).open();
  };

  /** 배송지 수정 */
  const handleSubmit = async () => {
    try {
      await axios.put(
        "http://13.209.6.113:8080/api/address",
        {
          addressId: address.addressId,
          userId: address.userId,
          recipient,
          phone,
          address: addr,
          detailAddress: detail,
          isDefault: isDefault ? 1 : 0
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("배송지가 수정되었습니다!");
      onUpdated();
      onClose();

    } catch (err) {
      console.error(err);
      alert("수정 실패!");
    }
  };

  return (
    <div>
      <h3>배송지 수정</h3>

      <div className="form-box">
        <label>받는 사람</label>
        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />

        <label>전화번호</label>
        <input
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
        />

        <label>주소</label>
        <div className="address-row">
          <input value={addr} readOnly />
          <button onClick={handleSearchAddress}>찾기</button>
        </div>

        <label>상세 주소</label>
        <input
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
          />
          기본 배송지로 설정
        </label>

        <div className="form-buttons">
          <button className="btn-primary" onClick={handleSubmit}>
            저장
          </button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default AddressEditForm;
