// src/pages/community/CommunityEditPage.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCommunityDetail,
  updateCommunityBoard,
} from "../../../api/cmtboardApi";
import "./CommunityEditPage.css";

export default function CommunityEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
  });
  const [newImages, setNewImages] = useState([]);
  const [oldFiles, setOldFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // *****************************************
  // 🔥 기존 게시글 불러오기
  // *****************************************
  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchCommunityDetail(id);
        const { board, files } = data;

        setForm({
          title: board.title,
          content: board.content,
        });

        setOldFiles(files || []);
      } catch (err) {
        alert("게시글 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  // *****************************************
  // 🔥 입력 변경 핸들러
  // *****************************************
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // *****************************************
  // 🔥 새 이미지 추가
  // *****************************************
  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  // *****************************************
  // 🔥 수정 완료
  // *****************************************
  const handleSubmit = async () => {
    if (!form.title.trim()) return alert("제목을 입력하세요.");

    try {
      await updateCommunityBoard(id, form, newImages);
      alert("수정이 완료되었습니다!");
      navigate(`/community/${id}`);
    } catch (err) {
      console.error(err);
      alert("수정 실패!");
    }
  };

  if (loading) return <div className="edit-loading">불러오는 중...</div>;

  return (
    <div className="edit-container">
      <h2>게시글 수정</h2>

      <div className="edit-box">
        <label>제목</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="edit-input"
        />

        <label>내용</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="edit-textarea"
        />

        {/* 기존 이미지 보여주기 */}
        {oldFiles.length > 0 && (
          <div className="old-images">
            <p>📷 기존 이미지</p>
            <div className="old-img-list">
              {oldFiles.map((file) => {
                const imgUrl = `http://localhost:8080/uploads/community/${file.createdDate.slice(
                  0,
                  10
                )}/${file.fileName}`;
                return (
                  <img
                    key={file.uuid}
                    src={imgUrl}
                    alt="old"
                    className="old-img"
                  />
                );
              })}
            </div>
          </div>
        )}

        <label>📤 이미지 변경 (선택)</label>
        <input type="file" multiple onChange={handleImageChange} />

        <div className="edit-btn-area">
          <button className="edit-cancel-btn" onClick={() => navigate(-1)}>
            취소
          </button>
          <button className="edit-save-btn" onClick={handleSubmit}>
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
}
