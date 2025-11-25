import React, { useState } from "react";
import { Avatar, Button, Space, Switch, Table, Tooltip } from "antd";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { updateProductStatus } from "@services/apiProduct";
import AddProductVarientModal from "./AddProductVarientModal";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function ProductTable({ searchText, data, onDelete, loading }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();

  const columns = [
    {
      title: "Image",
      key: "avatar",
      align: "center",
      render: (_, { images }) => {
        const imageUrl = images?.length
          ? `${BASE_URL}/${images[0]}`
          : "/logo.png";
        return (
          <img
            src={imageUrl}
            alt="Product"
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 50,
            }}
            loading="lazy"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (name) => name || "N/A",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      align: "center",
      render: (_, record) => <>{record?.categoryId?.name || "N/A"}</>,
    },
    {
      title: "Sub Category",
      dataIndex: "subcategory",
      key: "subcategory",
      align: "center",
      render: (_, record) => <>{record?.subCategoryId?.name || "N/A"}</>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) => (
        <Switch
          defaultChecked={record?.status === "active"}
          onChange={(checked) => updateProductStatus(record._id, checked)}
        />
      ),
    },
    {
      title: "Variants",
      key: "variants",
      align: "left",
      render: (_, record) => (
        <>
          <div>
            {record.variants?.length > 0 ? (
              record.variants.map((variant) => (
                <div key={variant._id} className="text-xs mb-1">
                  <strong>{variant.name}</strong> - ₹{variant.price}
                </div>
              ))
            ) : (
              <span style={{ color: "#999" }}>No variants</span>
            )}
          </div>
          <Tooltip title="Add Variant">
            <Button
              type="primary"
              icon={<FaPlus />}
              onClick={() => {
                setSelectedProductId(record._id);
                setIsAddModalOpen(true);
              }}
            >
              Add Variant
            </Button>
          </Tooltip>
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() =>
                navigate(`${record?.name || "product"}-${record._id}`)
              }
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<FaEdit />}
              onClick={() => navigate(`/admin/product/edit/${record._id}`)}
            ></Button>
          </Tooltip>
          {/* <Tooltip title="Delete"><Button type="primary" danger icon={<FaTrash />} onClick={() => onDelete(record)}></Button></Tooltip> */}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={data.filter((item) =>
          (item?.name || "").toLowerCase().includes(searchText.toLowerCase())
        )}
        columns={columns}
        rowKey="_id"
        scroll={{ x: true }}
        bordered={false}
        size="small"
        loading={loading}
      />

      <AddProductVarientModal
        open={isAddModalOpen}
        productId={selectedProductId}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
        }}
      />
    </>
  );
}

export default ProductTable;
