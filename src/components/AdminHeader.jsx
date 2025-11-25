import React, { useState, useEffect } from 'react'
import { Avatar, Button, Layout, Dropdown, Space, Typography } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons'
import { FaAngleRight, FaArrowRightToBracket } from 'react-icons/fa6'
import { IoSettingsSharp } from 'react-icons/io5'
import { CgProfile } from 'react-icons/cg'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

const { Header } = Layout
const { Text } = Typography

function AdminHeader({ collapsed, setCollapsed, background, settingData}) {
    const navigate = useNavigate()
    const [currentTime, setCurrentTime] = useState(new Date())
    const { adminLogout } = useAuth(); 

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const items = [
        {
            key: '1',
            label: 'My Account',
            disabled: true,
            className: 'bg-gray-100 text-gray-600 cursor-default'
        },
        {
            type: 'divider',
            className: 'my-2'
        },
        // {
        //     key: '2',
        //     label: (
        //         <div onClick={() => navigate('/settings')} className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
        //             <Space className="flex items-center gap-2">
        //                 <CgProfile className="text-base" />
        //                 <Text>Profile</Text>
        //             </Space>
        //         </div>
        //     )
        // },
        // {
        //     key: '3',
        //     label: (
        //         <div onClick={() => navigate('/settings')} className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
        //             <Space className="flex items-center gap-2">
        //                 <IoSettingsSharp className="text-base" />
        //                 <Text>Settings</Text>
        //             </Space>
        //         </div>
        //     )
        // },
        {
            key: '4',
            label: (
                <div onClick={() => {
                    adminLogout();
                    navigate("/admin/login");
                }} className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
                    <Space className="flex items-center gap-2">
                        <FaArrowRightToBracket className="text-base" />
                        <Text >Logout</Text>
                    </Space>
                </div>
            ),
        },
    ]

    return (
        <Header
            className="admin-header bg-white shadow-md px-6 h-16 z-10"
            style={{ background }}
        >
            <div className="flex justify-between items-center h-full">
                <div className="flex items-center gap-4">
                    <Button
                        type="text"
                        shape="circle"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-xl w-12 h-12 text-blue-600 flex items-center justify-center"
                    />
                    {/* <Text strong className="text-xl text-blue-600 hidden sm:block">{settingData.brandName}</Text> */}
                </div>

                <div className="flex items-center gap-6">
                    <div className="sm:flex flex-col items-end hidden">
                        <Text className="text-sm text-gray-600 font-medium">
                            {currentTime.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                        <Text className="text-base text-blue-600 font-semibold">
                            {currentTime.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </div>

                    <Dropdown menu={{ items }} trigger={['click']}>
                        <div className="flex items-center gap-2 p-2 px-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100">
                            <Avatar
                                size={36}
                                className="bg-blue-600 flex items-center justify-center"
                                icon={<UserOutlined className="text-lg" />}
                            />
                            <Text strong className="text-blue-600 font-semibold">Admin</Text>
                            <FaAngleRight className="text-blue-600 text-sm" />
                        </div>
                    </Dropdown>
                </div>
            </div>
        </Header>
    )
}

export default AdminHeader