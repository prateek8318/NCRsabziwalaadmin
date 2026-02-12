import { Button, message, Space, Table, Tag, Dropdown, Modal } from "antd";
import { FaTrash, FaUserTie } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { useNavigate } from "react-router";
import { getAllOrder, updateOrderStatus } from "../../../../services/admin/apiOrder";
import { useEffect, useState } from "react";
import { convertDate } from "../../../../utils/formatDate";
import DriverAssignmentModal from "./DriverAssignmentModal";

const OrderTable = ({ searchText, onDelete, type }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null);

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

  const handleStatusUpdate = async (orderId, newStatus) => {
    setStatusUpdateLoading(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      // Refresh all tabs to show orders in correct categories
      fetchOrderList(type); // Refresh current tab
      // If order moved to a different status, we might need to refresh other tabs too
      // For now, just refresh current tab
    } catch (error) {
      // Error is already handled in the API function
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const getStatusUpdateItems = (record) => {
    const currentStatus = record.status;
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
        { key: 'delivered', label: 'Mark as Delivered', status: 'delivered' },
        { key: 'returned_requested', label: 'Return Requested', status: 'returned_requested', danger: true }
      ],
      'delivered': [
        { key: 'returned_requested', label: 'Return Requested', status: 'returned_requested', danger: true }
      ],
      'returned_requested': [
        { key: 'return_approved', label: 'Approve Return', status: 'return_approved' },
        { key: 'cancelled', label: 'Reject Return', status: 'cancelled', danger: true }
      ],
      'return_approved': [
        { key: 'returned', label: 'Mark as Returned', status: 'returned' }
      ],
      'returned': [],
      'cancelled': []
    };

    return (statusFlow[currentStatus] || []).map(item => ({
      key: item.key,
      label: item.label,
      danger: item.danger || false,
      onClick: () => handleStatusUpdate(record._id, item.status)
    }));
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
              : status === "processing"
              ? "blue"
              : status === "shipped"
              ? "purple"
              : status === "returned_requested"
              ? "orange"
              : status === "return_approved"
              ? "cyan"
              : status === "returned"
              ? "magenta"
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
      render: (_, record) => {
        // Check multiple possible structures for assigned driver
        const driverName = record.assignedDriver?.name || 
                          record.driver?.name || 
                          record.assignedDriverId?.name ||
                          record.driverId?.name;
        
        return driverName ? (
          <Tag color="green">{driverName}</Tag>
        ) : (
          <Tag color="red">Not Assigned</Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => {
        const statusItems = getStatusUpdateItems(record);
        return (
          <Space size="small">
            <Button
              type="primary"
              icon={<IoMdEye />}
              onClick={() => handleViewDetails(record)}
            >
              View
            </Button>
            
            {statusItems.length > 0 && (
              <Dropdown
                menu={{ items: statusItems }}
                trigger={['click']}
                placement="bottomRight"
              >
                <Button
                  type="default"
                  icon={<FaCheckCircle />}
                  loading={statusUpdateLoading === record._id}
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }}
                >
                  Update Status
                </Button>
              </Dropdown>
            )}
            
            {(record.status === 'processing' || record.status === 'shipped') && 
             !(record.assignedDriver?.name || record.driver?.name || record.assignedDriverId?.name || record.driverId?.name) && (
              <Button
                type="default"
                icon={<FaUserTie />}
                onClick={() => handleAssignDriver(record)}
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: 'white' }}
              >
                Assign Driver
              </Button>
            )}
          </Space>
        );
      },
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
