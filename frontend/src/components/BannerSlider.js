import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules"; // ✅ Navigation 추가
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; // ✅ 네비게이션 버튼 CSS 추가
import "./BannerSlider.css";


function BannerSlider() {
  return (
    <div className="banner-container">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        navigation={true}
        loop
      >
        <SwiperSlide><img src="/images/banner01.avif" alt="배너1" /></SwiperSlide>
        <SwiperSlide><img src="/images/banner02.avif" alt="배너2" /></SwiperSlide>
        <SwiperSlide><img src="/images/banner03.avif" alt="배너3" /></SwiperSlide>
        <SwiperSlide><img src="/images/banner04.avif" alt="배너4" /></SwiperSlide>
        <SwiperSlide><img src="/images/banner05.avif" alt="배너5" /></SwiperSlide>
      </Swiper>
    </div>
  );
}

export default BannerSlider;
