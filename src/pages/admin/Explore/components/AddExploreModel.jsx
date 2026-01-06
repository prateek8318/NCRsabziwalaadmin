import React, { useState, useCallback } from "react";
import {
  Modal,
  Form,
  Input,
  message,
  Upload,
  Button,
  Select,
  InputNumber,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { addExplore } from "../../../../services/admin/apiExplore";
import { useFetchProducts } from "../hooks/useFetchProducts";

function AddExploreModal({
  isModalOpen,
  handleOk,
  handleCancel,
  fetchExplore,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const { productLoading, productOptions } = useFetchProducts({
    search: productSearch,
    setSearch: setProductSearch,
    flag: isModalOpen,
  });

  const resetState = useCallback(() => {
    form.resetFields();
    setImageFile([]);
  }, [form]);

  const handleSubmit = async (values) => {
    if (!imageFile.length) {
      return message.error("Image is required!");
    }

    const selectedProducts = values.products || [];

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("exploreId", "68b31d5845a4e5225b56ce18");
    formData.append("image", imageFile[0].originFileObj);
    formData.append("discountType", values.discountType);
    formData.append("discountValue", values.discountValue);

    selectedProducts.forEach((element) => {
      formData.append("products", element);
    });

    try {
      setLoading(true);
      const res = await addExplore(formData);
      message.success(res.message || "Explore created successfully.");
      resetState();
      handleOk();
      fetchExplore();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to create explore."
      );
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
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="e.g. Explore Offers" />
        </Form.Item>

        <Form.Item
          label="Discount Type"
          name="discountType"
          rules={[{ required: true, message: "Please select a discount type" }]}
        >
          <Select placeholder="Select discount type">
            <Option value="percentage">Percentage</Option>
            <Option value="fixed">Fixed</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Discount Value"
          name="discountValue"
          rules={[
            { required: true, message: "Please enter the discount value" },
          ]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="e.g. 80"
          />
        </Form.Item>

        <Form.Item
          label="Products"
          name="products"
          rules={[
            { required: true, message: "Please select at least one product" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Search & select products"
            showSearch
            filterOption={false}
            notFoundContent={productLoading ? <Spin size="small" /> : null}
            onSearch={(value) => setProductSearch(value)}
            loading={productLoading}
            options={productOptions}
            optionFilterProp="label"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Image" required>
          <Upload
            accept="image/*"
            listType="picture"
            fileList={imageFile}
            beforeUpload={() => false}
            onChange={({ fileList }) => setImageFile(fileList)}
            onRemove={() => setImageFile([])}
          >
            <Button icon={<UploadOutlined />} loading={loading}>
              Upload Image
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExploreModal;
