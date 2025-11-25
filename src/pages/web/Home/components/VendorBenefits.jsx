import React from 'react'
import { motion } from "motion/react"

const benefits = [
    'Easy Onboarding & Dashboard',
    'Custom Commission Settings',
    'Fast Payouts',
    'Dedicated Support',
];

function VendorBenefits() {
    return (
        <>
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-10">Benefits for Vendors</h2>
                    <ul className="space-y-4 max-w-xl mx-auto">
                        {benefits.map((text, i) => (
                            <motion.li
                                key={i}
                                className="flex items-center"
                                initial={{ x: -50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.2 }}
                            >
                                <span className="text-green-500 mr-3">✔️</span>{text}
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    )
}

export default VendorBenefits
