import { Button, message, Space, Table, Tag } from "antd";
import { FaTrash, FaUserTie } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { useNavigate } from "react-router";
import { getAllOrder } from "../../../../services/admin/apiOrder";
import { useEffect, useState } from "react";
import { convertDate } from "../../../../utils/formatDate";
import DriverAssignmentModal from "./DriverAssignmentModal";

const OrderTable = ({ searchText, onDelete, type }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchOrderList(type);
  }, [type]);

  const fetchOrderList = async (type) => {
    setLoading(true);
    try {
      const res = await getAllOrder(type);
      console.log('Orders API response:', res);
      setOrders(res.orders || []);
    } catch (error) {
      console.log(error);
      // message.error("something went wrong")
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record) => {
    navigate(`/admin/order/${record._id}`);
  };

  const handleAssignDriver = (record) => {
    setSelectedOrderId(record._id);
    setAssignmentModalVisible(true);
  };

  const handleAssignmentSuccess = () => {
    fetchOrderList(type); // Refresh the order list
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      align: "center",
      render: (_, record) => {
        const orderId = record.orderId || record._id || record.id || record.orderNumber;
        console.log('Order record:', record, 'Order ID:', orderId);
        return orderId ? `${orderId}` : "N/A";
      },
    },
    // {
    //   title: "Delivery Date",
    //   dataIndex: "deliveryDate",
    //   key: "deliveryDate",
    //   align: "center",
    //   render: (deliveryDate) =>
    //     `${deliveryDate ? convertDate(deliveryDate) : "N/A"}`,
    // },
    // {
    //   title: "Delivery Time",
    //   dataIndex: "deliveryTime",
    //   key: "deliveryTime",
    //   align: "center",
    // },
    {
      title: "Total Amount",
      dataIndex: "grandTotal",
      key: "grandTotal",
      align: "center",
      render: (amount) => (amount ? `₹${amount}` : "N/A"),
    },
    {
      title: "Order Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag
          color={
            status === "delivered"
              ? "green"
              : status === "out_for_delivery" || status === "processing"
              ? "blue"
              : status === "shipped"
              ? "purple"
              : status === "accepted"
              ? "cyan"
              : status === "ready"
              ? "orange"
              : status === "cancelled"
              ? "red"
              : "default"
          }
        >
          {status?.toUpperCase().replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      align: "center",
      render: (status) => (
        <Tag
          color={
            status == "paid" ? "green" : status == "pending" ? "orange" : "red"
          }
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Payment Mode",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      align: "center",
      render: (paymentMethod) => (
        <Tag
          color={
            paymentMethod === "cod"
              ? "gray"
              : paymentMethod === "wallet"
              ? "gray"
              : "green"
          }
        >
          {paymentMethod?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedDriver",
      key: "assignedDriver",
      align: "center",
      render: () => (
        // assignedDriver ? (
        //   <Tag color="green">{assignedDriver}</Tag>
        // ) : (
        <Tag color="red">Not Assigned</Tag>
      ),
      // ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<IoMdEye />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
          {type === 'ready' && !record.assignedDriver && (
            <Button
              type="default"
              icon={<FaUserTie />}
              onClick={() => handleAssignDriver(record)}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Assign Driver
            </Button>
          )}
          {/* <Button
                        type="primary"
                        danger
                        icon={<FaTrash />}
                        onClick={() => onDelete(record)}
                    /> */}
        </Space>
      ),
    },
  ];

  const filteredItem = orders.filter((item) =>
    searchText.trim()
      ? item.orderId?.toLowerCase().includes(searchText.toLowerCase())
      : true
  );

  return (
    <>
      <Table
        dataSource={filteredItem}
        columns={columns}
        rowKey="_id"
        scroll={{ x: true }}
        bordered
        size="small"
        loading={loading}
      />

      <DriverAssignmentModal
        visible={assignmentModalVisible}
        orderId={selectedOrderId}
        onCancel={() => setAssignmentModalVisible(false)}
        onSuccess={handleAssignmentSuccess}
      />
    </>
  );
};

export default OrderTable;
