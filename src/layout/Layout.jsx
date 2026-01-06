import { Outlet } from "react-router";
import Header from "../components/web/Header";
import Footer from "../components/web/Footer";
import { useEffect, useState } from "react";
import { message } from 'antd'
import { getAllSettings } from "../services/apiSettings";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Layout = () => {
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

    return <>
        <title>NCR Sabziwala</title>
        <div className="font-sans text-gray-800">
            <Header data={settingData} loading={loading} />
            <Outlet />
            <Footer data={settingData} />
        </div>
    </>
}

export default Layout;