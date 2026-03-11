import React, { useState } from 'react';
import { Modal, Form, Input, Select, message, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { addDriver } from '../../../../services/admin/apiDrivers';

const { Option } = Select;

function AddDriverModal({ isModalOpen, handleOk, handleCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleImageUpload = async ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      if (!file.type.startsWith('image/')) {
        message.error('Only image files are allowed.');
        setFileList([]);
        form.setFieldsValue({ image: null });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        form.setFieldsValue({ image: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      form.setFieldsValue({ image: null });
    }
  };

  const handleSubmit = async (values) => {
    // console.log(values);
    // return
    const payload = {
      name: values.name,
      vehicleType: values.vehicleType,
      vehicleModel: values.vehicleModel,
      registrationNumber: values.registrationNumber,
      licenseNumber: values.licenseNumber,
      image: values.image || '',
      status: 'active',
    };

    try {
      setLoading(true);
      const res = await addDriver(payload);

      if (res?.status) {
        message.success(res.message || 'Driver created successfully.');
        form.resetFields();
        setFileList([]);
        handleOk();
      } else {
        message.error(res?.message || 'Something went wrong.');
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to add driver.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Driver"
      open={isModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setFileList([]);
        handleCancel();
      }}
      confirmLoading={loading}
      okText="Add Driver"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Driver Name"
          name="name"
          normalize={(value) => value?.trim()}
          rules={[
            { required: true, message: 'Please enter driver name' },
            { min: 3, message: 'Driver name must be at least 3 characters' },
            { max: 50, message: 'Driver name cannot exceed 50 characters' },
            { pattern: /^[A-Za-z0-9 ]+$/, message: 'Only letters, numbers and spaces are allowed' }
          ]}
        >
          <Input placeholder="e.g. Shyam" />
        </Form.Item>

        <Form.Item
          label="Vehicle Type"
          name="vehicleType"
          rules={[{ required: true, message: 'Please select vehicle type' }]}
        >
          <Select placeholder="Select vehicle type">
            <Option value="Bike">Bike</Option>
            <Option value="Car">Car</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Vehicle Model"
          name="vehicleModel"
          normalize={(value) => value?.trim()}
          rules={[
            { required: true, message: 'Please enter vehicle model' },
            { min: 2, message: 'Vehicle model must be at least 2 characters' }
          ]}
        >
          <Input placeholder="e.g. Hero" />
        </Form.Item>

        <Form.Item
          label="Registration Number"
          name="registrationNumber"
          normalize={(value) => value?.trim()}
          rules={[
            { required: true, message: 'Please enter registration number' },
            { pattern: /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/i, message: 'Invalid registration number format (e.g. MH01XY1234)' }
          ]}
        >
          <Input placeholder="e.g. MH01XY1234" />
        </Form.Item>

        <Form.Item
          label="License Number"
          name="licenseNumber"
          normalize={(value) => value?.trim()}
          rules={[
            { required: true, message: 'Please enter license number' },
            { min: 5, message: 'License number must be at least 5 characters' }
          ]}
        >
          <Input placeholder="e.g. DL-87654321" />
        </Form.Item>

        <Form.Item label="Driver Image" name="image">
          <Upload
            beforeUpload={() => false}
            onChange={handleImageUpload}
            fileList={fileList}
            accept="image/*"
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddDriverModal;
