import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ecommerce.css";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getStoredUserDetails = () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const storedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");

    return {
      name: storedProfile.name || storedUser.name || "",
      email: storedProfile.email || storedUser.email || "",
      phone: storedProfile.phone || "",
    };
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token") ? true : false;
    if (!isLoggedIn) {
      alert("Please login first to proceed with checkout");
      navigate("/login");
      return;
    }

    const userDetails = getStoredUserDetails();
    setFormData((prev) => ({
      ...prev,
      fullName: userDetails.name || prev.fullName,
      email: userDetails.email || prev.email,
      phone: userDetails.phone || prev.phone,
    }));

    let items = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
    if (items.length === 0) {
      items = JSON.parse(localStorage.getItem("cart") || "[]");
    }

    setCartItems(items);

    if (items.length === 0) {
      navigate("/cart");
      return;
    }

    const addresses = JSON.parse(localStorage.getItem("addresses") || "[]");
    setSavedAddresses(addresses);

    const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0];
    if (defaultAddress) {
      setSelectedAddress(defaultAddress.id);
      setFormData((prev) => ({
        ...prev,
        fullName: defaultAddress.name || prev.fullName || userDetails.name,
        email: prev.email || userDetails.email,
        phone: defaultAddress.phone || prev.phone || userDetails.phone,
        address: defaultAddress.street || prev.address,
        city: defaultAddress.city || prev.city,
        state: defaultAddress.state || prev.state,
        pincode: defaultAddress.pincode || prev.pincode,
      }));
    }

    const paymentMethods = JSON.parse(localStorage.getItem("paymentMethods") || "[]");
    setSavedPaymentMethods(paymentMethods);

    localStorage.removeItem("checkoutItems");
  }, [navigate]);

  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 500 ? 0 : 50;
    return subtotal + shipping;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectAddress = (addressId) => {
    setSelectedAddress(addressId);
    const userDetails = getStoredUserDetails();
    const selectedAddr = savedAddresses.find((addr) => addr.id === addressId);

    if (selectedAddr) {
      setFormData((prev) => ({
        ...prev,
        fullName: selectedAddr.name || prev.fullName || userDetails.name,
        email: prev.email || userDetails.email,
        phone: selectedAddr.phone || prev.phone || userDetails.phone,
        address: selectedAddr.street || prev.address,
        city: selectedAddr.city || prev.city,
        state: selectedAddr.state || prev.state,
        pincode: selectedAddr.pincode || prev.pincode,
      }));
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const validateDeliveryDetails = () => {
    const trimmedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );

    if (Object.values(trimmedData).some((value) => !value)) {
      setError("Please complete your name, email, phone and address before payment");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (trimmedData.phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid mobile number");
      return false;
    }

    if (trimmedData.pincode.replace(/\D/g, "").length < 6) {
      setError("Please enter a valid pincode");
      return false;
    }

    setError("");
    return true;
  };

  const validatePayment = () => {
    if (paymentMethod === "card") {
      const sanitizedCardNumber = cardData.cardNumber.replace(/\s/g, "");
      const sanitizedCvv = cardData.cvv.replace(/\D/g, "");

      if (
        !sanitizedCardNumber ||
        !cardData.cardName ||
        !cardData.expiryMonth ||
        !cardData.expiryYear ||
        !sanitizedCvv
      ) {
        setError("Please fill all card details");
        return false;
      }

      if (sanitizedCardNumber.length !== 16) {
        setError("Card number must be 16 digits");
        return false;
      }

      if (sanitizedCvv.length !== 3) {
        setError("CVV must be 3 digits");
        return false;
      }
    }

    if (paymentMethod === "upi") {
      const upiMethods = savedPaymentMethods.filter((method) => method.type === "upi");
      if (upiMethods.length > 0 && !selectedPaymentId) {
        setError("Please select a saved UPI ID to continue");
        return false;
      }
    }

    if (paymentMethod === "bank") {
      const bankMethods = savedPaymentMethods.filter((method) => method.type === "bank");
      if (bankMethods.length > 0 && !selectedPaymentId) {
        setError("Please select a bank account to continue");
        return false;
      }
    }

    setError("");
    return true;
  };

  const getPaymentSummary = () => {
    const selectedMethod = savedPaymentMethods.find(
      (method) => method.id === Number(selectedPaymentId)
    );

    switch (paymentMethod) {
      case "cod":
        return "Cash on Delivery";
      case "upi":
        return selectedMethod?.upiId
          ? `UPI • ${selectedMethod.upiId}`
          : "UPI Payment";
      case "bank":
        return selectedMethod?.bankName
          ? `Net Banking • ${selectedMethod.bankName}`
          : "Net Banking";
      case "card":
        return cardData.cardNumber
          ? `Card •••• ${cardData.cardNumber.replace(/\s/g, "").slice(-4)}`
          : "Card Payment";
      default:
        return paymentMethod.toUpperCase();
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateDeliveryDetails() || !validatePayment()) {
      return;
    }

    setLoading(true);

    const normalizedDelivery = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
    };

    const addresses = JSON.parse(localStorage.getItem("addresses") || "[]");
    const addressExists = addresses.some(
      (addr) =>
        addr.name === normalizedDelivery.fullName &&
        addr.phone === normalizedDelivery.phone &&
        addr.street === normalizedDelivery.address
    );

    if (!addressExists) {
      const newAddress = {
        id: Date.now(),
        name: normalizedDelivery.fullName,
        phone: normalizedDelivery.phone,
        street: normalizedDelivery.address,
        city: normalizedDelivery.city,
        state: normalizedDelivery.state,
        pincode: normalizedDelivery.pincode,
        type: "home",
        isDefault: addresses.length === 0,
      };
      addresses.push(newAddress);
      localStorage.setItem("addresses", JSON.stringify(addresses));
    }

    try {
      const token = localStorage.getItem("token");
      const orderPayload = {
        orderItems: cartItems.map(item => ({
          product: item.id || item._id,
          name: item.name,
          qty: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          address: `${normalizedDelivery.fullName}, ${normalizedDelivery.address}, State: ${normalizedDelivery.state}, Phone: ${normalizedDelivery.phone}`,
          city: normalizedDelivery.city,
          postalCode: normalizedDelivery.pincode,
          country: "India"
        },
        paymentMethod: getPaymentSummary(),
        totalPrice: calculateTotal()
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.message || "Failed to place order");
      }

      const existingNotifications = JSON.parse(
        localStorage.getItem("notifications") || "[]"
      );
      const orderNotification = {
        id: Date.now() + 1,
        type: "order",
        message: `Order ${orderData._id} confirmed for ₹${orderData.totalPrice.toFixed(2)} via ${orderPayload.paymentMethod}.`,
        timestamp: new Date().toLocaleString(),
        createdAt: new Date().toISOString(),
        read: false,
      };
      localStorage.setItem(
        "notifications",
        JSON.stringify([orderNotification, ...existingNotifications])
      );

      localStorage.setItem("cart", JSON.stringify([]));

      setLoading(false);
      navigate(`/order-confirmation/${orderData._id}`);
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>🛍️ Checkout</h1>
        </div>

        <div className="checkout-content">
          {/* Steps */}
          <div className="checkout-steps">
            <div className={`step ${activeStep >= 1 ? "active" : ""}`}>
              <div className="step-number">1</div>
              <p>Delivery</p>
            </div>
            <div className={`step ${activeStep >= 2 ? "active" : ""}`}>
              <div className="step-number">2</div>
              <p>Payment</p>
            </div>
            <div className={`step ${activeStep >= 3 ? "active" : ""}`}>
              <div className="step-number">3</div>
              <p>Confirmation</p>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Step 1: Delivery Details */}
          {activeStep === 1 && (
            <div className="checkout-step">
              <h2>📍 Select Delivery Address</h2>

              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
                <div className="saved-addresses">
                  <h3>Your Saved Addresses</h3>
                  <div className="addresses-list">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`address-card ${selectedAddress === addr.id ? "selected" : ""}`}
                        onClick={() => handleSelectAddress(addr.id)}
                        style={{
                          padding: "12px",
                          margin: "8px 0",
                          border: selectedAddress === addr.id ? "2px solid #2874f0" : "1px solid #ddd",
                          borderRadius: "4px",
                          cursor: "pointer",
                          backgroundColor: selectedAddress === addr.id ? "#f0f8ff" : "white"
                        }}
                      >
                        <p style={{ marginBottom: "4px", fontWeight: "bold" }}>{addr.name}</p>
                        <p style={{ marginBottom: "4px", fontSize: "14px" }}>{addr.street}</p>
                        <p style={{ marginBottom: "4px", fontSize: "14px" }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p style={{ marginBottom: "0", fontSize: "14px", color: "#666" }}>{addr.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Address Form */}
              <h3 style={{ marginTop: "24px" }}>Or Enter New Address</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>

              <button
                className="next-btn"
                onClick={() => {
                  if (validateDeliveryDetails()) {
                    setActiveStep(2);
                  }
                }}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {activeStep === 2 && (
            <div className="checkout-step">
              <h2>💳 Payment Method</h2>

              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setSelectedPaymentId(null);
                    }}
                  />
                  <span>💰 Cash on Delivery</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setSelectedPaymentId(null);
                    }}
                  />
                  <span>💳 Card Payment</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setSelectedPaymentId(null);
                    }}
                  />
                  <span>📱 UPI</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setSelectedPaymentId(null);
                    }}
                  />
                  <span>🏦 Net Banking</span>
                </label>
              </div>

              {paymentMethod === "card" && (
                <div className="card-form">
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        maxLength={16}
                        placeholder="1234123412341234"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Name on Card</label>
                      <input
                        type="text"
                        name="cardName"
                        value={cardData.cardName}
                        onChange={handleCardChange}
                        placeholder="Card holder name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Expiry Month</label>
                      <input
                        type="text"
                        name="expiryMonth"
                        value={cardData.expiryMonth}
                        onChange={handleCardChange}
                        placeholder="MM"
                      />
                    </div>
                    <div className="form-group">
                      <label>Expiry Year</label>
                      <input
                        type="text"
                        name="expiryYear"
                        value={cardData.expiryYear}
                        onChange={handleCardChange}
                        placeholder="YYYY"
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        maxLength={3}
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="payment-form" style={{ marginTop: "20px", padding: "16px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
                  <h3>UPI Payment</h3>
                  {savedPaymentMethods.filter((m) => m.type === "upi").length > 0 ? (
                    <div>
                      <h4>Saved UPI IDs</h4>
                      {savedPaymentMethods
                        .filter((m) => m.type === "upi")
                        .map((method) => (
                          <label key={method.id} style={{ display: "block", marginBottom: "8px" }}>
                            <input
                              type="radio"
                              name="upi"
                              value={method.id}
                              checked={selectedPaymentId === method.id}
                              onChange={(e) => setSelectedPaymentId(Number(e.target.value))}
                            />{" "}
                            {method.upiId}
                          </label>
                        ))}
                    </div>
                  ) : (
                    <p>No saved UPI methods found. You can still continue with Cash on Delivery or add one from Account settings.</p>
                  )}
                </div>
              )}

              {paymentMethod === "bank" && (
                <div className="payment-form" style={{ marginTop: "20px", padding: "16px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
                  <h3>Bank Transfer</h3>
                  {savedPaymentMethods.filter((m) => m.type === "bank").length > 0 ? (
                    <div>
                      <h4>Saved Bank Accounts</h4>
                      {savedPaymentMethods
                        .filter((m) => m.type === "bank")
                        .map((method) => (
                          <label key={method.id} style={{ display: "block", marginBottom: "8px" }}>
                            <input
                              type="radio"
                              name="bank"
                              value={method.id}
                              checked={selectedPaymentId === method.id}
                              onChange={(e) => setSelectedPaymentId(Number(e.target.value))}
                            />{" "}
                            {method.bankName} - {method.accountNumber}
                          </label>
                        ))}
                    </div>
                  ) : (
                    <p>No saved bank accounts found. Add one from Account settings or choose another payment option.</p>
                  )}
                </div>
              )}

              <div className="step-buttons">
                <button
                  className="back-btn"
                  onClick={() => setActiveStep(1)}
                >
                  ← Back
                </button>
                <button
                  className="next-btn"
                  onClick={() => {
                    if (validatePayment()) {
                      setActiveStep(3);
                    }
                  }}
                >
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {activeStep === 3 && (
            <div className="checkout-step">
              <h2>✓ Review Your Order</h2>

              <div className="order-review">
                <div className="review-section">
                  <h3>Delivery Details</h3>
                  <p>{formData.fullName}</p>
                  <p>{formData.address}</p>
                  <p>
                    {formData.city}, {formData.state} - {formData.pincode}
                  </p>
                  <p>{formData.phone}</p>
                </div>

                <div className="review-section">
                  <h3>Payment Method</h3>
                  <p>{getPaymentSummary()}</p>
                </div>
              </div>

              <div className="order-items">
                <h3>Order Items ({cartItems.length})</h3>
                {cartItems.map((item) => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <p className="item-price">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="step-buttons">
                <button className="back-btn" onClick={() => setActiveStep(2)}>
                  ← Back
                </button>
                <button
                  className="place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm Order"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="order-summary-sidebar">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <span>{item.name} x{item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span>Total Amount</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
