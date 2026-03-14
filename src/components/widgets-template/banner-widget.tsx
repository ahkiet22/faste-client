import { Widget } from '@/types/widget';
import Image from 'next/image';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

interface BannerWidgetProps {
  widget: Widget;
}

export default function BannerWidget({ widget }: BannerWidgetProps) {
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        slidesPerGroupSkip={1}
        slidesPerGroup={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper rounded-xl"
      >
        {widget.viewConfig
          ? widget.viewConfig.images.map((image: string, index: number) => (
              <SwiperSlide key={index}>
                <div className="h-[500px] bg-red-400 rounded-xl">
                  <Image
                    src={
                      image
                        ? image
                        : 'https://salt.tikicdn.com/cache/w750/ts/tikimsp/cb/3f/52/5ed5314cabc00d10d36c789df95b4348.png.webp'
                    }
                    alt="Slide 1"
                    fill
                    sizes="100vw"
                    className="overflow-hidden rounded-xl object-cover"
                  />
                </div>
              </SwiperSlide>
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <SwiperSlide key={index}>
                <div className="h-[500px] bg-red-400 rounded-xl">
                  <Image
                    src={
                      'https://salt.tikicdn.com/cache/w750/ts/tikimsp/cb/3f/52/5ed5314cabc00d10d36c789df95b4348.png.webp'
                    }
                    alt="Slide 1"
                    fill
                    sizes="100vw"
                    className="overflow-hidden rounded-xl object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
    </>
  );
}
