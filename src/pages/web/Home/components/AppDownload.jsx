import React from 'react'
import { motion } from "framer-motion"
import { FaApple, FaGooglePlay, FaRocket, FaStar, FaClock } from "react-icons/fa"

const AppDownload = () => {
    return (
        <section id="download" className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-800 to-green-900 py-28">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-400 rounded-full blur-3xl opacity-20"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <motion.div
                        className="relative z-10"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="text-center lg:text-left">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ type: 'spring' }}
                                className="mb-8 inline-block"
                            >
                                <div className="bg-green-500/20 p-4 rounded-2xl backdrop-blur-sm">
                                    <FaRocket className="text-4xl text-green-300 animate-bounce" />
                                </div>
                            </motion.div>

                            <motion.h2
                                className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-300 to-white bg-clip-text text-transparent"
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                Transform Your<br />Shopping Experience
                            </motion.h2>

                            <motion.p
                                className="text-xl text-green-100 mb-8 max-w-xl mx-auto lg:mx-0"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Join millions of satisfied users enjoying instant delivery, exclusive offers,
                                and seamless grocery shopping.
                            </motion.p>

                            {/* App Badges with Hover Effects */}
                            <motion.div
                                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <a
                                    href="#"
                                    className="group relative overflow-hidden bg-black/30 rounded-2xl p-2 backdrop-blur-sm hover:bg-black/40 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 px-6 py-3">
                                        <FaApple className="text-3xl text-white" />
                                        <div className="text-left">
                                            <span className="text-xs text-green-300">Download on</span>
                                            <p className="text-xl font-semibold text-white">App Store</p>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-green-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </a>

                                <a
                                    href="#"
                                    className="group relative overflow-hidden bg-black/30 rounded-2xl p-2 backdrop-blur-sm hover:bg-black/40 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 px-6 py-3">
                                        <FaGooglePlay className="text-3xl text-white" />
                                        <div className="text-left">
                                            <span className="text-xs text-green-300">Get it on</span>
                                            <p className="text-xl font-semibold text-white">Google Play</p>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-green-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </a>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <div className="flex items-center gap-3">
                                    <FaStar className="text-2xl text-yellow-400" />
                                    <span className="text-2xl font-bold text-white">4.9</span>
                                    <span className="text-green-200">/5 Stars</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaClock className="text-2xl text-green-300" />
                                    <span className="text-2xl font-bold text-white">24/7</span>
                                    <span className="text-green-200">Support</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Phone Mockup with Floating Animation */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', delay: 0.4 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-[4rem] blur-2xl opacity-30 -z-10"></div>
                        <motion.div
                            className="relative mx-auto max-w-sm"
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <div className="overflow-hidden rounded-[3rem] shadow-2xl border-8 border-green-900/50 bg-green-900">
                                <img src="/logo.png" alt="App Mockup" className="w-full h-auto object-cover transform transition-transform duration-300 hover:scale-105" />
                            </div>
                        </motion.div>

                        {/* Floating Elements Around Phone */}
                        <motion.div
                            className="absolute -top-8 -left-8"
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <div className="bg-green-500/20 p-3 rounded-xl backdrop-blur-sm">
                                <img
                                    src="https://cdn.pixabay.com/photo/2016/06/11/15/33/broccoli-1450274_1280.png"
                                    className="w-12 h-12 object-contain"
                                    alt="Vegetables"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            className="absolute -bottom-8 -right-8"
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                        >
                            <div className="bg-green-500/20 p-3 rounded-xl backdrop-blur-sm">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/599/599502.png"
                                    className="w-12 h-12 object-contain"
                                    alt="Delivery"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default AppDownload