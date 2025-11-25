import React, { useEffect, useState } from 'react';
import { Button, Form, message, Spin } from 'antd';
import { useParams } from 'react-router';
import { getAllCms, updateCms } from '../../../../services/admin/apiCms';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function TermConditions() {
    const [data, setData] = useState('');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [editorData, setEditorData] = useState('');
    const { type } = useParams();

    const fetchCms = async () => {
        try {
            const res = await getAllCms(type);
            setData(res.cmsData);
            setEditorData(res.cmsData.termAndConditions || '');
        } catch (error) {
            message.error('Failed to load CMS Data');
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
            await updateCms(data._id, { termAndConditions: editorData });
            message.success('Terms and Conditions updated');
        } catch {
            message.error('Error updating Terms and Conditions');
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) return <Spin size="large" fullscreen />;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Terms & Conditions</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Content" required>
                    <CKEditor
                        editor={ClassicEditor}
                        data={editorData}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setEditorData(data);
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

export default TermConditions;
