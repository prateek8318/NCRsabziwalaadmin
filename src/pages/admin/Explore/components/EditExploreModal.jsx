import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  message,
  Select,
  InputNumber,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useFetchProducts } from "../hooks/useFetchProducts";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const EditExploreModal = ({
  isModalOpen,
  handleOk,
  handleCancel,
  exploreData = {},
  onSubmit,
}) => {
  const [form] = Form.useForm();
  // const [iconUrl, setIconUrl] = useState(null);
  // const [bannerUrl, setBannerUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const { productLoading, productOptions } = useFetchProducts({
    search: productSearch,
    setSearch: setProductSearch,
    flag: isModalOpen,
  });

  useEffect(() => {
    if (exploreData) {
      form.setFieldsValue({
        name: exploreData.name,
        discountType: exploreData.discountType,
        discountValue: exploreData.discountValue,
        products: Array.isArray(exploreData.products)
          ? exploreData.products.map((p) => p._id)
          : [],
      });
      // setIconUrl(exploreData.icon ? `${BASE_URL}/${exploreData.icon}` : null);
      // setBannerUrl(
      //   exploreData.bannerImg ? `${BASE_URL}/${exploreData.bannerImg}` : null
      // );
      setImageUrl(
        exploreData.image ? `${BASE_URL}/${exploreData.image}` : null
      );
    }
  }, [exploreData, form]);

  const beforeUpload = (file) => {
    const isValid = ["image/jpeg", "image/png"].includes(file.type);
    if (!isValid) {
      message.error("Only JPG/PNG files are allowed!");
      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Image must be smaller than 10MB!");
      return false;
    }
    return false;
  };

  const handleImageChange = useCallback(
    (setter, fieldName) => (info) => {
      const file = info.file;
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setter(reader.result);
        reader.readAsDataURL(file);
        form.setFieldsValue({ [fieldName]: file });
      }
    },
    [form]
  );

  const handleFinish = (values) => {
    const selectedProducts = values.products || [];
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("exploreId", "68b31d5845a4e5225b56ce18");
    // if (values.couponCode) formData.append("couponCode", values.couponCode);
    // if (values.icon) formData.append("icon", values.icon);
    // if (values.banner) formData.append("banner", values.banner);
    if (values.image) formData.append("image", values.image);
    if (values.discountType)
      formData.append("discountType", values.discountType);
    if (values.discountValue)
      formData.append("discountValue", values.discountValue);

    selectedProducts.forEach((element) => {
      formData.append("products", element);
    });

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
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
        // setIconUrl(null);
        // setBannerUrl(null);
        setImageUrl(null);
        handleCancel();
      }}
      okText="Update"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Explore Name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="e.g. Hot Deals" />
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

        <Form.Item label="Icon Image" name="icon" valuePropName="file">
          {renderUpload(imageUrl, handleImageChange(setImageUrl, "image"))}
        </Form.Item>

        {/* <Form.Item label="Banner Image" name="banner" valuePropName="file">
          {renderUpload(bannerUrl, handleImageChange(setBannerUrl, "banner"))}
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default EditExploreModal;
