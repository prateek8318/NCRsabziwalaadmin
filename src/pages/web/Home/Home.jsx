import React, { useEffect, useState } from 'react'
import Header from '../../../components/web/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import VendorBenefits from './components/VendorBenefits'
import CustomerBenefits from './components/CustomerBenefits'
import AppDownload from './components/AppDownload'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from '../../../components/web/Footer'
import { getAllSettings } from '../../../services/apiSettings'
import { message } from 'antd'
const BASE_URL = import.meta.env.VITE_BASE_URL;

function Home() {

    const [settingData, setSettingData] = useState({})
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState();

    const fetchSetting = async () => {
        try {
            const data = await getAllSettings();
            setSettingData(data.data.settings[0])
            setImageUrl(`${BASE_URL}/${data.data.settings[0].logo}`)
        } catch (error) {
            message.error("Failed to load settings.");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchSetting() }, [])

    return (
        <>
            <title>NCR Sabziwala</title>
            <div className="font-sans text-gray-800">
                <Header data={settingData} loading={loading} />
                <Hero />
                <Features />
                {/* <HowItWorks /> */}
                {/* <VendorBenefits /> */}
                {/* <CustomerBenefits /> */}
                <AppDownload />
                {/* <Testimonials /> */}
                {/* <FAQ /> */}
                {/* <Contact /> */}
                <Footer data={settingData} />
            </div>
        </>
    )
}

export default Home
