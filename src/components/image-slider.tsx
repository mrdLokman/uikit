"use client"

import {Swiper, SwiperSlide} from "swiper/react";
import type SwiperType from "swiper";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import {useEffect, useState} from "react";
import {Pagination} from "swiper/modules";
import {cn} from "@/lib/utils";
import {ChevronLeft, ChevronRight} from "lucide-react";

type ImageSliderProps = {
    urls : string[],
}
export const ImageSlider = ({urls}: ImageSliderProps) =>{

    const [swiper, setSwiper] = useState<null | SwiperType>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const [slideConfig, setSlideConfig] = useState({
        isBeginning: true,
        isEnd: activeIndex === (urls.length ?? 0) - 1
    });

    useEffect(()=>{
        swiper?.on("slideChange", ({activeIndex})=>{
            setActiveIndex(activeIndex);
            setSlideConfig({
                isBeginning: activeIndex===0,
                isEnd: activeIndex === (urls.length ?? 0) - 1
            });
        })
    }, [swiper, urls]);

    const activeButtonStyle = "active:scale-[0.97] grid opacity-100 hover-scale-105 absolute top-1/2 -translate-y-1/2 aspect-square w-8 h-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300";
    const inactiveButtonStyle = "hidden text-gray-400"

    return (
        <div className="group relative bg-zinc-100 aspect-square overflow-hidden rounded-xl">
            <div className="absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition">
                <button
                    className={cn(activeButtonStyle, "right-3 transition", {
                        [inactiveButtonStyle] : slideConfig.isEnd,
                        "hover:bg-primary-300 text-primary-800 opacity-100": !slideConfig.isEnd,
                    })}
                    onClick={(e)=>{
                        e.preventDefault();
                        swiper?.slideNext();
                    }}
                    aria-label="next icon"
                >
                    <ChevronRight className="text-zinc-700 h-4 w-4"/>
                </button>

                <button
                    className={cn(activeButtonStyle, "left-3 transition", {
                        [inactiveButtonStyle] : slideConfig.isBeginning,
                        "hover:bg-primary-300 text-primary-800 opacity-100": !slideConfig.isBeginning,
                    })}
                    onClick={(e)=>{
                        e.preventDefault();
                        swiper?.slidePrev();
                    }}
                    aria-label="previous icon"
                >
                    <ChevronLeft className="text-zinc-700 h-4 w-4"/>
                </button>
            </div>

            <Swiper
                pagination={{
                    renderBullet: (_, className)=>{
                        return `<span class='rounded-full transition ${className}'></span>`
                    }
                }}
                onSwiper={setSwiper}
                className="h-full w-full"
                spaceBetween={50}
                modules={[Pagination]}
                slidesPerView={1}
            >
                {urls.map((url, index)=>(
                    <SwiperSlide key={index} className="-z-10 h-full w-full">
                        <Image
                            src={url}
                            alt="product image"
                            fill
                            loading="eager"
                            className="-z-10 w-full h-full object-cover object-center"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}