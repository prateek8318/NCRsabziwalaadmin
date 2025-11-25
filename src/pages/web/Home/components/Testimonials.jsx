import React from 'react'
import { motion } from "motion/react"

const testimonials = [
    { name: 'Ravi', text: 'I doubled my sales within a month!' },
    { name: 'Anjali', text: 'Easy to use and fast payouts.' },
];

function Testimonials() {
    return (
        <>
            <section className="py-16 bg-green-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-10">What Our Vendors Say</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                className="bg-white p-6 rounded-lg shadow"
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.3 }}
                            >
                                <p className="italic mb-4">
                                    "{t.text}"
                                </p>
                                <h4 className="font-semibold">- {t.name}</h4>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Testimonials
