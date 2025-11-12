'use client';

import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';

const BannerWeb = () => {
  const isMobile = useIsMobile();
  return (
    <div className="bg-white dark:bg-black w-full mb-5 p-4">
      <div className="w-full">
        <Swiper
          slidesPerView={isMobile ? 1 : 2}
          spaceBetween={30}
          slidesPerGroupSkip={isMobile ? 1 : 2}
          slidesPerGroup={isMobile ? 1 : 2}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination]}
          className="mySwiper rounded-xl"
        >
          <SwiperSlide>
            <div className="h-[306px] bg-red-400 rounded-xl">
              <Image
                src="https://salt.tikicdn.com/cache/w750/ts/tikimsp/cb/3f/52/5ed5314cabc00d10d36c789df95b4348.png.webp"
                alt="Slide 1"
                layout="fill"
                objectFit="cover"
                className="overflow-hidden rounded-xl"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[306px] bg-red-400 rounded-xl">
              <Image
                src="https://salt.tikicdn.com/cache/w750/ts/tikimsp/a8/2a/88/3ba09c5a662677b72cf8263dbd4ab56e.png.webp"
                alt="Slide 2"
                layout="fill"
                objectFit="cover"
                className="overflow-hidden rounded-xl"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[306px] bg-red-400 rounded-xl">
              <Image
                src="https://salt.tikicdn.com/cache/w750/ts/tikimsp/8c/a7/e5/a95e0e2b29839fad6ade9e67b812dd23.png.webp"
                alt="Slide 3"
                layout="fill"
                objectFit="cover"
                className="overflow-hidden rounded-xl"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[306px] bg-red-400 rounded-xl">
              <Image
                src="https://salt.tikicdn.com/cache/w750/ts/tikimsp/fa/24/87/4daa3133468283a826bb863e733f0ec8.png.webp"
                alt="Slide 4"
                layout="fill"
                objectFit="cover"
                className="overflow-hidden rounded-xl"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[306px] bg-red-400 rounded-xl">
              <Image
                src="https://salt.tikicdn.com/cache/w750/ts/tikimsp/62/65/2f/1382aac2b64e019f76fb155610805826.png.webp"
                alt="Slide 5"
                layout="fill"
                objectFit="cover"
                className="overflow-hidden rounded-xl"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[306px] bg-red-400 rounded-xl">
              <Image
                src="https://salt.tikicdn.com/cache/w750/ts/tikimsp/4e/b2/be/38cddd899e0897b09d7167fccd90a25a.png.webp"
                alt="Slide 6"
                layout="fill"
                objectFit="cover"
                className="overflow-hidden rounded-xl"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};
export default BannerWeb;
