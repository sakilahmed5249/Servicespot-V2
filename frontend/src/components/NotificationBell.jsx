import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { FaBell, FaCheck, FaCheckDouble, FaTrash, FaTimes } from 'react-icons/fa';
import './NotificationBell.css';

function NotificationBell() {
    const navigate = useNavigate();
    const location = useLocation();
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('all'); // all, unread
    const dropdownRef = useRef(null);

    // Check if on notifications page
    const isOnNotificationsPage = location.pathname === '/notifications';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        // Navigate to action URL if available
        if (notification.actionUrl) {
            navigate(notification.actionUrl);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'BOOKING_CREATED':
                return '📅';
            case 'BOOKING_CONFIRMED':
                return '✅';
            case 'BOOKING_CANCELLED':
                return '❌';
            case 'BOOKING_COMPLETED':
                return '🎉';
            case 'REVIEW_RECEIVED':
                return '⭐';
            case 'NEW_CUSTOMER_REGISTERED':
                return '👤';
            case 'NEW_PROVIDER_REGISTERED':
                return '🏪';
            case 'CONTACT_FORM_SUBMITTED':
                return '📧';
            default:
                return '🔔';
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return date.toLocaleDateString();
    };

    return (
        <div className="notification-bell-container" ref={dropdownRef}>
            <button
                className="notification-bell-button"
                onClick={() => {
                    if (isOnNotificationsPage) {
                        // Already on notifications page, do nothing or scroll to top
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                        setIsOpen(!isOpen);
                    }
                }}
                aria-label="Notifications"
            >
                <FaBell size={20} />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </button>

            {isOpen && !isOnNotificationsPage && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        <button
                            className="close-button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="notification-controls">
                        <div className="notification-filter">
                            <button
                                className={filter === 'all' ? 'active' : ''}
                                onClick={() => setFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={filter === 'unread' ? 'active' : ''}
                                onClick={() => setFilter('unread')}
                            >
                                Unread ({unreadCount})
                            </button>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                className="mark-all-read-button"
                                onClick={markAllAsRead}
                                title="Mark all as read"
                            >
                                <FaCheckDouble size={14} />
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {filteredNotifications.length === 0 ? (
                            <div className="no-notifications">
                                <FaBell size={40} color="#ccc" />
                                <p>No notifications</p>
                            </div>
                        ) : (
                            filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.isRead ? 'unread' : ''} priority-${notification.priority?.toLowerCase()}`}
                                >
                                    <div
                                        className="notification-content"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="notification-icon">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="notification-text">
                                            <div className="notification-title">
                                                {notification.title}
                                                {!notification.isRead && <span className="unread-dot"></span>}
                                            </div>
                                            <div className="notification-message">
                                                {notification.message}
                                            </div>
                                            <div className="notification-time">
                                                {formatTime(notification.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="notification-actions">
                                        {!notification.isRead && (
                                            <button
                                                className="action-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notification.id);
                                                }}
                                                title="Mark as read"
                                            >
                                                <FaCheck size={12} />
                                            </button>
                                        )}
                                        <button
                                            className="action-button delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                            title="Delete"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {filteredNotifications.length > 0 && (
                        <div className="notification-footer">
                            <a href="/notifications">View All Notifications</a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
