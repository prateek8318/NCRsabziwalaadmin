import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Select, Button, message, Card, Typography, Spin, Table, Row, Col } from 'antd';
import { assignDriver, getOrderDetails } from '../../../../services/admin/apiOrder';
import { getAllDrivers } from '../../../../services/admin/apiOrder';

const { Option } = Select;
const { Title, Text } = Typography;

const OrderDetails = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [deliveryBoy, setDeliveryBoy] = useState([]);
  const [selectedBoy, setSelectedBoy] = useState(null);
  const [loadingAssign, setLoadingAssign] = useState(false);

  useEffect(() => { fetchOrderDetails(id); fetchDriverList(); }, [id]);

  const fetchOrderDetails = async (id) => {
    try {
      const res = await getOrderDetails(id);
      // console.log(res);
      setOrderData(res.order);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDriverList = async () => {
    try {
      const res = await getAllDrivers();
      // console.log(res.data);
      setDeliveryBoy(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!orderData || !deliveryBoy) {
    return (
      <div className="flex justify-center mt-20">
        <Spin size="large" />
      </div>
    );
  }

  const handleAssign = async () => {
    if (!selectedBoy) {
      return message.warning('Please select a delivery boy');
    }

    const driverId = selectedBoy._id;
    setLoadingAssign(true)
    try {
      const res = await assignDriver(id, driverId)
      // console.log(res)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingAssign(false)
      fetchOrderDetails(id)
    }
  };

  const columns = [
    { title: 'Item Name', key: 'name', render: (_, record) => `${record.product_id.name}` },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', align: 'center' },
    { title: 'Price', key: 'price', align: 'center', render: (_, record) => `₹${record.product_id.vendorSellingPrice}` },
    { title: 'Total', key: 'total', align: 'center', render: (_, record) => `₹${record.finalPrice}` },
  ];

  return (
    <Card className="max-w-xl mx-auto my-4 shadow-md rounded-xl border p-6">
      <Title level={4}>Order ID: {orderData.booking_id}</Title>
      <Text className="block mb-2">Delivery Date: {new Date(orderData.deliveryDate).toLocaleDateString()}</Text>
      <Text className="block mb-4">Delivery Time: {orderData.deliveryTime}</Text>

      <Title level={5}>Items</Title>
      <Table
        dataSource={[orderData.productData]}
        columns={columns}
        rowKey="_id"
        pagination={false}
        bordered
        size="small"
      />

      <Row>
        <Col span={12}>
          <div className="my-4">
            <Title level={5}>Shop Details</Title>
            <Text>Shop Name: {orderData.shopId.name}</Text><br />
            <Text>Packing Charge: ₹ {orderData.shopId.packingCharge}</Text>
          </div>
        </Col>
        <Col span={12}>
          <div className="my-4">
            <Title level={5}>Vendor Details</Title>
            <Text>Vendor Name: {orderData.vendorId.name}</Text><br />
            <Text>Email: {orderData.vendorId.email}</Text>
          </div>
        </Col>
      </Row>

      <div className="my-4">
        <Title level={5}>Payment Details</Title>
        <Text>Method: {orderData.paymentMode}</Text><br />
        <Text>Status: {orderData.paymentStatus}</Text><br />
        <Text>Total: ₹ {orderData.finalTotalPrice}</Text><br />
        <Text>Transaction ID: {orderData.paymentId}</Text>
      </div>

      {orderData.assignedDriver ? (
        <div className="mb-4">
          <Text strong>Assigned To:</Text>
          <Text className="ml-2 text-green-600">{orderData.assignedDriver.name}</Text>
        </div>
      ) : (
        <div className="mb-4">
          <Text type="danger">Not Assigned Yet</Text>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Select
          placeholder="Select Delivery Boy"
          style={{ width: 220 }}
          onChange={(val) => setSelectedBoy(deliveryBoy.find((b) => b._id === val))}
          defaultValue={orderData.assignedDriver?._id}
        >
          {deliveryBoy.map((boy) => (
            <Option key={boy._id} value={boy._id}>
              {boy.name}
            </Option>
          ))}
        </Select>
        <Button type="primary" onClick={handleAssign} loading={loadingAssign}>
          Assign Order
        </Button>
      </div>
    </Card>
  );
};

export default OrderDetails;
