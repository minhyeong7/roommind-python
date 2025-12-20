import { useEffect, useState } from "react";
import axios from "axios";
import "./MyPage.css";
import "./MyQnA.css";

const MyQnA = () => {
  const [myQnaList, setMyQnaList] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://13.209.66.16:8080/api/qnaboards")
      .then((res) => {
        const list = res.data.data;

        const email = JSON.parse(atob(token.split(".")[1])).sub;

        // 내가 쓴 QnA만 필터링
        const mine = list.filter((item) => item.email === email);

        setMyQnaList(mine);
      })
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <div>
      <h2 className="mypage-title">내가 쓴 Q&A</h2>

      {myQnaList.length === 0 ? (
        <p className="empty-text">작성한 Q&A가 없습니다.</p>
      ) : (
        <table className="mypage-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성일</th>
              <th>답변 상태</th>
            </tr>
          </thead>

          <tbody>
            {myQnaList.map((qna, index) => (
              <tr
                key={qna.qnaBoardId}
                className="table-row"
                onClick={() =>
                  (window.location.href = `/qna/${qna.qnaBoardId}`)
                }
              >
                <td>{index + 1}</td>

                <td className="clickable-title">{qna.title}</td>

                <td>{new Date(qna.createdDate).toLocaleDateString()}</td>

                <td>
                  {qna.answer ? (
                    <span className="badge-complete">답변완료</span>
                  ) : (
                    <span className="badge-pending">답변대기</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyQnA;
