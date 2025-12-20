// src/components/PostContent.js

export default function PostContent({ content, files = [] }) {
  // 로컬 서버용 이미지 URL 생성 함수
  const getImageUrl = (file) => {
    const folder = file.createdDate.slice(0, 10); // yyyy-MM-dd
    return `http://13.209.66.16:8080/uploads/community/${folder}/${file.fileName}`;
  };

  return (
    <div className="post-content">
      <p className="post-text">{content}</p>

      {/* 이미지가 여러 개 있을 가능성 */}
      {files.length > 0 && (
        <div className="post-images">
          {files.map((file) => (
            <img
              key={file.uuid}
              src={getImageUrl(file)}
              alt=""
              className="post-image"
            />
          ))}
        </div>
      )}
    </div>
  );
}
