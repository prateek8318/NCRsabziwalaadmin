import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

// Notification Context
const NotificationContext = createContext();

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  socket: null
};

// Action types
const NOTIFICATION_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_READ: 'MARK_ALL_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  SET_SOCKET: 'SET_SOCKET'
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case NOTIFICATION_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      return { 
        ...state, 
        notifications: action.payload,
        loading: false 
      };
    
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    
    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif._id === action.payload ? { ...notif, isRead: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    
    case NOTIFICATION_ACTIONS.MARK_ALL_READ:
      return {
        ...state,
        notifications: state.notifications.map(notif => ({ ...notif, isRead: true })),
        unreadCount: 0
      };
    
    case NOTIFICATION_ACTIONS.DELETE_NOTIFICATION:
      const deletedNotif = state.notifications.find(n => n._id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif._id !== action.payload),
        unreadCount: deletedNotif && !deletedNotif.isRead ? 
          Math.max(0, state.unreadCount - 1) : state.unreadCount
      };
    
    case NOTIFICATION_ACTIONS.SET_UNREAD_COUNT:
      return { ...state, unreadCount: action.payload };
    
    case NOTIFICATION_ACTIONS.SET_SOCKET:
      return { ...state, socket: action.payload };
    
    default:
      return state;
  }
};

// Provider Component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  
  // Get base URL from environment
  const baseURL = import.meta.env.VITE_BASE_URL;

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('adminToken'); // Use adminToken instead of token
    if (token) {
      const socket = io(baseURL, {
        auth: { token },
        transports: ['websocket', 'polling']
      });

      // Register admin on connect
      socket.on('connect', () => {
        console.log('Connected to notification server');
        socket.emit('admin:register', { token });
      });

      // Listen for notifications
      socket.on('notification', (notification) => {
        dispatch({
          type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
          payload: notification
        });
      });

      // Listen for new orders (legacy support)
      socket.on('new:order', (orderData) => {
        const notification = {
          _id: `order_${Date.now()}`,
          title: 'New Order',
          message: `Order #${orderData.orderId || 'N/A'} received`,
          type: 'order',
          data: orderData,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        dispatch({
          type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
          payload: notification
        });
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from notification server');
      });

      dispatch({
        type: NOTIFICATION_ACTIONS.SET_SOCKET,
        payload: socket
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [baseURL]);

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    try {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });
      const token = localStorage.getItem('adminToken'); // Use adminToken instead of token
      
      if (!token) {
        dispatch({
          type: NOTIFICATION_ACTIONS.SET_ERROR,
          payload: 'No authentication token found'
        });
        return;
      }
      
      const response = await axios.get(
        `${baseURL}/api/admin/notifications/?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS,
        payload: response.data.notifications || []
      });
      
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT,
        payload: response.data.unreadCount || 0
      });
    } catch (error) {
      // If 404 error, API doesn't exist yet - set empty state
      if (error.response?.status === 404) {
        dispatch({
          type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS,
          payload: []
        });
        dispatch({
          type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT,
          payload: 0
        });
        console.log('Notification API not implemented yet');
        return;
      }
      
      // If 401 error, clear token and stop retrying
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken'); // Use adminToken instead of token
        dispatch({
          type: NOTIFICATION_ACTIONS.SET_ERROR,
          payload: 'Authentication failed. Please login again.'
        });
        return;
      }
      
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch notifications'
      });
    }
  }, [baseURL]);

  // Get unread count
  const getUnreadCount = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${baseURL}/api/admin/notifications/unread-count`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT,
        payload: response.data.count || 0
      });
    } catch (error) {
      console.error('Failed to get unread count:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `${baseURL}/api/admin/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      dispatch({
        type: NOTIFICATION_ACTIONS.MARK_AS_READ,
        payload: notificationId
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `${baseURL}/api/admin/notifications/mark-all-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_READ });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `${baseURL}/api/admin/notifications/${notificationId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      dispatch({
        type: NOTIFICATION_ACTIONS.DELETE_NOTIFICATION,
        payload: notificationId
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Create notification (admin function)
  const createNotification = async (notificationData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${baseURL}/api/admin/notifications/create`,
        notificationData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  };

  const value = {
    ...state,
    fetchNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
