import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const EditExploreModal = ({
  isModalOpen,
  handleOk,
  handleCancel,
  exploreData = {},
  onSubmit
}) => {
  const [form] = Form.useForm();
  const [iconUrl, setIconUrl] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    if (exploreData) {
      form.setFieldsValue({
        name: exploreData.name,
        couponCode: exploreData.couponCode,
      });
      setIconUrl(exploreData.icon ? `${BASE_URL}/${exploreData.icon}` : null);
      setBannerUrl(exploreData.bannerImg ? `${BASE_URL}/${exploreData.bannerImg}` : null);
    }
  }, [exploreData, form]);

  const beforeUpload = (file) => {
    const isValid = ['image/jpeg', 'image/png'].includes(file.type);
    if (!isValid) {
      message.error('Only JPG/PNG files are allowed!');
      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('Image must be smaller than 10MB!');
      return false;
    }
    return false;
  };

  const handleImageChange = useCallback((setter, fieldName) => (info) => {
    const file = info.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setter(reader.result);
      reader.readAsDataURL(file);
      form.setFieldsValue({ [fieldName]: file });
    }
  }, [form]);

  const handleFinish = (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    if (values.couponCode) formData.append('couponCode', values.couponCode);
    if (values.icon) formData.append('icon', values.icon);
    if (values.banner) formData.append('banner', values.banner);

    onSubmit(exploreData._id, formData);
  };

  const renderUpload = (imageUrl, onChangeHandler) => (
    <Upload
      listType="picture-card"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={onChangeHandler}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="upload"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      )}
    </Upload>
  );

  return (
    <Modal
      title="Edit Explore"
      open={isModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setIconUrl(null);
        setBannerUrl(null);
        handleCancel();
      }}
      okText="Update"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Explore Name"
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input placeholder="e.g. Hot Deals" />
        </Form.Item>

        <Form.Item name="couponCode" label="Coupon Code">
          <Input placeholder="e.g. SAVE20" />
        </Form.Item>

        <Form.Item label="Icon Image" name="icon" valuePropName="file">
          {renderUpload(iconUrl, handleImageChange(setIconUrl, 'icon'))}
        </Form.Item>

        <Form.Item label="Banner Image" name="banner" valuePropName="file">
          {renderUpload(bannerUrl, handleImageChange(setBannerUrl, 'banner'))}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditExploreModal;
