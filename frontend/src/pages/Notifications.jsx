import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import './Notifications.css';

const Notifications = () => {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        isConnected
    } = useNotifications();

    const [filter, setFilter] = useState('all'); // 'all' or 'unread'

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'BOOKING_CREATED': return '📅';
            case 'BOOKING_CONFIRMED': return '✅';
            case 'BOOKING_CANCELLED': return '❌';
            case 'BOOKING_COMPLETED': return '🎉';
            case 'REVIEW_RECEIVED': return '⭐';
            case 'NEW_CUSTOMER_REGISTERED': return '👤';
            case 'NEW_PROVIDER_REGISTERED': return '🏪';
            case 'CONTACT_FORM_SUBMITTED': return '📧';
            default: return '🔔';
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'HIGH': return 'priority-high';
            case 'LOW': return 'priority-low';
            default: return 'priority-normal';
        }
    };

    return (
        <div className="notifications-page">
            <div className="notifications-container">
                <div className="notifications-header">
                    <h1>🔔 Notifications</h1>
                    <div className="connection-status">
                        {isConnected ? (
                            <span className="status-connected">● Live</span>
                        ) : (
                            <span className="status-disconnected">● Offline</span>
                        )}
                    </div>
                </div>

                <div className="notifications-controls">
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                            onClick={() => setFilter('unread')}
                        >
                            Unread ({unreadCount})
                        </button>
                    </div>

                    {unreadCount > 0 && (
                        <button className="mark-all-read-btn" onClick={markAllAsRead}>
                            ✓✓ Mark all as read
                        </button>
                    )}
                </div>

                <div className="notifications-list">
                    {filteredNotifications.length === 0 ? (
                        <div className="no-notifications">
                            <span className="no-notif-icon">🔔</span>
                            <p>{filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`notification-card ${!notification.isRead ? 'unread' : ''} ${getPriorityClass(notification.priority)}`}
                            >
                                <div className="notification-icon">
                                    {getNotificationIcon(notification.type)}
                                </div>

                                <div className="notification-content">
                                    <div className="notification-title">{notification.title}</div>
                                    <div className="notification-message">{notification.message}</div>
                                    <div className="notification-meta">
                                        <span className="notification-time">{formatTime(notification.createdAt)}</span>
                                        {notification.senderName && (
                                            <span className="notification-sender">from {notification.senderName}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="notification-actions">
                                    {!notification.isRead && (
                                        <button
                                            className="action-btn mark-read"
                                            onClick={() => markAsRead(notification.id)}
                                            title="Mark as read"
                                        >
                                            ✓
                                        </button>
                                    )}
                                    <button
                                        className="action-btn delete"
                                        onClick={() => deleteNotification(notification.id)}
                                        title="Delete"
                                    >
                                        🗑
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
