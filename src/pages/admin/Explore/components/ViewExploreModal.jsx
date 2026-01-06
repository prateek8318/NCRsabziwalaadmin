import React from "react";
import {
  Modal,
  Descriptions,
  Image,
  List,
  Avatar,
  Tag,
  Typography,
  Row,
  Col,
} from "antd";
import attachUrl from "../../../../utils/attachUrl";

const { Title, Text } = Typography;

const ViewExploreModal = ({ isModalOpen, handleCancel, data }) => {
  if (!data) {
    return (
      <Modal
        open={isModalOpen}
        title="Explore Details"
        footer={null}
        onCancel={handleCancel}
      >
        <p>No data to show</p>
      </Modal>
    );
  }

  const {
    name,
    image,
    discountType,
    discountValue,
    products = [],
    createdAt,
    updatedAt,
    _id,
    exploreId,
  } = data;

  const formattedDate = (d) => {
    if (!d) return "N/A";
    try {
      return new Date(d).toLocaleString();
    } catch (err) {
      return d;
    }
  };

  const productThumbnail = (prod) => {
    // if product has images array with at least one item, use that else fallback placeholder
    const imgPath =
      Array.isArray(prod.images) && prod.images.length ? prod.images[0] : null;
    // use attachUrl util if available, else return raw path
    try {
      return imgPath ? attachUrl(imgPath) : null;
    } catch (err) {
      // if attachUrl not available or throws, fallback to raw path or placeholder
      // return imgPath ? `${BASE_URL}/${imgPath}` : null;
      return imgPath || null;
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      title={
        <Title level={4} style={{ margin: 0 }}>
          {name || "Explore Detail"}
        </Title>
      }
      footer={null}
      width={800}
      destroyOnClose
    >
      <Row gutter={[16, 16]}>
        <Col span={10}>
          <div style={{ textAlign: "center" }}>
            {image ? (
              <Image
                src={attachUrl(image)}
                alt={name}
                style={{
                  maxWidth: "100%",
                  maxHeight: 260,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
                fallback="/assets/placeholder.png"
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 260,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f3f4f6",
                  borderRadius: 8,
                }}
              >
                <Text type="secondary">No image</Text>
              </div>
            )}
            <div style={{ marginTop: 12 }}>
              <Tag color="blue">{discountType || "N/A"}</Tag>
              <Text strong style={{ marginLeft: 8 }}>
                {discountValue ?? "N/A"}
                {discountType === "percentage" ? "%" : ""}
              </Text>
            </div>
          </div>
        </Col>

        <Col span={14}>
          <Descriptions column={1} bordered size="small" layout="vertical">
            <Descriptions.Item label="ID">{_id}</Descriptions.Item>
            <Descriptions.Item label="Explore ID">
              {exploreId}
            </Descriptions.Item>
            <Descriptions.Item label="Name">{name || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Discount">
              <div>
                <Text>{discountType || "N/A"}</Text>
                <div>
                  <Text strong>
                    {discountValue ?? "N/A"}{" "}
                    {discountType === "percentage" ? "%" : ""}
                  </Text>
                </div>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {formattedDate(createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {formattedDate(updatedAt)}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <div style={{ marginTop: 18 }}>
        <Title level={5} style={{ marginBottom: 8 }}>
          Products ({products.length})
        </Title>

        {products.length === 0 ? (
          <Text type="secondary">No products linked to this explore.</Text>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={products}
            renderItem={(prod) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    productThumbnail(prod) ? (
                      <Avatar
                        shape="square"
                        size={64}
                        src={productThumbnail(prod)}
                      />
                    ) : (
                      <Avatar shape="square" size={64}>
                        {String(prod.name || prod._id || "")
                          .charAt(0)
                          .toUpperCase()}
                      </Avatar>
                    )
                  }
                  title={<Text strong>{prod.name || prod._id}</Text>}
                  description={
                    <>
                      <div style={{ marginTop: 4 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          ID: {prod._id}
                        </Text>
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Images:{" "}
                          {Array.isArray(prod.images) ? prod.images.length : 0}
                        </Text>
                      </div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </Modal>
  );
};

export default ViewExploreModal;
