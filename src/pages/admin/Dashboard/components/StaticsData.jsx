import React from 'react';
import { Spin, Statistic } from 'antd';
import CountUp from 'react-countup';
import { motion } from 'motion/react';
import { RiAdvertisementLine, RiUserLine, RiStoreLine, RiRestaurantLine, RiShoppingBasketLine, RiFolderLine, RiStackLine } from 'react-icons/ri';

function StaticsData({ data, loading }) {
    const formatter = value => <CountUp end={value} separator="," />;

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const staticData = [
        { name: "Banner", icon: <RiAdvertisementLine />, count: data.banner || 10, color: "#6366f1" },
        { name: "Category", icon: <RiFolderLine />, count: data.category, color: "#10b981" },
        { name: "Sub Category", icon: <RiStackLine />, count: data.subCategory, color: "#f59e0b" },
        { name: "Product", icon: <RiStoreLine />, count: data.products || 3, color: "#3b82f6" },
        { name: "Total Order", icon: <RiStoreLine />, count: data.order || 10, color: "#3b82f6" },
        { name: "User", icon: <RiUserLine />, count: data.user || 100, color: "#ec4899" },
    ];

    if (loading) return <Spin size='large' />

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 p-4">
            {staticData.map((data, index) => (
                <motion.div
                    key={data.name}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    className="relative group overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <div
                        className="absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                        style={{ backgroundColor: data.color }}
                    />

                    <div className="p-6 flex flex-col items-center">
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center mb-4 text-2xl"
                            style={{
                                backgroundColor: `${data.color}20`,
                                color: data.color
                            }}
                        >
                            {data.icon}
                        </div>

                        <Statistic
                            title={<span className="text-gray-600 dark:text-gray-300">{data.name}</span>}
                            value={data.count}
                            formatter={formatter}
                            valueStyle={{
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                color: data.color
                            }}
                            className="text-center"
                        />

                        <div
                            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r transition-all duration-500"
                            style={{
                                backgroundImage: `linear-gradient(to right, ${data.color}00, ${data.color}, ${data.color}00)`,
                                opacity: 0.3
                            }}
                        />
                    </div>
                </motion.div>
            ))}

            {/* Animated Background Card */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {staticData.map((data) => (
                    <div
                        key={data.name}
                        className="absolute w-48 h-48 rounded-full blur-3xl opacity-10 -z-1"
                        style={{
                            backgroundColor: data.color,
                            top: `${Math.random() * 80}%`,
                            left: `${Math.random() * 80}%`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default StaticsData;