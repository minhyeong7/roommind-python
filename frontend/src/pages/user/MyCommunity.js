import { useEffect, useState } from "react";
import axios from "axios";
import "./MyPage.css";

const MyCommunity = () => {
  const [myPosts, setMyPosts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:8080/api/community")
      .then(res => {
        const list = res.data.data;

        // JWT에서 이메일 추출
        const email = JSON.parse(atob(token.split(".")[1])).sub;

        // 내가 쓴 글만 필터링
        const filtered = list.filter(item => item.userEmail === email);

        setMyPosts(filtered);
      })
      .catch(err => console.log(err));
  }, [token]);

  return (
    <div className="mypage-container">
      <div className="mypage-content">
        <h2 className="mypage-title">내가 쓴 커뮤니티 글</h2>

        {/* 글이 없는 경우 */}
        {myPosts.length === 0 && (
          <p className="empty-text">작성한 커뮤니티 글이 없습니다.</p>
        )}

        {/* 글 목록 */}
        {myPosts.map(post => (
          <div key={post.communityBoardId} className="mycommunity-item">
            <h3>{post.title}</h3>
            <p className="preview">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCommunity;
