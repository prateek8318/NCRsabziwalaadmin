import React, { useState, useCallback } from 'react';
import { Modal, Form, Input, message, Upload, Button, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { addExplore } from '../../../../services/admin/apiExplore';

function AddExploreModal({ isModalOpen, handleOk, handleCancel, fetchExplore }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [iconFileList, setIconFileList] = useState([]);
  const [bannerFileList, setBannerFileList] = useState([]);

  const resetState = useCallback(() => {
    form.resetFields();
    setIconFileList([]);
    setBannerFileList([]);
  }, [form]);

  const handleSubmit = async (values) => {
    if (!iconFileList.length || !bannerFileList.length) {
      return message.error('Icon and banner are required.');
    }

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('couponCode', values.couponCode);
    formData.append('serviceId', values.serviceId);
    formData.append('icon', iconFileList[0].originFileObj);
    formData.append('banner', bannerFileList[0].originFileObj);

    try {
      setLoading(true);
      const res = await addExplore(formData);
      message.success(res.message || 'Explore created successfully.');
      resetState();
      handleOk();
      fetchExplore();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to create explore.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Explore"
      open={isModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        resetState();
        handleCancel();
      }}
      confirmLoading={loading}
      okText="Add Explore"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input placeholder="e.g. Explore Offers" />
        </Form.Item>

        <Form.Item
          label="Coupon Code"
          name="couponCode"
          rules={[{ required: true, message: 'Please enter coupon code' }]}
        >
          <Input placeholder="e.g. SAVE50" />
        </Form.Item>
        <Form.Item name="serviceId" label="Service Type" rules={[{ required: true }]}>
          <Select placeholder="Select service">
            <Option value="67ecc79120a93fc0b92a8b19">Food</Option>
            <Option value="67ecc79a20a93fc0b92a8b1b">Grocery</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Icon" required>
          <Upload
            accept="image/*"
            listType="picture"
            fileList={iconFileList}
            beforeUpload={() => false}
            onChange={({ fileList }) => setIconFileList(fileList)}
            onRemove={() => setIconFileList([])}
          >
            <Button icon={<UploadOutlined />}>Upload Icon</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Banner" required>
          <Upload
            accept="image/*"
            listType="picture"
            fileList={bannerFileList}
            beforeUpload={() => false}
            onChange={({ fileList }) => setBannerFileList(fileList)}
            onRemove={() => setBannerFileList([])}
          >
            <Button icon={<UploadOutlined />} loading={loading}>Upload Banner</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExploreModal;
