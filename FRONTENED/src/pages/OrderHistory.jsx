import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaEye, FaCalendarAlt, FaRupeeSign, FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";
import "./ecommerce.css";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token") ? true : false;
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const loadOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders([...data].reverse());
        } else {
          // Fallback to localStorage
          const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
          setOrders([...allOrders].reverse());
        }
      } catch (err) {
        const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrders([...allOrders].reverse());
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "processing": return "#ff9800";
      case "shipped": return "#2196f3";
      case "delivered": return "#4caf50";
      case "cancelled": return "#f44336";
      default: return "#666";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "processing": return <FaClock />;
      case "shipped": return <FaTruck />;
      case "delivered": return <FaCheckCircle />;
      case "cancelled": return "✕";
      default: return <FaBox />;
    }
  };

  const getTrackingStages = (status) => {
    const stages = [
      { label: "Order Confirmed", completed: true },
      { label: "Processing", completed: ["shipped", "delivered"].includes(status.toLowerCase()) },
      { label: "Shipped", completed: ["shipped", "delivered"].includes(status.toLowerCase()) },
      { label: "Out for Delivery", completed: status.toLowerCase() === "delivered" },
      { label: "Delivered", completed: status.toLowerCase() === "delivered" }
    ];
    return stages;
  };

  const getEstimatedDelivery = (orderDate, status) => {
    const date = new Date(orderDate);
    if (status.toLowerCase() === "delivered") {
      // If delivered, show delivery happened date
      date.setDate(date.getDate() + Math.floor(Math.random() * 3) + 3);
      return { date, delivered: true };
    } else {
      // Estimate delivery in 5-7 days
      date.setDate(date.getDate() + Math.floor(Math.random() * 2) + 5);
      return { date, delivered: false };
    }
  };

  if (loading) {
    return (
      <div className="order-history-page">
        <div className="container">
          <div className="loading">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="container">
        <div className="order-history-header">
          <h1><FaBox className="me-2" /> My Orders</h1>
          <p>Track and manage your orders in real-time</p>
        </div>

        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order) => {
              const trackingStages = getTrackingStages(order.status);
              const estimatedDelivery = getEstimatedDelivery(order.orderDate, order.status);
              const isExpanded = expandedOrder === order.orderId;

              return (
                <div key={order.orderId} className={`order-card ${isExpanded ? 'expanded' : ''}`}>
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order.orderId}</h3>
                      <p className="order-date">
                        <FaCalendarAlt className="me-1" />
                        {new Date(order.orderDate).toLocaleDateString()} at{" "}
                        {new Date(order.orderDate).toLocaleTimeString()}
                      </p>
                      <p className="tracking-id">Tracking ID: <strong>{order.orderId}</strong></p>
                    </div>
                    <div className="order-status">
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.map((item) => (
                      <div key={item.id} className="order-item">
                        <img src={item.image} alt={item.name} />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p>Quantity: {item.quantity}</p>
                          <p className="item-price">
                            <FaRupeeSign />{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* TRACKING TIMELINE */}
                  <div className="order-tracking">
                    <div className="tracking-header">
                      <h4>📍 Order Tracking</h4>
                      <p>Estimated Delivery: <strong>{estimatedDelivery.delivered ? "Delivered on" : "by"} {estimatedDelivery.date.toLocaleDateString()}</strong></p>
                    </div>
                    
                    <div className="tracking-timeline">
                      {trackingStages.map((stage, index) => (
                        <div key={index} className={`timeline-step ${stage.completed ? 'completed' : 'pending'}`}>
                          <div className="timeline-marker">
                            <div className="marker-dot"></div>
                            {index < trackingStages.length - 1 && <div className="marker-line"></div>}
                          </div>
                          <div className="step-content">
                            <p className="step-label">{stage.label}</p>
                            {stage.completed && <p className="step-time">✓ Completed</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DELIVERY DETAILS */}
                  {isExpanded && (
                    <div className="delivery-details-expand">
                      <div className="detail-section">
                        <h5>🚚 Delivery Address</h5>
                        <p>{order.deliveryDetails.address}</p>
                        <p>{order.deliveryDetails.city}, {order.deliveryDetails.state} - {order.deliveryDetails.pincode}</p>
                        <p>📞 {order.deliveryDetails.phone}</p>
                      </div>
                      <div className="detail-section">
                        <h5>📧 Contact Information</h5>
                        <p>Email: {order.deliveryDetails.email || "Not provided"}</p>
                        <p>Phone: {order.deliveryDetails.phone}</p>
                      </div>
                      <div className="detail-section">
                        <h5>💳 Payment Details</h5>
                        <p>Method: {order.paymentLabel || order.paymentMethod?.toUpperCase()}</p>
                        <p>Status: {order.paymentStatus || (order.paymentMethod === "cod" ? "Pay on Delivery" : "Paid Online")}</p>
                      </div>
                    </div>
                  )}

                  <div className="order-footer">
                    <div className="order-total">
                      <strong>Total: <FaRupeeSign />{order.totalAmount.toFixed(2)}</strong>
                    </div>
                    <div className="order-actions">
                      <button
                        className="btn-tracking"
                        onClick={() => setExpandedOrder(isExpanded ? null : order.orderId)}
                      >
                        {isExpanded ? "Hide Details" : "View More"} ▼
                      </button>
                      <button
                        className="btn-view-order"
                        onClick={() => navigate(`/order-confirmation/${order.orderId}`)}
                      >
                        <FaEye className="me-1" /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-orders">
            <FaBox className="empty-icon" />
            <h2>No orders yet</h2>
            <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <button
              className="btn-shop-now"
              onClick={() => navigate("/")}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;