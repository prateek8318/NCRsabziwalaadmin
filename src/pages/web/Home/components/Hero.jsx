import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { EffectCoverflow, Autoplay } from 'swiper/modules';

const slides = [
    'https://cdn.pixabay.com/photo/2016/07/02/22/42/berries-1493905_1280.jpg',
    'https://cdn.pixabay.com/photo/2021/10/02/08/29/pumpkin-6674599_1280.jpg',
    'https://cdn.pixabay.com/photo/2022/09/16/16/09/harvest-7458975_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/02/28/20/59/carrots-2106825_1280.jpg',
];

function Hero() {
    return (
        <section id="home" className="relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-green-700"></div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-green-50/10 backdrop-blur-sm"></div>
                {/* Animated SVG Pattern */}
                <motion.svg
                    viewBox="0 0 100 100"
                    className="absolute top-0 left-0 w-full opacity-10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                    <circle cx="50" cy="50" r="45" stroke="#fff" strokeWidth="2" fill="none" />
                    <path
                        d="M50 5 L55 45 L95 50 L55 55 L50 95 L45 55 L5 50 L45 45 Z"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1"
                    />
                </motion.svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-28 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="text-center lg:text-left">
                            <motion.h1
                                className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                Fresh Groceries,
                                <span className="block text-gray-900">
                                    Delivered Fresh
                                </span>
                            </motion.h1>
                            <motion.p
                                className="text-xl text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Your favorite grocery items at your fingertips.
                                Enjoy the freshest fruits, vegetables, and more delivered to your doorstep!
                            </motion.p>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.6 }}
                            >
                                <a
                                    href="https://play.google.com/store/apps/details?id=NCR Sabziwala.com.users&pcampaignid=web_share"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='cursor-pointer'
                                >
                                    <button className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                        Download App Now
                                        <span className="ml-3">🍎</span>
                                    </button>
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Image Carousel */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="absolute inset-0 bg-green-200/20 rounded-3xl shadow-2xl -rotate-3"></div>
                        <div className="relative rotate-3">
                            <Swiper
                                effect="coverflow"
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView="auto"
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 2.5,
                                    slideShadows: true,
                                }}
                                autoplay={{ delay: 3000 }}
                                loop={true}
                                modules={[EffectCoverflow, Autoplay]}
                                className="swiper-container"
                            >
                                {slides.map((src, index) => (
                                    <SwiperSlide key={index} className="max-w-md rounded-2xl overflow-hidden">
                                        <div className="relative group">
                                            <img
                                                src={src}
                                                alt={`Slide ${index}`}
                                                className="w-full h-96 object-cover transform group-hover:scale-105 transition duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Animated Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-8 h-14 rounded-3xl border-2 border-green-300 flex justify-center p-1">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                </div>
            </motion.div>
        </section>
    );
}

export default Hero;
