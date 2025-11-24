import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function usePostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 여기 API 연결하면 됨
    // fetch(`/api/community/${id}`)

    const dummyPost = {
      id,
      title: "첫 셀프 인테리어 도전기",
      writer: "오다나락",
      date: "3일 전",
      views: 350,
      likes: 18,
      content: "도배부터 장판까지 직접 해봤어요!",
      image: "/images/sample2.jpg",
    };

    const dummyComments = [
      { id: 1, writer: "두현맘", content: "너무 예뻐요!", date: "2일 전" },
      { id: 2, writer: "냥집사", content: "인테리어 꿀팁 감사합니다", date: "1일 전" },
    ];

    setPost(dummyPost);
    setComments(dummyComments);
    setLoading(false);
  }, [id]);

  return { post, comments, loading };
}
