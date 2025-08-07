import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import slide1 from "../../../assets/img/fpkdl.com_750_uzbek-central-asia-cuisine-concept-assorted-uzbek-food-pilaf-samsa-lagman-manti-shurpa-uzbek-restaurant-concept_114941-585.webp"
import slide2 from '../../../assets/img/fpkdl.com_960_assorted-delicious-grilled-meat-with-vegetable-white-plate-picnic-table-family-bbq-party_135427-2569.webp'
import slide3 from '../../../assets/img/top-view-easy-chicken-kebab-wooden-board-other-stuffs-dark-table.webp'
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Hero = () => {
    return (
        <div className="w-full">
            <Swiper
                spaceBetween={50}
                slidesPerView={1}
                navigation
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination, Autoplay]}
                loop={true}
                className="mySwiper h-[400px] rounded-b-3xl overflow-hidden"
            >
                <SwiperSlide className="w-full h-[400px] bg-green-200">
                    <img
                        src={slide1}
                        alt="Slide 1"
                        className="w-full h-full object-cover"
                    />
                </SwiperSlide>
                <SwiperSlide className="w-full h-[400px] bg-blue-200 flex items-center justify-center text-white text-xl">
                    <img
                        src={slide2}
                        alt="Slide 2"
                        className="w-full h-full object-cover"
                    />
                </SwiperSlide>
                <SwiperSlide className="w-full h-[400px] bg-red-200 flex items-center justify-center text-white text-xl">
                    <img
                        src={slide3}
                        alt="Slide 3"
                        className="w-full h-full object-cover"
                    />
                </SwiperSlide>

            </Swiper>
        </div>
    );
};

export default Hero;
