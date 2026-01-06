import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  message,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
import moment from "moment";
import { updateCoupon } from "../../../../services/admin/apiCoupon";
import { disablePastDates } from "../../../../utils/disablePastDates";
import dayjs from "dayjs";

const { Option } = Select;

function EditCouponModel({ isModalOpen, handleOk, handleCancel, couponData }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (couponData) {
      form.setFieldsValue({
        code: couponData.code,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
        minOrderAmount: couponData.minOrderAmount,
        usageLimit: couponData.usageLimit,
        startDate: couponData.startDate ? moment(couponData.startDate) : null,
        expiryDate: couponData.expiryDate
          ? moment(couponData.expiryDate)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [couponData, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        code: values.code,
        discountType: values.discountType,
        discountValue: values.discountValue,
        minOrderAmount: values.minOrderAmount,
        usageLimit: values.usageLimit,
        startDate: values.startDate?.toISOString(),
        expiryDate: values.expiryDate?.toISOString(),
      };

      await updateCoupon(couponData._id, payload);
      message.success("Coupon updated successfully!");
      handleOk();
    } catch (error) {
      message.error(error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Coupon"
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="Update Coupon"
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
          <Input />
        </Form.Item>

        <Form.Item
          label="Discount Type"
          name="discountType"
          rules={[{ required: true, message: "Please select discount type!" }]}
        >
          <Select placeholder="Select discount type">
            <Option value="percentage">Percentage</Option>
            <Option value="fixed">Fixed</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Discount Value"
          name="discountValue"
          rules={[{ required: true, message: "Please enter discount value!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Minimum Order Amount"
          name="minOrderAmount"
          rules={[
            { required: true, message: "Please enter minimum order amount!" },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Usage Limit"
          name="usageLimit"
          rules={[{ required: true, message: "Please enter usage limit!" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
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

export default EditCouponModel;
