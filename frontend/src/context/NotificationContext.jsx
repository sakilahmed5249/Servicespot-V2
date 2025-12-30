import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const NotificationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    // Helper function to get user email from localStorage
    const getUserEmail = () => {
        return localStorage.getItem('adminEmail') ||
            localStorage.getItem('customerEmail') ||
            localStorage.getItem('providerEmail');
    };

    // Use state for userEmail to detect login changes
    const [userEmail, setUserEmail] = useState(getUserEmail());

    // Listen for localStorage changes (login/logout)
    useEffect(() => {
        const handleStorageChange = () => {
            const newEmail = getUserEmail();
            if (newEmail !== userEmail) {
                console.log('User email changed from', userEmail, 'to', newEmail);
                setUserEmail(newEmail);
            }
        };

        // Listen for storage events from other tabs
        window.addEventListener('storage', handleStorageChange);

        // Poll for same-tab changes (localStorage events don't fire in same tab)
        const interval = setInterval(handleStorageChange, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [userEmail]);

    // Show browser notification
    const showBrowserNotification = useCallback((notification) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            // eslint-disable-next-line no-new
            new Notification(notification.title, {
                body: notification.message,
                icon: '/vite.svg',
                badge: '/vite.svg',
                tag: notification.id,
            });
        }
    }, []);

    // Play notification sound
    const playNotificationSound = useCallback(() => {
        try {
            const audio = new Audio('/notification-sound.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => {
                // Silently fail if audio playback is not allowed
            });
        } catch {
            // Audio not available
        }
    }, []);

    // Fetch initial notifications
    const fetchNotifications = useCallback(async () => {
        if (!userEmail) return;

        try {
            const response = await fetch(`http://localhost:8080/api/notifications/user/${userEmail}`);
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);

                // Count unread
                const unread = data.filter(n => !n.isRead).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, [userEmail]);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        if (!userEmail) return;

        try {
            const response = await fetch(`http://localhost:8080/api/notifications/user/${userEmail}/unread/count`);
            if (response.ok) {
                const data = await response.json();
                setUnreadCount(data.count);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    }, [userEmail]);

    // Connect to WebSocket
    useEffect(() => {
        if (!userEmail) {
            console.log('No user email found, skipping WebSocket connection');
            return;
        }

        console.log('Connecting to WebSocket for user:', userEmail);

        // Include email as query parameter for user principal
        const socket = new SockJS(`http://localhost:8080/ws-notifications?email=${encodeURIComponent(userEmail)}`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log('WebSocket Connected for user:', userEmail);
            setIsConnected(true);

            // Subscribe to user-specific notifications
            const subscription = client.subscribe(`/user/${userEmail}/queue/notifications`, (message) => {
                const notification = JSON.parse(message.body);
                console.log('Received notification:', notification);

                // Add new notification to the list
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Show browser notification if permitted
                showBrowserNotification(notification);

                // Play notification sound (optional)
                playNotificationSound();
            });

            console.log('Subscribed to:', `/user/${userEmail}/queue/notifications`);
        };

        client.onStompError = (frame) => {
            console.error('STOMP error:', frame);
            setIsConnected(false);
        };

        client.onWebSocketError = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
        };

        client.activate();

        // Fetch initial notifications
        fetchNotifications();
        fetchUnreadCount();

        // Cleanup on unmount
        return () => {
            if (client) {
                console.log('Deactivating WebSocket connection');
                client.deactivate();
            }
        };
    }, [userEmail, fetchNotifications, fetchUnreadCount, showBrowserNotification, playNotificationSound]);

    // Request notification permission
    const requestNotificationPermission = () => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };


    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
                method: 'PUT',
            });

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(n => n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        if (!userEmail) return;

        try {
            const response = await fetch(`http://localhost:8080/api/notifications/user/${userEmail}/read-all`, {
                method: 'PUT',
            });

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(n => ({ ...n, isRead: true, readAt: new Date() }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    // Delete notification
    const deleteNotification = async (notificationId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const notification = notifications.find(n => n.id === notificationId);
                setNotifications(prev => prev.filter(n => n.id !== notificationId));

                if (notification && !notification.isRead) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const value = {
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchNotifications,
        requestNotificationPermission,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

