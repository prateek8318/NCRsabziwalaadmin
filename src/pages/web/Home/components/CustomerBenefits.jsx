import React from 'react'
import { motion } from "motion/react"

const benefitsCust = [
    'Wide Variety of Products',
    'Fast Home Delivery',
    'Secure Payments',
    'Order Tracking',
];

function CustomerBenefits() {
    return (
        <>
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-10">Why Customers Love Us</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        {benefitsCust.map((text, i) => (
                            <motion.div
                                key={i}
                                className="flex items-center p-4 border rounded-lg"
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.3 }}
                            >
                                <span className="text-green-500 mr-3">✔️</span>
                                <p className="font-medium">{text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default CustomerBenefits
