import { Breadcrumb, Col, Radio, Row, Space, Tabs } from 'antd'
import React, { useState } from 'react'
import Profile from './components/Profile'
import ChangePassword from './components/ChangePassword'
import Charges from './components/Charges'
import { Link } from 'react-router'

function Settings() {

    return (
        <>
            <Tabs
                tabPosition="top"
                items={[
                    {
                        label: 'Profile',
                        key: '1',
                        children: <Profile />,
                    },
                    {
                        label: 'Change Password',
                        key: '2',
                        children: <ChangePassword />,
                    },
                    {
                        label: 'Site Setting',
                        key: '3',
                        children: <Charges />,
                    }
                ]}
            />
        </>
    )
}

export default Settings
