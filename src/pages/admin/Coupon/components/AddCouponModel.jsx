import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  DatePicker,
} from "antd";
import { addCoupon } from "../../../../services/admin/apiCoupon";
import dayjs from "dayjs";
import { disablePastDates } from "../../../../utils/disablePastDates";

const { Option } = Select;

function AddCouponModal({ isModalOpen, handleOk, handleCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      startDate: values.startDate?.toISOString(),
      expiryDate: values.expiryDate?.toISOString(),
    };

    try {
      setLoading(true);
      const res = await addCoupon(payload);

      if (res?.data?.status) {
        message.success(res.data.message || "Coupon created successfully.");
        form.resetFields();
        handleOk();
      } else {
        message.error(res?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to add coupon.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    form.resetFields();
    handleCancel();
  };

  return (
    <Modal
      title="Add Coupon"
      open={isModalOpen}
      onOk={form.submit}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Add Coupon"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Coupon Code"
          name="code"
          normalize={(value) => value?.toUpperCase().trim()}
          rules={[
            { required: true, message: "Please enter the coupon code" },

            // Length validation
            { min: 4, message: "Coupon code must be at least 4 characters" },
            { max: 20, message: "Coupon code cannot exceed 20 characters" },

            // Alphanumeric only (NO spaces, NO special chars)
            {
              pattern: /^[A-Z0-9]+$/,
              message: "Only uppercase letters and numbers are allowed",
            },

            // Custom validator: prevent only-numbers coupon
            () => ({
              validator(_, value) {
                if (!value) return Promise.resolve();

                // Reject only numbers
                if (/^\d+$/.test(value)) {
                  return Promise.reject(
                    new Error("Coupon code cannot contain only numbers")
                  );
                }

                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input placeholder="e.g. SUMMER501" />
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
          label="Minimum Order Amount"
          name="minOrderAmount"
          rules={[
            { required: true, message: "Please enter minimum order amount" },
          ]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="e.g. 5000"
          />
        </Form.Item>

        <Form.Item
          label="Usage Limit"
          name="usageLimit"
          rules={[{ required: true, message: "Please enter the usage limit" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="e.g. 10"
          />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[
            { required: true, message: "Please select a start date" },
            () => ({
              validator(_, value) {
                if (!value) return Promise.resolve();

                if (value.isBefore(dayjs().startOf("day"))) {
                  return Promise.reject(
                    new Error("Start date must be a future date")
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            disabledDate={disablePastDates}
          />
        </Form.Item>

        <Form.Item
          label="Expiry Date"
          name="expiryDate"
          dependencies={["startDate"]}
          rules={[
            { required: true, message: "Please select an expiry date" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const startDate = getFieldValue("startDate");

                if (!value) return Promise.resolve();

                if (value.isBefore(dayjs().startOf("day"))) {
                  return Promise.reject(
                    new Error("Expiry date must be a future date")
                  );
                }

                if (startDate && value.isBefore(startDate, "day")) {
                  return Promise.reject(
                    new Error("Expiry date must be greater than start date")
                  );
                }

                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            disabledDate={disablePastDates}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddCouponModal;
