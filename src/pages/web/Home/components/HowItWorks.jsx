import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    { title: 'Download App', desc: 'Get the app from the store and install it on your device.' },
    { title: 'Register', desc: 'Sign up with your details and verify your account.' },
    { title: 'Add Address', desc: 'Enter your delivery address to receive orders.' },
    { title: 'Browse Products', desc: 'Explore a wide range of fresh fruits, vegetables, and groceries.' },
    { title: 'Add to Cart', desc: 'Select your desired items and add them to your cart.' },
    { title: 'Add to Wishlist', desc: 'Save items for later by adding them to your wishlist.' },
    { title: 'Apply Coupons', desc: 'Use available coupons and offers to get discounts on your purchase.' },
    { title: 'Place Order', desc: 'Review your cart and place your order with secure payment options.' },
    { title: 'Track Order', desc: 'Track your order in real-time and get updates on delivery status.' },
    { title: 'Fast Delivery', desc: 'Receive your groceries at your doorstep with fast and reliable delivery.' },
    { title: 'User Wallet', desc: 'Manage your wallet for easy transactions and refunds.' },
];

function HowItWorks() {
    return (
        <section className="py-20 bg-green-50" id="how-it-works">
            <div className="max-w-5xl mx-auto px-6">
                <motion.h2
                    className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    How It Works
                </motion.h2>

                <div className="relative">
                    {/* Curved Line */}
                    <svg className="absolute left-4 top-0 bottom-0 hidden sm:block" width="2" height="100%" viewBox="0 0 2 1000" preserveAspectRatio="none">
                        <path d="M1,0 C1,250 1,750 1,1000" stroke="#9ae39a" strokeWidth="2" fill="none" />
                    </svg>

                    {/* Steps */}
                    <div className="space-y-12 pl-0 sm:pl-16">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="relative bg-white shadow-lg rounded-xl p-6 border-l-4 border-green-600 sm:ml-0"
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                {/* Circle Indicator */}
                                <div className="absolute -left-[36px] top-6 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold shadow-lg">
                                    {index + 1}
                                </div>

                                <h3 className="text-xl font-semibold text-green-800 mb-2">{step.title}</h3>
                                <p className="text-gray-600">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
