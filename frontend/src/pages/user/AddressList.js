import "./MyPage.css";

const AddressList = () => {
  return (
    <div className="mypage-container">
      <div className="mypage-sidebar-placeholder" />

      <div className="mypage-content">
        <h2 className="mypage-title">배송지 관리</h2>

        <div className="address-box">
          <div className="address-item">
            <p><b>기본 배송지</b></p>
            <p>인천시 연수구 ~~~</p>
            <button className="btn-small">수정</button>
          </div>

          <button className="btn-primary">새 배송지 추가</button>
        </div>
      </div>
    </div>
  );
};

export default AddressList;
