import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Descriptions,
  Table,
  Spin,
  message,
  Divider,
  Select,
  Button,
  Space,
  Row,
  Col,
  Tag,
  Dropdown,
  Image,
} from "antd";
import { useParams } from "react-router";
import {
  getOrderDetails,
  updateOrderStatus,
  getAvailableDriversForOrder,
  assignDriverToOrder,
  downloadInvoice,
} from "../../../../services/admin/apiOrder";
import { DownloadOutlined } from "@ant-design/icons";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const { Title, Text } = Typography;
const { Option } = Select;

const OrderDetailsPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const { orderId } = useParams();

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const response = await getOrderDetails(id);
        console.log('Order details response:', response);
        console.log('Order object:', response.order);
        console.log('Complete order keys:', Object.keys(response.order || {}));
        console.log('Driver fields:', {
          assignedDriver: response.order?.assignedDriver,
          driver: response.order?.driver,
          assignedDriverId: response.order?.assignedDriverId,
          driverId: response.order?.driverId
        });
        
        // Check for any other possible driver-related fields
        const orderKeys = Object.keys(response.order || {});
        const driverRelatedKeys = orderKeys.filter(key => 
          key.toLowerCase().includes('driver') || 
          key.toLowerCase().includes('assigned') ||
          key.toLowerCase().includes('delivery')
        );
        console.log('Driver-related keys found:', driverRelatedKeys);
        driverRelatedKeys.forEach(key => {
          console.log(`${key}:`, response.order[key]);
        });
        setOrder(response.order);
        
        // Fetch available drivers for this order
        const driversResponse = await getAvailableDriversForOrder(id);
        setDrivers(driversResponse.data || []);
      } catch (error) {
        message.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData(orderId);
  }, [orderId]);

  const handleAssignDriver = async () => {
    if (!selectedDriver) {
      message.warning("Please select a driver.");
      return;
    }

    setAssigning(true);
    try {
      await assignDriverToOrder(orderId, selectedDriver);
      message.success("Driver assigned successfully!");
      setOrder((prev) => ({
        ...prev,
        assignedDriver: drivers.find((d) => d._id === selectedDriver),
      }));
    } catch (error) {
      // already handled in API
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setStatusUpdateLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrder((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      // Error is already handled in the API function
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusUpdateItems = () => {
    const currentStatus = order.status;
    const statusFlow = {
      'pending': [
        { key: 'processing', label: 'Start Processing', status: 'processing' },
        { key: 'cancelled', label: 'Cancel Order', status: 'cancelled', danger: true }
      ],
      'processing': [
        { key: 'shipped', label: 'Mark as Shipped', status: 'shipped' },
        { key: 'cancelled', label: 'Cancel Order', status: 'cancelled', danger: true }
      ],
      'shipped': [
        { key: 'delivered', label: 'Mark as Delivered', status: 'delivered' }
      ],
      'delivered': [],
      'cancelled': []
    };

    return (statusFlow[currentStatus] || []).map(item => ({
      key: item.key,
      label: item.label,
      danger: item.danger || false,
      onClick: () => handleStatusUpdate(item.status)
    }));
  };

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );
  }

  if (!order) {
    return <Text type="danger">No order data found.</Text>;
  }

  const productColumns = [
    {
      title: "Image",
      key: "image",
      render: (_, record) => {
        const product = record.productId;
        if (product?.images && product.images.length > 0) {
          return (
            <Image
              width={50}
              height={50}
              src={`${BASE_URL}/${product.images[0]}`}
              alt={product.name || "Product"}
              style={{ objectFit: "cover", borderRadius: "4px" }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioaOAjDJ9QCpGynyGkOgi0MTxEwNIdGHcUhSCiUoJQoohCCMhCDhBAmWAkigfIUFgIZYQ4AiIhDGEMgQ1QClIeB6CEAgYgSYEwIwIoZJCEGIEAgiAkAzC0DLEBgWBYAYEaRBCiAII0ZCQhCSEB4kEgVCgQJFEOA0KZCAgGGFwGQkHBCAKChChJEOQgTCMBoCCAhCCEAAk0Kdg4JBCiBgKUggCRBIEAICAggSQSAkECkgQJCyCoAAEgsEBCQJBQgECxQKBAgTCMIBBgmGCAgQJBCQJBQoMCRQIEAICBhEACgQKBBQwEAggECxYOBQoMCxQKCRQIEAggECxYOBQoMCxQKCRQIEAggECxYOBQoMCxQKCRQIEAggECxYOBQoMCxQKCRQI"
            />
          );
        }
        return (
          <div
            style={{
              width: 50,
              height: 50,
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#999",
            }}
          >
            No Image
          </div>
        );
      },
    },
    {
      title: "Product",
      key: "product",
      render: (_, record) => record.productId?.name || "N/A",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value) => `₹${value}`,
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => `₹${record.price * record.quantity}`,
    },
  ];

  const handleInvoiceDownload = async (orderId) => {
    try {
      await downloadInvoice(orderId);
    } catch (error) {
      message.error("Error in invoice download");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>
          Order Details
        </Title>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => handleInvoiceDownload(orderId)}
        >
          Download Invoice
        </Button>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card size="small">
            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="Order ID">
                {order.orderId || order._id || order.id || order.orderNumber || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="User">
                {order.userId?.name} {order.userId?.email || "N/A"}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Delivery Time">
                {new Date(order.deliveryDate).toLocaleDateString()} at
                {order.deliveryTime}
              </Descriptions.Item> */}
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    order.status === "delivered"
                      ? "green"
                      : order.status === "out_for_delivery" || order.status === "processing"
                      ? "blue"
                      : order.status === "shipped"
                      ? "purple"
                      : order.status === "accepted"
                      ? "cyan"
                      : order.status === "ready"
                      ? "orange"
                      : order.status === "cancelled"
                      ? "red"
                      : "default"
                  }
                >
                  {order.status?.toUpperCase().replace('_', ' ')}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Actions">
                <Space>
                  {(() => {
                    const statusItems = getStatusUpdateItems();
                    return statusItems.length > 0 ? (
                      <Dropdown
                        menu={{ items: statusItems }}
                        trigger={['click']}
                        placement="bottomLeft"
                      >
                        <Button
                          type="primary"
                          size="small"
                          loading={statusUpdateLoading}
                        >
                          Update Status
                        </Button>
                      </Dropdown>
                    ) : null;
                  })()}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Mode">
                {order.paymentMethod.toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                <Tag color={order.paymentStatus === 'paid' ? 'green' : 'orange'}>
                  {order.paymentStatus?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Driver">
                {order.assignedDriver?.name || order.driver?.name || order.assignedDriverId?.name || order.driverId?.name || (
                  <Text type="secondary">Not Assigned</Text>
                )}
              </Descriptions.Item>
            </Descriptions>

            {(order.status === 'shipped' || order.status === 'processing') && (
              <div style={{ marginTop: 16 }}>
                {(order.assignedDriver || order.driver || order.assignedDriverId || order.driverId) && (
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary">Current Driver: </Text>
                    <Text strong>{order.assignedDriver?.name || order.driver?.name || order.assignedDriverId?.name || order.driverId?.name}</Text>
                  </div>
                )}
                <Space>
                  <Select
                    style={{ width: 250 }}
                    placeholder={(order.assignedDriver || order.driver || order.assignedDriverId || order.driverId) ? "Select New Delivery Boy" : "Select Delivery Boy"}
                    value={selectedDriver}
                    onChange={(value) => setSelectedDriver(value)}
                  >
                    {drivers.map((driver) => (
                      <Option key={driver._id} value={driver._id}>
                        {driver.name} ({driver.mobileNo || "No Phone"}){" "}
                      {driver.distanceInMeters
                        ? `(${Math.round(driver.distanceInMeters / 1000)}km)`
                        : ""}
                    </Option>
                  ))}
                </Select>
                <Button
                    type="primary"
                    loading={assigning}
                    onClick={handleAssignDriver}
                  >
                    {(order.assignedDriver || order.driver || order.assignedDriverId || order.driverId) ? "Reassign Driver" : "Assign"}
                  </Button>
                </Space>
              </div>
            )}
          </Card>

          <Card title="Delivery Address" size="small" style={{ marginTop: 16 }}>
            <Text strong>{order.shippingAddress?.receiverName}</Text>
            <div>{order.shippingAddress?.receiverNo}</div>
            <div>
              {order.shippingAddress?.houseNoOrFlatNo},{" "}
              {order.shippingAddress?.floor}
            </div>
            {order.shippingAddress?.landmark && (
              <div>Landmark: {order.shippingAddress?.landmark}</div>
            )}
            <div>
              {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
            </div>
            <div>Address Type: {order.shippingAddress?.addressType}</div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Order Summary" size="small">
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Item Total">
                ₹{order.itemPriceTotal}
              </Descriptions.Item>
              <Descriptions.Item label="Packing Charge">
                ₹{order.packingCharge || "0"}
              </Descriptions.Item>
              <Descriptions.Item label="Handling Charge">
                ₹{order.handlingCharge}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Charge">
                ₹{order.deliveryCharge}
              </Descriptions.Item>
              <Descriptions.Item label="Coupon Used">
                {order.couponUsage && order.couponUsage.length > 0
                  ? order.couponUsage.map((c) => c.couponCode || c).join(", ")
                  : "No Coupon"}
              </Descriptions.Item>
              <Descriptions.Item label="Coupon Discount">
                -₹
                {order.couponUsage && order.couponUsage.length > 0
                  ? order.couponUsage
                      .reduce((sum, c) => sum + (c.discountAmount || 0), 0)
                      .toFixed(2)
                  : "0"}
              </Descriptions.Item>
              <Descriptions.Item label="Final Total">
                ₹{order.grandTotal}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card title="Products" size="small" style={{ marginTop: 24 }}>
        <Table
          dataSource={order.products}
          columns={productColumns}
          pagination={false}
          rowKey={(record, index) => index}
          size="small"
        />
      </Card>
    </div>
  );
};

export default OrderDetailsPage;
