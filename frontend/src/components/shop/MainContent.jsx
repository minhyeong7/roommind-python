import BannerSlider from "../components/BannerSlider";
import "./MainContent.css";

function MainContent() {
  return (
    <div className="main-content">
      <BannerSlider />

      <h3 className="section-title">인기 브랜드</h3>

      <div className="brand-grid">
        <div className="brand-card">브랜드 A</div>
        <div className="brand-card">브랜드 B</div>
        <div className="brand-card">브랜드 C</div>
      </div>
    </div>
  );
}

export default MainContent;
