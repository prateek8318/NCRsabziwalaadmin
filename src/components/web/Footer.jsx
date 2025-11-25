import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiFileText, FiShield, FiArrowUpRight } from 'react-icons/fi';
import { CiLocationOn } from "react-icons/ci";
import { Link } from 'react-router';
const MotionLink = motion.create(Link);

function Footer({ data }) {
    return (
        <footer className="bg-gradient-to-b from-green-900 to-green-950 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            {/* <div className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center">
                                <span className="text-2xl font-bold text-green-900">GR</span>
                                <img src="" alt="" />
                            </div> */}
                            <h2 className="text-2xl font-bold text-green-300">{data.brandName}</h2>
                        </div>
                        <p className="text-sm text-green-100 leading-relaxed">
                            Revolutionizing food & grocery commerce through technology and community empowerment.
                        </p>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-green-200 flex items-center gap-2">
                            <FiFileText className="text-green-400" />
                            Resources
                        </h3>
                        <ul className="space-y-3">
                            {[
                                // { label: 'Vendor Portal', href: '#vendors' },
                                { label: 'Help Center', href: '#help' },
                                { label: 'Blog', href: '#blog' },
                                { label: 'Careers', href: '#careers' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <motion.a
                                        href={item.href}
                                        className="flex items-center gap-2 text-sm text-green-100 hover:text-green-300 group transition-colors"
                                        whileHover={{ x: 5 }}
                                    >
                                        <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item.label}
                                    </motion.a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Legal */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-green-200 flex items-center gap-2">
                            <FiShield className="text-green-400" />
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            {[
                                // { label: 'Terms of Service', href: '/cms/term' },
                                // { label: 'Privacy Policy', href: '/cms/privacy' },
                                // { label: 'Return Policy', href: '/cms/returnPolicy' },
                                { label: 'Terms of Service', href: '#' },
                                { label: 'Privacy Policy', href: '#' },
                                { label: 'Return Policy', href: '#' },
                            ].map((item) => (
                                <li key={item.label}>
                                    {/* <motion.a
                                        href={item.href}
                                        className="flex items-center gap-2 text-sm text-green-100 hover:text-green-300 group transition-colors"
                                        whileHover={{ x: 5 }}
                                    >
                                        <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item.label}
                                    </motion.a> */}
                                    <MotionLink
                                        to={item.href}
                                        className="flex items-center gap-2 text-sm text-green-100 hover:text-green-300 group transition-colors"
                                        whileHover={{ x: 5 }}
                                    >
                                        <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item.label}
                                    </MotionLink>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-green-200 flex items-center gap-2">
                            <FiMail className="text-green-400" />
                            Contact
                        </h3>
                        <div className="space-y-3">
                            <motion.a
                                href={`mailto:${data.email}`}
                                className="flex items-center gap-2 text-sm text-green-100 hover:text-green-300 transition-colors"
                                whileHover={{ x: 5 }}
                            >
                                <FiMail className="flex-shrink-0" />
                                {data.email}
                            </motion.a>
                            <motion.a
                                href={`tel:+91${data.mobile}`}
                                className="flex items-center gap-2 text-sm text-green-100 hover:text-green-300 transition-colors"
                                whileHover={{ x: 5 }}
                            >
                                <FiPhone className="flex-shrink-0" />
                                +91 {data.mobile}
                            </motion.a>
                            <motion.p
                                className="flex items-center gap-2 text-sm text-green-100 hover:text-green-300 transition-colors"
                                whileHover={{ x: 5 }}
                            >
                                <CiLocationOn className="flex-shrink-0" />
                                {data.address}
                            </motion.p>
                        </div>
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="border-t border-green-700/50 mb-8" />

                {/* Bottom Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="flex flex-col md:flex-row justify-between items-center gap-4 text-center"
                >
                    <div className="text-xs text-green-300">
                        © {new Date().getFullYear()} {data.brandName}. All rights reserved.
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.a
                            href="#"
                            className="text-green-300 hover:text-green-100 transition-colors"
                            whileHover={{ scale: 1.1 }}
                        >
                            <span className="sr-only">Twitter</span>
                            🐦
                        </motion.a>
                        <motion.a
                            href="#"
                            className="text-green-300 hover:text-green-100 transition-colors"
                            whileHover={{ scale: 1.1 }}
                        >
                            <span className="sr-only">Facebook</span>
                            📘
                        </motion.a>
                        <motion.a
                            href="#"
                            className="text-green-300 hover:text-green-100 transition-colors"
                            whileHover={{ scale: 1.1 }}
                        >
                            <span className="sr-only">Instagram</span>
                            📸
                        </motion.a>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Element */}
            {/* <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-900/30 to-transparent" /> */}
        </footer>
    );
}

export default Footer;