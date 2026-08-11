import React, { useState, useEffect } from 'react';

import node from '../../assets/food.jpg'
import piss from '../../assets/pii.png'
import piza from '../../assets/pizz.jpg'
import pizza from '../../assets/pizza.jpg'
import wine from '../../assets/wine01.jpg'
import aa from '../../assets/aa.jpg'
import burger from '../../assets/burgerrr.jpg'

const Scroll = () => {

    return (
        <>
            <header className="mt-6 text mb-2">
                <div className="py-5 font-bold text-4xl tracking-widest text-center">
                    Partnerships

                </div>
            </header>
            <div className="flex items-center py-6 ">
                <style>
                    {`
        .marquee {
          --duration: 70s;
          --gap: 0.5rem;
        }
        .marquee__group {
          display: flex;
          gap: var(--gap);
          animation: scroll var(--duration) linear infinite;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% - var(--gap)));
          }
        }
        `}
                </style>
                <div className="flex overflow-hidden marquee">
                    <div className="marquee__group items-center">
                        <div className="border  bg-white shadow-lg flex items-center md:h-72 rounded-md md:w-96  h-40 w-60" >
                            <div className="flex justify-center mx-auto">
                                <img src={piss} alt="" className="w-fit h-fit rounded-md mx-auto" />
                            </div>
                        </div>
                        <div className="border  bg-white shadow-lg flex items-center md:h-72 rounded-md md:w-96  h-40 w-60" >
                            <div className="flex justify-center mx-auto">
                                <img src={pizza} alt="" className="w-fit h-fit rounded-md mx-auto" />
                            </div>
                        </div>
                        <div className="border  bg-white shadow-lg flex items-center md:h-72 rounded-md md:w-96  h-40 w-60" >
                            <div className="flex justify-center mx-auto">
                                <img src={piza} alt="" className="w-fit h-fit rounded-md mx-auto" />
                            </div>
                        </div>
                        <div className="border  bg-white shadow-lg flex items-center md:h-72 rounded-md md:w-96  h-40 w-60" >
                            <div className="flex justify-center mx-auto">
                                <img src={wine} alt="" className="w-fit h-fit rounded-md mx-auto" />
                            </div>
                        </div>
                        
                    </div>

                    <div aria-hidden="true" className="marquee__group">

                        <div className="border  bg-white shadow-lg flex items-center md:h-72 rounded-md md:w-96  h-40 w-60" >
                            <div className="flex justify-center mx-auto">
                                <img src={burger} alt="" className="w-fit h-fit rounded-md mx-auto" />
                            </div>
                        </div>
                        <div className="border  bg-white shadow-lg flex items-center md:h-72 rounded-md md:w-96  h-40 w-60" >
                            <div className="flex justify-center mx-auto">
                                <img src={aa} alt="" className="w-fit h-fit rounded-md mx-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Scroll
