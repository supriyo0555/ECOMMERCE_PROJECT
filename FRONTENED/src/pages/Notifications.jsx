import { useEffect, useMemo, useState } from "react";
import {
  FaBell,
  FaBox,
  FaHeart,
  FaTag,
  FaInfoCircle,
  FaTrash,
  FaCheck,
  FaRegBell,
} from "react-icons/fa";
import "./notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const savedNotifications = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );
    const sortedNotifications = [...savedNotifications].sort(
      (a, b) =>
        new Date(b.createdAt || b.timestamp || 0) -
        new Date(a.createdAt || a.timestamp || 0)
    );
    setNotifications(sortedNotifications);
  }, []);

  const persistNotifications = (updatedNotifications) => {
    const sortedNotifications = [...updatedNotifications].sort(
      (a, b) =>
        new Date(b.createdAt || b.timestamp || 0) -
        new Date(a.createdAt || a.timestamp || 0)
    );
    setNotifications(sortedNotifications);
    localStorage.setItem("notifications", JSON.stringify(sortedNotifications));
  };

  const addNotification = (type, message) => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toLocaleString(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    persistNotifications([newNotification, ...notifications]);
  };

  const markAsRead = (id) => {
    const updated = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    persistNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    persistNotifications(updated);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter((notification) => notification.id !== id);
    persistNotifications(updated);
  };

  const clearAll = () => {
    persistNotifications([]);
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (activeTab === "all") return true;
      return notification.type === activeTab;
    });
  }, [notifications, activeTab]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <FaBox />;
      case "wishlist":
        return <FaHeart />;
      case "offer":
        return <FaTag />;
      case "info":
        return <FaInfoCircle />;
      default:
        return <FaBell />;
    }
  };

  const getNotificationLabel = (type) => {
    switch (type) {
      case "order":
        return "Order Update";
      case "wishlist":
        return "Wishlist";
      case "offer":
        return "Offer";
      case "info":
        return "Info";
      default:
        return "General";
    }
  };

  const formatTime = (value) => {
    if (!value) return "Just now";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  const notificationTypes = [
    {
      key: "all",
      label: "All",
      icon: "🔔",
      count: notifications.length,
    },
    {
      key: "order",
      label: "Orders",
      icon: "📦",
      count: notifications.filter((notification) => notification.type === "order").length,
    },
    {
      key: "wishlist",
      label: "Wishlist",
      icon: "❤️",
      count: notifications.filter((notification) => notification.type === "wishlist").length,
    },
    {
      key: "offer",
      label: "Offers",
      icon: "🏷️",
      count: notifications.filter((notification) => notification.type === "offer").length,
    },
    {
      key: "info",
      label: "Info",
      icon: "ℹ️",
      count: notifications.filter((notification) => notification.type === "info").length,
    },
  ];

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-hero">
          <div>
            <span className="hero-badge">🔔 Smart updates</span>
            <h1>Notifications Center</h1>
            <p>
              Order updates, wishlist alerts and special offers are now shown in
              one clean dashboard.
            </p>
          </div>

          <div className="hero-actions">
            {unreadCount > 0 && (
              <button className="btn-mark-all" onClick={markAllAsRead}>
                <FaCheck /> Mark all read
              </button>
            )}

            {notifications.length > 0 && (
              <button className="btn-clear-all" onClick={clearAll}>
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="notification-overview">
          <div className="overview-card">
            <strong>{notifications.length}</strong>
            <span>Total updates</span>
          </div>
          <div className="overview-card">
            <strong>{unreadCount}</strong>
            <span>Unread</span>
          </div>
          <div className="overview-card">
            <strong>{notifications.filter((notification) => notification.type === "order").length}</strong>
            <span>Order alerts</span>
          </div>
        </div>

        <div className="notification-tabs">
          {notificationTypes.map((type) => (
            <button
              key={type.key}
              className={`tab-btn ${activeTab === type.key ? "active" : ""}`}
              onClick={() => setActiveTab(type.key)}
            >
              <span className="tab-icon">{type.icon}</span>
              <span className="tab-label">{type.label}</span>
              {type.count > 0 && <span className="tab-count">{type.count}</span>}
            </button>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="notification-demo-panel">
            <div>
              <h3>No notifications yet</h3>
              <p>
                Place an order or use the quick buttons below to preview the new
                design.
              </p>
            </div>

            <div className="demo-actions">
              <button onClick={() => addNotification("order", "Your recent order is packed and ready to ship.")}>
                Add Order Update
              </button>
              <button onClick={() => addNotification("offer", "Flash deal: get 30% off on accessories today.")}>
                Add Offer Alert
              </button>
              <button onClick={() => addNotification("wishlist", "One of your wishlist items just dropped in price.")}>
                Add Wishlist Alert
              </button>
            </div>
          </div>
        )}

        <div className="notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-card ${!notification.read ? "unread" : ""} type-${notification.type}`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <div className="notification-meta-row">
                    <span className={`type-pill type-${notification.type}`}>
                      {getNotificationLabel(notification.type)}
                    </span>
                    {!notification.read && <span className="new-pill">New</span>}
                  </div>

                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">
                    {formatTime(notification.createdAt || notification.timestamp)}
                  </span>
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      className="btn-read"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      Mark read
                    </button>
                  )}

                  <button
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-notifications">
              <FaRegBell className="empty-icon" />
              <h3>No matching notifications</h3>
              <p>Try another filter or wait for new updates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
