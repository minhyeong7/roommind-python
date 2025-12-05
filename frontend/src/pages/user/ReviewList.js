import "./MyPage.css";

const ReviewList = () => {
  return (
    <div>
      <h2 className="mypage-title">리뷰 내역</h2>

      <div className="review-list">
        <div className="review-item">
          <p><b>화이트 원목 테이블</b></p>
          <p>★★★★★</p>
          <p>예뻐요! 배송 빨랐어요.</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
