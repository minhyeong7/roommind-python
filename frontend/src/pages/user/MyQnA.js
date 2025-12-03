import { useEffect, useState } from "react";
import axios from "axios";
import "./MyPage.css";

const MyQnA = () => {
  const [myQnaList, setMyQnaList] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:8080/api/qna")
      .then(res => {
        const list = res.data.data;

        // JWT에서 이메일 추출
        const email = JSON.parse(atob(token.split(".")[1])).sub;

        // 내가 쓴 QnA만 필터링
        const filtered = list.filter(item => item.userEmail === email);

        setMyQnaList(filtered);
      })
      .catch(err => console.log(err));
  }, [token]);

  return (
    <div className="mypage-container">
      <div className="mypage-content">
        <h2 className="mypage-title">내가 쓴 Q&A</h2>

        {/* 작성한 QnA 없을 때 */}
        {myQnaList.length === 0 && (
          <p className="empty-text">작성한 Q&A가 없습니다.</p>
        )}

        {/* QnA 목록 */}
        {myQnaList.map(qna => (
          <div key={qna.qnaId} className="myqna-item">
            <h3>{qna.title}</h3>
            <p className="preview">{qna.content}</p>

            {/* 답변 여부 표시 */}
            <p className="qna-status">
              {qna.answer ? "✔ 답변 완료" : "⏳ 답변 대기중"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyQnA;
