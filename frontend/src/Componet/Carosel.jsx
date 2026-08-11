import React, { useState, useEffect } from 'react';
import { Carousel } from "@material-tailwind/react";
import img1 from '../assets/menu2.jpg';
import img2 from '../assets/menu3.jpg';
import img3 from '../assets/menu.jpg';
const img4  ="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80"
const img5 = "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"
const img6 = "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80"

const CarouselCustomNavigation = () => {
    const slider = [img1, img2, img3, img4, img5, img6];
    const [activeIndex, setActiveIndex] = useState(0);


    
    const next = () => setActiveIndex((activeIndex + 1) % slider.length);
    const prev = () => setActiveIndex((activeIndex - 1 + slider.length) % slider.length);

    useEffect(() => {
        const interval = setInterval(next, 8000);
        return () => clearInterval(interval);
    }, [activeIndex]);

    return (
        <Carousel
            autoPlay={true}
            autoPlaySpeed={5000}
            showNavigation={false}
            slideWidth="full"
            slideHeight="500px"
            activeIndex={activeIndex}
            className="h-[500px] w-full object-cover rounded-lg"
            navigation={({ setActiveIndex, activeIndex, length }) => (
                <div className="absolute z-40 flex gap-2 bottom-4 left-2/4 -translate-x-2/4">
                    {new Array(length).fill("").map((_, i) => (
                        <span
                            key={i}
                            className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                                }`}
                            onClick={() => setActiveIndex(i)}
                        />
                    ))}
                </div>
            )}
        >
            {slider.map((url, index) => (
                <img
                    key={index}
                    src={url}
                    alt={`image ${index + 1}`}
                    className="h-[500px] w-full object-cover rounded-lg"
                />
            ))}
        </Carousel>

    );
};

export default CarouselCustomNavigation;
