import { Button, Space, Switch, Table } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const BannerTable = ({ searchText, onEdit, onDelete, data, loading }) => {
  const columns = [
    {
      title: "Image",
      key: "image",
      align: "center",
      render: (_, { image }) => (
        <img
          src={`${BASE_URL}/${image}`}
          alt="banner"
          style={{
            width: 100,
            height: 50,
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
      align: "center",
    },
    // {
    //     title: 'Status',
    //     dataIndex: 'status',
    //     key: 'status',
    //     align: "center",
    //     render: (_, { status }) => (
    //         <Switch
    //             checked={status === 'active'}
    //             onChange={(checked) => {
    //                 console.log(`switch to ${checked}`);
    //             }}
    //         />
    //     )
    // },
    {
      title: "Action",
      key: "action",
      align: "right",
      render: (_, record) => (
        <Space size="small">
          {/* <Button type="primary" icon={<FaEdit />} onClick={() => onEdit(record)}>Edit</Button> */}
          <Button
            type="primary"
            danger
            icon={<FaTrash />}
            onClick={() => onDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={data.filter((item) =>
        (item?.title || "")
          .toLowerCase()
          .includes((searchText || "").toLowerCase())
      )}
      rowKey="_id"
      columns={columns}
      scroll={{ x: true }}
      bordered={false}
      size="small"
      className="lg:px-10 px-5"
      loading={loading}
    />
  );
};

export default BannerTable;
