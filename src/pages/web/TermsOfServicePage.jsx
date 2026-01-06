import { Typography, Divider, message } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getPolicies } from "../../services/webPoliciesApi";
import { LoadingOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const sectionVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.4 },
    }),
};

const TermsOfServicePage = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { cmsData, status } = await getPolicies();
                if (status) {
                    setData(cmsData?.termAndConditions ?? "");
                }
            } catch (error) {
                message.error("Error while fetching policies data!")
            } finally {
                setLoading(false);
            }
        })()
    }, [])

    return (
        <div className="bg-green-50 min-h-screen">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Page Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <Title level={1} className="!text-green-700">
                        Terms of service
                    </Title>
                    <Text type="secondary">
                        Last updated: 10 Dec 2025
                    </Text>
                </motion.div>

                {loading ? <div className="flex justify-center items-center"><LoadingOutlined/></div> : <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
                    <motion.div
                        variants={sectionVariant}
                        initial="hidden"
                        animate="visible"
                        className="mb-6"
                    >
                        <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: data}}/>
                    </motion.div>
                </div>}
                {/* Card */}

            </div>
        </div>
    );
};

export default TermsOfServicePage;