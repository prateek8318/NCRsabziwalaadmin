import { Button, Form, Input, Modal, Select, Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { useEffect } from "react";
import { useState } from "react";
import { updateBanner } from "../../../../services/admin/apiBanner";

const EditBannerModel = ({
  isModalOpen,
  handleOk,
  handleCancel,
  bannerData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [fileList, setFileList] = useState([]);

  // Same sections as AddBannerModel
  const sectionOptions = [
    { value: 'section1', label: 'Section 1' },
    { value: 'section2', label: 'Section 2' },
  ];

  const beforeUpload = (file) => {
    const isPng = file.type === "image/png";
    if (!isPng) {
      message.error("You can only upload PNG files!");
      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Image must be smaller than 10MB!");
      return false;
    }
    return true;
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  useEffect(() => {
    if (bannerData) {
      console.log('Banner data received:', bannerData);
      
      // Handle different possible field names for section
      const sectionValue = bannerData.chooeseSection || bannerData.section || bannerData.chooseSection;
      
      form.setFieldsValue({
        title: bannerData.title,
        image: bannerData.image,
        chooeseSection: sectionValue,
        status: bannerData.status,
      });
      
      // Set image URL for preview
      if (bannerData.image) {
        const fullImageUrl = `${import.meta.env.VITE_BASE_URL}/${bannerData.image}`;
        setImageUrl(fullImageUrl);
        
        // Set fileList for the Upload component
        setFileList([{
          uid: '-1',
          name: 'banner.png',
          status: 'done',
          url: fullImageUrl,
        }]);
      }
      
      console.log('Form fields set:', {
        title: bannerData.title,
        chooeseSection: sectionValue,
        image: bannerData.image
      });
    }
  }, [bannerData, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Updating banner with values:', values);
      console.log('Banner ID:', bannerData._id);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('chooeseSection', values.chooeseSection);
      
      // Handle image upload - use cropped file from fileList if available
      if (fileList.length > 0 && fileList[0].originFileObj) {
        // New cropped image
        formData.append('image', fileList[0].originFileObj);
      } else if (fileList.length > 0 && !fileList[0].originFileObj && bannerData.image) {
        // No new image uploaded, keep existing one
        formData.append('existingImage', bannerData.image);
      }
      
      // Call update API
      const response = await updateBanner(bannerData._id, formData);
      console.log('Update response:', response);
      
      const success = response.data.status === true || response.data.success === true;
      if (success) {
        message.success('Banner updated successfully!');
        handleOk();
      } else {
        message.error(response.data.message || 'Failed to update banner');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      message.error('Failed to update banner');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log('Failed:', errorInfo);
  };

  return (
    <Modal
      title="Edit Banner"
      open={isModalOpen}
      onOk={form.submit}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={form.submit}>
          Update Banner
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="editBanner"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          label="Banner Title"
          name="title"
          // normalize={(value) => value?.trim()}
          rules={[
            { required: true, message: "Please input the banner title!" },

            // Min & Max length
            { min: 3, message: "Banner title must be at least 3 characters" },
            { max: 50, message: "Banner title cannot exceed 50 characters" },

            // Allow letters, numbers & spaces ONLY
            {
              pattern: /^[A-Za-z0-9 ]+$/,
              message: "Only letters, numbers and spaces are allowed",
            },

            // Custom validation
            () => ({
              validator(_, value) {
                if (!value) return Promise.resolve();

                // Reject numbers only
                if (/^\d+$/.test(value)) {
                  return Promise.reject(
                    new Error("Banner title cannot contain only numbers")
                  );
                }

                // Reject only spaces
                if (!value.trim()) {
                  return Promise.reject(
                    new Error("Banner title cannot be empty or spaces only")
                  );
                }

                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input
            placeholder="Enter banner title"
            maxLength={50}
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          label="Choose Section"
          name="chooeseSection"
          rules={[{ required: true, message: "Please select a category!" }]}
        >
          <Select
            showSearch
            placeholder="Choose Section"
            optionFilterProp="label"
            options={sectionOptions}
          />
        </Form.Item>
        <Form.Item label="Category Image" name="image">
          <div>
            <ImgCrop
              rotationSlider
              aspect={320 / 150}
              quality={1}
              modalTitle="Crop your banner"
            >
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={onChange}
                onPreview={onPreview}
                accept="image/png"
                showUploadList={{ showRemoveIcon: true }}
                customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </ImgCrop>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
              <strong>Recommended Size:</strong> 320 x 150 px
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              <strong>Allowed Formats:</strong> PNG (Max 10MB)
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBannerModel;
