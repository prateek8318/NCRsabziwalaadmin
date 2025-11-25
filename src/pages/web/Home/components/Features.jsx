import React from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiShield, FiPackage, FiShoppingCart, FiMapPin, FiHeadphones } from 'react-icons/fi';

const features = [
    { title: 'Wide Product Variety', icon: <FiShoppingCart />, color: 'from-green-400 to-green-600', description: 'Choose from a vast selection of fresh fruits, vegetables, and groceries.' },
    { title: 'Fast Home Delivery', icon: <FiTruck />, color: 'from-blue-400 to-blue-600', description: 'Get your groceries delivered to your doorstep quickly and efficiently.' },
    { title: 'Real-Time Tracking', icon: <FiMapPin />, color: 'from-red-400 to-red-600', description: 'Track your delivery in real-time and know exactly when your groceries will arrive.' },
    { title: 'Secure Payments', icon: <FiShield />, color: 'from-yellow-400 to-yellow-600', description: 'Enjoy secure and hassle-free payment options for a seamless checkout experience.' },
    { title: 'Order Tracking', icon: <FiPackage />, color: 'from-pink-400 to-pink-600', description: 'Easily track the status of your orders from placement to delivery.' },
    { title: 'Dedicated Support', icon: <FiHeadphones />, color: 'from-cyan-400 to-cyan-600', description: 'Access our dedicated support team for any assistance you need with your orders.' },
];

function Features() {
    return (
        <section className="relative py-20 bg-gradient-to-b from-green-900 to-green-950 overflow-hidden" id="features">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-green-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-green-600 rounded-full blur-3xl opacity-20"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-300 to-white bg-clip-text text-transparent mb-4">
                        Powerful Features
                    </h2>
                    <p className="text-xl text-green-200 max-w-2xl mx-auto">
                        Everything you need for fresh and fast grocery delivery right to your doorstep
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            whileHover={{ y: -10 }}
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl -z-10" />
                            <div className="h-full bg-green-800/30 backdrop-blur-sm rounded-xl p-6 border border-green-700/30 hover:border-green-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl">
                                <motion.div
                                    className={`flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} text-white`}
                                    whileHover={{ rotate: 15, scale: 1.1 }}
                                    transition={{ type: 'spring' }}
                                >
                                    <div className="text-3xl">
                                        {item.icon}
                                    </div>
                                </motion.div>
                                <h3 className="text-xl font-semibold text-green-100 mb-2">{item.title}</h3>
                                <p className="text-green-300 text-sm">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Floating decoration */}
                <motion.div
                    className="absolute top-1/4 left-10 opacity-20"
                    animate={{ y: [-20, 20, -20] }}
                    transition={{ duration: 8, repeat: Infinity }}
                >
                    <div className="w-32 h-32 bg-green-500 rounded-full blur-xl" />
                </motion.div>
            </div>
        </section>
    );
}

export default Features;
