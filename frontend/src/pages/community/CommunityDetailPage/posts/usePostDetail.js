import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { fetchCommunityDetail } from "../../../../api/cmtboardApi";

export default function usePostDetail() {
  const { id } = useParams();

  const [post, setPost] = useState(null);     // board 데이터
  const [files, setFiles] = useState([]);     // 파일 목록
  const [comments, setComments] = useState([]); // 댓글 (API 미구현)
  const [loading, setLoading] = useState(true);

  // 🟦 상세 데이터 로드 함수
  const loadDetail = useCallback(async () => {
    try {
      setLoading(true);

      const data = await fetchCommunityDetail(id);

      // 실제 응답 구조
      // data = { board: {...}, files: [...] }
      setPost(data.board);
      setFiles(data.files || []);
      setComments([]); // 댓글 기능 없으므로 빈 배열

    } catch (err) {
      console.error("❌ 커뮤니티 상세 조회 실패:", err);
      alert("게시글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 🟦 id가 바뀌면 자동 로딩
  useEffect(() => {
    if (id) loadDetail();
  }, [id, loadDetail]);

  return { post, files, comments, loading };
}
