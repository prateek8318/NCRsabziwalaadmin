import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Switch,
  Row,
  Col,
  Card,
  Divider,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { addProduct } from "../../../services/admin/apiProduct";
import {
  getAllCategory,
  getAllSubCategory,
} from "../../../services/apiCategory";
import { useNavigate } from "react-router";

const { Option } = Select;

const AddProduct = () => {
  const [form] = Form.useForm();
  const [productImages, setProductImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const categoryList = await getAllCategory();
        const subCategoryList = await getAllSubCategory();
        setCategories(categoryList);
        setSubCategories(subCategoryList);
      } catch (err) {
        console.error(err);
        message.error("Failed to load categories or subcategories");
      }
    };
    fetchMetaData();
  }, []);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    form.setFieldsValue({ subcategory: undefined });
  };

  const handleFinish = async (values) => {
    try {
      const formData = new FormData();

      formData.append("title", values.name);
      formData.append("description", values.description || "");
      formData.append("categoryId", values.category);
      formData.append("subCategoryId", values.subcategory);
      formData.append("tags", JSON.stringify(values.tags || []));
      formData.append("isDealOfTheDay", values.isDealOfTheDay);
      formData.append("isAvailable", values.isAvailable);
      formData.append("isReturnAvailable", values.isReturn || false);
      formData.append("isFavorite", values.isFavorite || false);
      formData.append("isRecommended", values.isRecommended || false);
      formData.append("isFeatured", values.isFeatured || false);

      formData.append(
        "details",
        JSON.stringify({
          nutrientValue: values.nutrientValue || "",
          about: values.about || "",
          description: values.description || "",
        })
      );

      formData.append(
        "info",
        JSON.stringify({
          shelfLife: values.shelfLife || "",
          returnPolicy: values.returnPolicy || "",
          storageTips: values.storageTips || "",
          country: values.countryOfOrigin || "",
          help: values.customerCare || "",
          disclaimer: values.disclaimer || "",
          seller: values.seller || "",
          fssai: values.sellerFssai || "",
        })
      );

      productImages.forEach((file) => {
        formData.append("images", file.originFileObj);
      });

      await addProduct(formData);
      message.success("Product submitted successfully.");
      form.resetFields();
      setProductImages([]);
      setSelectedCategory(null);
      setTimeout(() => {
        navigate(-1);
      }, 200);
    } catch (err) {
      console.error(err);
      message.error("Product submission failed.");
    }
  };

  return (
    <div className="p-6">
      <Card
        title="Add New Product"
        className="shadow rounded-xl"
        style={{ backgroundColor: "oklch(98.5% 0 0)" }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleFinish}
          initialValues={{ isDealOfTheDay: false, isAvailable: true }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Product Name"
                // normalize={(value) => value?.trim()}
                rules={[
                  { required: true, message: "Please enter product name!" },

                  // Length checks
                  {
                    min: 3,
                    message: "Product name must be at least 3 characters",
                  },
                  {
                    max: 80,
                    message: "Product name cannot exceed 80 characters",
                  },

                  // Allowed characters
                  {
                    pattern: /^[A-Za-z0-9 ]+$/,
                    message: "Only letters, numbers and spaces are allowed",
                  },

                  // Custom validations
                  () => ({
                    validator(_, value) {
                      if (!value) return Promise.resolve();

                      // Only numbers
                      if (/^\d+$/.test(value)) {
                        return Promise.reject(
                          new Error("Product name cannot contain only numbers")
                        );
                      }

                      // Only spaces
                      if (!value.trim()) {
                        return Promise.reject(
                          new Error(
                            "Product name cannot be empty or spaces only"
                          )
                        );
                      }

                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input
                  placeholder="e.g., Organic Basmati Rice"
                  maxLength={80}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tags" label="Tags">
                <Select mode="tags" placeholder="e.g., organic, rice" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select category"
                  onChange={handleCategoryChange}
                >
                  {categories.map((cat) => (
                    <Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="subcategory"
                label="Subcategory"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select subcategory">
                  {subCategories
                    .filter((sub) => sub.cat_id?._id === selectedCategory)
                    .map((sub) => (
                      <Option key={sub._id} value={sub._id}>
                        {sub.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Main Product Images">
            <ImgCrop
              rotationSlider
              aspect={1}
              quality={1}
              modalTitle="Crop Image"
              grid
            >
              <Upload
                listType="picture"
                fileList={productImages}
                onChange={({ fileList }) => setProductImages(fileList)}
                beforeUpload={() => false}
                multiple
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </ImgCrop>
            <div style={{ fontSize: "12px", color: "#888" }}>
              Recommended Size: <strong>150 x 150 px</strong>
            </div>
          </Form.Item>

          <Divider>Product Details</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="nutrientValue" label="Nutrient Value">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="about" label="About the Product">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Divider>Product Info</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="shelfLife" label="Shelf Life">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="returnPolicy" label="Return Policy">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="storageTips" label="Storage Tips">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="countryOfOrigin" label="Country of Origin">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="customerCare" label="Customer Care Details">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="disclaimer" label="Disclaimer">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="seller" label="Seller Name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sellerFssai" label="Seller FSSAI No.">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="isDealOfTheDay"
                label="Deal of the Day"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="isAvailable"
                label="Available"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="isReturn"
                label="Return Available"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="isFavorite"
                label="Favorite"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="isFeatured"
                label="Featured"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="isRecommended"
                label="Recommended"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              Submit Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProduct;
