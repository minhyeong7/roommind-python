import MyPageSidebar from "./MyPageSidebar";
import "./MyPageLayout.css";
import { Outlet } from "react-router-dom";

const MyPageLayout = () => {
  return (
    <div className="mypage-container">
      <MyPageSidebar />
      <div className="mypage-content">
        <Outlet />
      </div>
    </div>
  );
};

export default MyPageLayout;
