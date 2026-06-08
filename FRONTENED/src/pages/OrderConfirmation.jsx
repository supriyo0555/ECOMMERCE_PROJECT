import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ecommerce.css";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrder({
            orderId: data._id,
            orderDate: data.createdAt,
            totalAmount: data.totalPrice,
            deliveryDetails: {
              fullName: data.shippingAddress.address.split(",")[0] || "",
              address: data.shippingAddress.address,
              city: data.shippingAddress.city,
              state: "",
              pincode: data.shippingAddress.postalCode,
              email: "",
              phone: ""
            },
            paymentMethod: data.paymentMethod,
            paymentLabel: data.paymentMethod,
            paymentStatus: data.isPaid ? "Paid Online" : "Pay on Delivery",
            items: data.orderItems.map(item => ({
              id: item.product,
              name: item.name,
              price: item.price,
              quantity: item.qty,
              image: "/images/headphone.png"
            }))
          });
        } else {
          // Fallback to localStorage
          const orders = JSON.parse(localStorage.getItem("orders") || "[]");
          const found = orders.find((o) => o.orderId === orderId);
          setOrder(found);
        }
      } catch (err) {
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        const found = orders.find((o) => o.orderId === orderId);
        setOrder(found);
      }
    };
    loadOrder();
  }, [orderId]);

  if (!order) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-container">
          <div className="error-state">
            <p>Order not found</p>
            <button onClick={() => navigate("/")}>Go to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="success-state">
          <div className="success-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p>Your order has been successfully placed</p>

          <div className="order-details">
            <div className="detail-box">
              <p className="label">Order ID</p>
              <p className="value">{order.orderId}</p>
            </div>

            <div className="detail-box">
              <p className="label">Order Date</p>
              <p className="value">
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>

            <div className="detail-box">
              <p className="label">Total Amount</p>
              <p className="value price">₹{order.totalAmount.toFixed(2)}</p>
            </div>

            <div className="detail-box">
              <p className="label">Delivery Address</p>
              <p className="value">
                {order.deliveryDetails.address}
                <br />
                {order.deliveryDetails.city}, {order.deliveryDetails.state} -{" "}
                {order.deliveryDetails.pincode}
              </p>
            </div>

            <div className="detail-box">
              <p className="label">Payment</p>
              <p className="value">
                {order.paymentLabel || order.paymentMethod?.toUpperCase()}
                <br />
                {order.paymentStatus || (order.paymentMethod === "cod" ? "Pay on Delivery" : "Paid Online")}
              </p>
            </div>
          </div>

          <div className="order-items-confirmation">
            <h2>Items Ordered</h2>
            {order.items.map((item) => (
              <div key={item.id} className="confirmation-item">
                <img src={item.image} alt={item.name} />
                <div className="confirmation-item-details">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <p className="confirmation-item-price">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="confirmation-info">
            <p>
              📧 A confirmation email has been sent to{" "}
              <strong>{order.deliveryDetails.email || "your registered email"}</strong>
            </p>
            <p>📱 You can track your order using the order ID above</p>
            <p>
              🚚 Your order will be delivered within 5-7 business days
            </p>
          </div>

          <div className="confirmation-actions">
            <button
              className="continue-shopping-confirmation"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
            <button
              className="view-orders-confirmation"
              onClick={() => navigate("/order-history")}
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
