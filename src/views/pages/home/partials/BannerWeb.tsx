'use client';

import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const BannerWeb = () => {
  return (
    <div className="bg-white dark:bg-black w-full mb-5 p-4">
      <div className="w-full">
        <Swiper
          slidesPerView={2}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="h-[306px] bg-red-400 rounded-xl">Slide 1</div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[306px] bg-red-400 rounded-xl">Slide 2</div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[306px] bg-red-400 rounded-xl">Slide 3</div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[306px] bg-red-400 rounded-xl">Slide 4</div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[306px] bg-red-400 rounded-xl">Slide 5</div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[306px] bg-red-400 rounded-xl">Slide 6</div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[306px] bg-red-400 rounded-xl">Slide 7</div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[306px] bg-red-400 rounded-xl">Slide 8</div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[306px] bg-red-400 rounded-xl">Slide 9</div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};
export default BannerWeb;
