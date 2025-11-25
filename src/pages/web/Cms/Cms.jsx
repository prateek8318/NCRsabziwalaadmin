import React, { useEffect, useState } from 'react'
import Header from '../../../components/web/Header'
import { getAllSettings } from '../../../services/apiSettings';
import Footer from '../../../components/web/Footer';
import { useParams } from 'react-router';
import { message } from 'antd';
const BASE_URL = import.meta.env.VITE_BASE_URL;

function Cms() {
    const [settingData, setSettingData] = useState({})
    const [loading, setLoading] = useState(true);
    // const [imageUrl, setImageUrl] = useState();

    const { page } = useParams();
    let data;
    let pageName;
    if (page == 'term') {
        pageName = "Term and Conditions";
        data = settingData.termAndConditions;
    } else if (page == 'privacy') {
        pageName = "Privacy policy";
        data = settingData.privacyPolicy
    } else {
        pageName = "Return & Refund Policy";
        data = settingData.refundPolicy
    }

    const fetchSetting = async () => {
        try {
            const data = await getAllSettings();
            setSettingData(data.data.settings[0])
            // setImageUrl(`${BASE_URL}/${data.data.settings[0].logo}`)
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
            <Header data={settingData} loading={loading} />
            <div className='p-2 m-2'>
                <h1 className='text-3xl my-2'>{pageName}</h1>
                {/* <pre>{data}</pre> */}
                <div className="whitespace-pre-line">{data}</div>
            </div>
            <Footer data={settingData} />
        </>
    )
}

export default Cms
