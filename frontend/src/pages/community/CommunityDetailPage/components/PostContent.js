export default function PostContent({ content, image }) {
  return (
    <div className="post-content">
      {image && <img src={image} className="post-image" alt="post-img" />}
      <p>{content}</p>
    </div>
  );
}
