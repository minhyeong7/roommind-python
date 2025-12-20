import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import AddressForm from "./AddressForm";
import AddressEditForm from "./AddressEditForm";
import "./AddressList.css";

const AddressList = () => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  /** JWT에서 email 꺼내기 */
  const getEmail = () => {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
  };

  /** 유저 정보 가져오고 → 배송지 목록 가져오기 */
  const fetchUserInfo = async () => {
    const email = getEmail();
    if (!email) return;

    try {
      const res = await axios.get(
        `http://13.209.66.16:8080/api/users/email/${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userData = res.data.data;
      setUser(userData);

      fetchAddresses(userData.userId);
    } catch (err) {
      console.error("❌ 유저 정보 불러오기 실패", err);
    }
  };

  /** userId로 배송지 목록 조회 */
  const fetchAddresses = async (userId) => {
    try {
      const res = await axios.get(
        `http://13.209.66.16:8080/api/address/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAddresses(res.data.data);
    } catch (err) {
      console.error("❌ 배송지 목록 불러오기 실패", err);
    }
  };

  /** 배송지 삭제 */
  const deleteAddress = async (addressId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`http://13.209.66.16:8080/api/address/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("삭제되었습니다.");
      fetchAddresses(user.userId);
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (!user) return <div className="mypage-content">불러오는 중...</div>;

  /** 기본 주소 선택 */
  let defaultAddress = addresses.find((a) => a.isDefault === 1);

  /** 기본 배송지가 없고 user.address가 있을 때 */
  if (!defaultAddress && user.address) {
    defaultAddress = {
      addressId: null,
      userId: user.userId,
      address: user.address,
      detailAddress: "",
      recipient: user.userName,
      phone: user.phone,
      isDefault: 1
    };
  }

  return (
    <div className="mypage-content">
      <h2 className="mypage-title">배송지 관리</h2>

      {/* 기본 배송지 영역 */}
      <div className="address-box">
        <p><b>기본 배송지</b></p>

        {defaultAddress ? (
          <div className="address-item">
            <p>{defaultAddress.address} {defaultAddress.detailAddress}</p>
            <p>{defaultAddress.recipient} | {defaultAddress.phone}</p>

            <div className="addr-btn-row">
              <button
                className="addr-btn edit"
                onClick={() => {
                  setEditTarget(defaultAddress);
                  setEditModal(true);
                }}
              >
                수정
              </button>
            </div>
          </div>
        ) : (
          <p className="empty-text">등록된 배송지가 없습니다.</p>
        )}

        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
          style={{ marginTop: "20px" }}
        >
          새 배송지 추가
        </button>
      </div>

      {/* 전체 배송지 리스트 */}
      <h3 style={{ marginTop: "40px", marginBottom: "10px" }}>전체 배송지</h3>

      {addresses.length === 0 ? (
        <p>등록된 배송지가 없습니다.</p>
      ) : (
        <div>
          {addresses.map((addr) => (
            <div className="address-item" key={addr.addressId}>
              <p>
                {addr.address} {addr.detailAddress}
                {addr.isDefault === 1 && (
                  <b style={{ color: "#fc9510" }}> (기본)</b>
                )}
              </p>

              <p>{addr.recipient} | {addr.phone}</p>

              <div className="addr-btn-row">
                <button
                  className="addr-btn edit"
                  onClick={() => {
                    setEditTarget(addr);
                    setEditModal(true);
                  }}
                >
                  수정
                </button>

                <button
                  className="addr-btn delete"
                  onClick={() => deleteAddress(addr.addressId)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 새 배송지 추가 모달 */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <AddressForm
            userId={user.userId}
            onClose={() => setShowModal(false)}
            onAdded={() => fetchAddresses(user.userId)}
          />
        </Modal>
      )}

      {/* 수정 모달 */}
      {editModal && (
        <Modal onClose={() => setEditModal(false)}>
          <AddressEditForm
            address={editTarget}
            onClose={() => setEditModal(false)}
            onUpdated={() => fetchAddresses(user.userId)}
          />
        </Modal>
      )}
    </div>
  );
};

export default AddressList;
