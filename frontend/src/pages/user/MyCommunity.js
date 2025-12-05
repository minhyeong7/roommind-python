import { useEffect, useState } from "react";
import axios from "axios";
import "./MyCommunity.css";

const MyCommunity = () => {
  const [myPosts, setMyPosts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:8080/api/community")
      .then((res) => {
        const list = res.data.data;

        const email = JSON.parse(atob(token.split(".")[1])).sub;
        const filtered = list.filter((item) => item.email === email);

        setMyPosts(filtered);
      })
      .catch(console.error);
  }, [token]);

  return (
    <div>
      <h2 className="mypage-title">내가 쓴 커뮤니티 글</h2>

      {myPosts.length === 0 ? (
        <p className="empty-text">작성한 커뮤니티 글이 없습니다.</p>
      ) : (
        <table className="mypage-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성일</th>
              <th>댓글수</th>
            </tr>
          </thead>

          <tbody>
            {myPosts.map((post, index) => (
              <tr
                key={post.communityBoardId}
                className="table-row"
                onClick={() =>
                  (window.location.href = `/community/${post.communityBoardId}`)
                }
              >
                <td>{index + 1}</td>
                <td className="clickable-title">{post.title}</td>
                <td>{post.createdDate?.split("T")[0]}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyCommunity;
