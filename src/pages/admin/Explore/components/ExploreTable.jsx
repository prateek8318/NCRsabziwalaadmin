import { Avatar, Button, Space, Table } from "antd";
import { FaEdit, FaTrash, FaUserTie } from "react-icons/fa";
import { useMemo } from "react";
import { EyeOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ExploreTable = ({
  searchText = "",
  data = [],
  onEdit,
  onDelete,
  onView,
  loading = false,
}) => {
  //   const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        title: "Avatar",
        key: "avatar",
        align: "center",
        render: (_, { image }) => (
          <Avatar size={40} src={image ? `${BASE_URL}/${image}` : undefined}>
            {!image && <FaUserTie />}
          </Avatar>
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        align: "center",
      },
      {
        title: "Discount Type",
        dataIndex: "discountType",
        key: "discountType",
        align: "center",
      },
      {
        title: "Discount Value",
        dataIndex: "discountValue",
        key: "discountValue",
        align: "center",
      },
      {
        title: "Action",
        key: "action",
        align: "right",
        render: (_, record) => (
          <Space size="small">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              //   onClick={() => navigate(`/admin/explore/${record._id}`)}
              onClick={() => onView(record)}
            ></Button>
            <Button
              type="primary"
              icon={<FaEdit />}
              onClick={() => onEdit(record)}
            ></Button>
            <Button
              type="primary"
              danger
              icon={<FaTrash />}
              onClick={() => onDelete(record)}
            ></Button>
          </Space>
        ),
      },
    ],
    [onEdit, onDelete, onView]
  );

  const filteredData = useMemo(() => {
    const text = searchText.toLowerCase();
    return data.filter((item) => item?.name?.toLowerCase().includes(text));
  }, [data, searchText]);

  return (
    <Table
      dataSource={filteredData}
      columns={columns}
      rowKey="_id"
      scroll={{ x: true }}
      bordered={false}
      size="small"
      loading={loading}
    />
  );
};

export default ExploreTable;
