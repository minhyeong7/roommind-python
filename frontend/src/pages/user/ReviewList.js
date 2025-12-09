import { useEffect, useState } from "react";
import axios from "axios";
import "./MyPage.css";
import "./MyQnA.css"; // 테이블 스타일 재사용

const ReviewList = () => {
  const [myReviews, setMyReviews] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const email = JSON.parse(atob(token.split(".")[1])).sub;

        // 내가 쓴 리뷰 조회 API 호출
        const res = await axios.get(
          `http://localhost:8080/api/reviews/user/${email}`
        );

        setMyReviews(res.data || []);
      } catch (err) {
        console.error("리뷰 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <h2 className="mypage-title">리뷰 내역</h2>

      {myReviews.length === 0 ? (
        <p className="empty-text">작성한 리뷰가 없습니다.</p>
      ) : (
        <table className="mypage-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>상품명</th>
              <th>평점</th>
              <th>내용</th>
              <th>작성일</th>
            </tr>
          </thead>

          <tbody>
            {myReviews.map((review, index) => (
              <tr key={review.reviewId} className="table-row">
                <td>{index + 1}</td>

                {/* 상품명 클릭 시 상세페이지 이동 */}
                <td
                  className="clickable-title"
                  onClick={() =>
                    (window.location.href = `/product/${review.productId}`)
                  }
                >
                  {review.productName || "(상품명 없음)"}
                </td>

                <td>{"★".repeat(review.rating)}</td>

                <td>{review.content}</td>

                <td>
                  {review.createdDate
                    ? new Date(review.createdDate).toLocaleDateString()
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReviewList;
