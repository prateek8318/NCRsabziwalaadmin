import { Button, Form, message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getAllCms, updateCms } from '../../../../services/admin/apiCms';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function PrivacyPolicyPage() {
    const [privacyPolicy, setPrivacyPolicy] = useState('');
    const [data, setData] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const { type } = useParams();

    const fetchCms = async () => {
        try {
            const res = await getAllCms(type);
            setPrivacyPolicy(res.cmsData.privacyPolicy || '');
            setData(res.cmsData);
        } catch (error) {
            message.error('Failed to load CMS data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCms();
    }, []);

    const onFinish = async () => {
        setUpdateLoading(true);

        try {
            await updateCms(data._id, { privacyPolicy });
            message.success('Privacy Policy updated');
        } catch (error) {
            message.error('Error updating Privacy Policy');
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) return <Spin size="large" fullscreen />;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Privacy Policy</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Privacy Policy" required>
                    <CKEditor
                        editor={ClassicEditor}
                        data={privacyPolicy}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setPrivacyPolicy(data);
                        }}
                        config={{
                            placeholder: "Write the privacy policy here...",
                        }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="mt-4"
                        loading={updateLoading}
                    >
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default PrivacyPolicyPage;
