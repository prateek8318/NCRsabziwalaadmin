import React, { useState, useEffect, useRef } from 'react';
import { Badge, Popover, List, Button, Empty, Typography, Avatar, Space, Spin } from 'antd';
import { BellOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { useNotifications } from '../context/NotificationContext';
import moment from 'moment';

const { Text } = Typography;

// Create notification sound
const playNotificationSound = () => {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800; // Frequency in Hz
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.log('Audio playback failed:', error);
  }
};

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const previousUnreadCount = useRef(0);

  // Play sound when new notification arrives
  useEffect(() => {
    if (unreadCount > previousUnreadCount.current) {
      playNotificationSound();
    }
    previousUnreadCount.current = unreadCount;
  }, [unreadCount]);

  // Fetch notifications when popover opens
  useEffect(() => {
    if (popoverOpen && !loading) {
      fetchNotifications();
    }
  }, [popoverOpen, fetchNotifications]);

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    // You can add navigation logic here based on notification type
    handleNotificationAction(notification);
  };

  // Handle notification action based on type
  const handleNotificationAction = (notification) => {
    switch (notification.type) {
      case 'order':
        // Navigate to order details page
        if (notification.data?.orderId) {
          window.location.href = `/admin/order/${notification.data.orderId}`;
        }
        break;
      case 'user':
        // Navigate to user details page
        if (notification.data?.userId) {
          window.location.href = `/admin/user`;
        }
        break;
      case 'driver':
        // Navigate to driver page
        window.location.href = `/admin/driver`;
        break;
      case 'product':
        // Navigate to product page
        if (notification.data?.productId) {
          window.location.href = `/admin/product/${notification.data.productId}`;
        }
        break;
      default:
        // Default action or no action
        break;
    }
  };

  // Handle delete notification
  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  // Handle mark all as read
  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <Avatar style={{ backgroundColor: '#52c41a' }} icon={<BellOutlined />} />;
      case 'user':
        return <Avatar style={{ backgroundColor: '#1890ff' }} icon={<BellOutlined />} />;
      case 'driver':
        return <Avatar style={{ backgroundColor: '#722ed1' }} icon={<BellOutlined />} />;
      case 'product':
        return <Avatar style={{ backgroundColor: '#fa8c16' }} icon={<BellOutlined />} />;
      case 'system':
        return <Avatar style={{ backgroundColor: '#f5222d' }} icon={<BellOutlined />} />;
      default:
        return <Avatar style={{ backgroundColor: '#8c8c8c' }} icon={<BellOutlined />} />;
    }
  };

  // Render notification item
  const renderNotificationItem = (notification) => (
    <List.Item
      key={notification._id}
      style={{
        backgroundColor: notification.isRead ? 'transparent' : '#f0f9ff',
        cursor: 'pointer',
        padding: '12px 16px',
        borderRadius: '6px',
        marginBottom: '4px',
        border: notification.isRead ? 'none' : '1px solid #e6f7ff'
      }}
      onClick={() => handleNotificationClick(notification)}
      actions={[
        !notification.isRead && (
          <Button
            type="text"
            size="small"
            icon={<CheckOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(notification._id);
            }}
            title="Mark as read"
          />
        ),
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={(e) => handleDelete(e, notification._id)}
          title="Delete notification"
          danger
        />
      ].filter(Boolean)}
    >
      <List.Item.Meta
        avatar={getNotificationIcon(notification.type)}
        title={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text strong={!notification.isRead} style={{ fontSize: '14px' }}>
              {notification.title}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {moment(notification.createdAt).fromNow()}
            </Text>
          </Space>
        }
        description={
          <Text style={{ fontSize: '13px', color: '#666' }}>
            {notification.message}
          </Text>
        }
      />
    </List.Item>
  );

  // Render notification list content
  const renderContent = () => (
    <div style={{ width: '380px', maxHeight: '400px' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text strong style={{ fontSize: '16px' }}>
          Notifications
        </Text>
        <Space>
          {unreadCount > 0 && (
            <Button
              type="link"
              size="small"
              onClick={handleMarkAllRead}
              style={{ padding: '0 4px' }}
            >
              Mark all read
            </Button>
          )}
        </Space>
      </div>

      {/* Notification List */}
      <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No notifications"
            style={{ padding: '20px' }}
          />
        ) : (
          <List
            dataSource={notifications}
            renderItem={renderNotificationItem}
            style={{ padding: '8px' }}
          />
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={renderContent()}
      title={null}
      trigger="click"
      open={popoverOpen}
      onOpenChange={setPopoverOpen}
      placement="bottomRight"
      overlayStyle={{ zIndex: 1050 }}
    >
      <Badge count={unreadCount} size="small">
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: '18px' }} />}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40px',
            width: '40px',
            borderRadius: '6px',
            border: unreadCount > 0 ? '1px solid #1890ff' : '1px solid #d9d9d9'
          }}
          title="Notifications"
        />
      </Badge>
    </Popover>
  );
};

export default NotificationBell;
