import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SellerAuthContext } from "../context/SellerAuthContext";
import "./seller.css";

const SellerRegister = () => {
  const navigate = useNavigate();
  const { sellerSignup } = useContext(SellerAuthContext);
  const [formData, setFormData] = useState({
    storeName: "",
    sellerName: "",
    email: "",
    phone: "",
    businessType: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gst: "",
    panCard: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.storeName.trim()) {
      newErrors.storeName = "Store name is required";
    }
    if (!formData.sellerName.trim()) {
      newErrors.sellerName = "Seller name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone || formData.phone.length !== 10) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.businessType) {
      newErrors.businessType = "Please select business type";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.pincode || formData.pincode.length !== 6) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }
    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    }
    if (!formData.ifscCode.trim() || formData.ifscCode.length !== 11) {
      newErrors.ifscCode = "Please enter a valid 11-character IFSC code";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (["phone", "pincode", "accountNumber"].includes(name)) {
      formattedValue = value.replace(/\D/g, "");
    }

    if (["ifscCode", "gst", "panCard"].includes(name)) {
      formattedValue = value.toUpperCase();
    }

    setFormData({ ...formData, [name]: formattedValue });

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    try {
      const businessDetails = {
        phone: formData.phone,
        businessType: formData.businessType,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        gst: formData.gst,
        panCard: formData.panCard,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
      };

      const result = await sellerSignup(
        formData.storeName,
        formData.sellerName,
        formData.email,
        formData.password,
        businessDetails
      );

      if (result.success) {
        setSuccessMessage("✅ Seller account created successfully! Redirecting...");
        // Clear form
        setFormData({
          storeName: "",
          sellerName: "",
          email: "",
          phone: "",
          businessType: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          gst: "",
          panCard: "",
          bankName: "",
          accountNumber: "",
          ifscCode: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect to seller dashboard after 1.5 seconds
        setTimeout(() => {
          navigate("/seller-dashboard");
        }, 1500);
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: error.message || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-register-page">
      <div className="register-container">
        {/* LEFT SIDE - Brand & Info */}
        <div className="register-left">
          <div className="seller-brand">ShopHub Seller</div>
          <h1>Ready to Sell?</h1>
          <p>
            Join thousands of successful sellers on ShopHub. Reach millions of customers and grow your business today.
          </p>
        </div>

        {/* RIGHT SIDE - Registration Form */}
        <div className="register-header">
          <div className="register-form-wrapper">
            <button className="close-btn" type="button" onClick={() => navigate("/")} title="Back to Home">
              ✕
            </button>
            <h2>Become a Seller</h2>

            <form onSubmit={handleSubmit} className="register-form">
              {successMessage && <div className="success-message">{successMessage}</div>}
              {errors.submit && <div className="error-message">{errors.submit}</div>}

              <div className="form-section">
                <h3>Store & Personal Info</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Store Name *</label>
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      placeholder="Your store name"
                      className={errors.storeName ? "error" : ""}
                      disabled={loading}
                    />
                    {errors.storeName && <span className="error-text">{errors.storeName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Seller Name *</label>
                    <input
                      type="text"
                      name="sellerName"
                      value={formData.sellerName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={errors.sellerName ? "error" : ""}
                      disabled={loading}
                    />
                    {errors.sellerName && <span className="error-text">{errors.sellerName}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={errors.email ? "error" : ""}
                      disabled={loading}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      maxLength="10"
                      className={errors.phone ? "error" : ""}
                      disabled={loading}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Business Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Business Type *</label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className={errors.businessType ? "error" : ""}
                      disabled={loading}
                    >
                      <option value="">Select type</option>
                      <option value="individual">Individual</option>
                      <option value="partnership">Partnership</option>
                      <option value="private-limited">Private Limited</option>
                      <option value="llp">LLP</option>
                    </select>
                    {errors.businessType && <span className="error-text">{errors.businessType}</span>}
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className={errors.city ? "error" : ""}
                      disabled={loading}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Business Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House no, road, area"
                      className={errors.address ? "error" : ""}
                      disabled={loading}
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className={errors.state ? "error" : ""}
                      disabled={loading}
                    />
                    {errors.state && <span className="error-text">{errors.state}</span>}
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      maxLength="6"
                      className={errors.pincode ? "error" : ""}
                      disabled={loading}
                    />
                    {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Bank Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Bank Name *</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="Bank name"
                      className={errors.bankName ? "error" : ""}
                      disabled={loading}
                    />
                    {errors.bankName && <span className="error-text">{errors.bankName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Account Number *</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="Account number"
                      className={errors.accountNumber ? "error" : ""}
                      disabled={loading}
                    />
                    {errors.accountNumber && <span className="error-text">{errors.accountNumber}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>IFSC Code *</label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      placeholder="SBIN0001234"
                      maxLength="11"
                      className={errors.ifscCode ? "error" : ""}
                      disabled={loading}
                    />
                    {errors.ifscCode && <span className="error-text">{errors.ifscCode}</span>}
                  </div>
                  <div className="form-group">
                    <label>GST Number</label>
                    <input
                      type="text"
                      name="gst"
                      value={formData.gst}
                      onChange={handleChange}
                      placeholder="Optional GST number"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>PAN Card Number</label>
                    <input
                      type="text"
                      name="panCard"
                      value={formData.panCard}
                      onChange={handleChange}
                      placeholder="Optional PAN number"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Password</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 8 characters"
                      minLength="8"
                      className={errors.password ? "error" : ""}
                      disabled={loading}
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                  </div>
                  <div className="form-group">
                    <label>Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter"
                      minLength="8"
                      className={errors.confirmPassword ? "error" : ""}
                      disabled={loading}
                    />
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <p className="login-link">
                Already a seller? <a onClick={() => navigate("/seller-login")}>Login here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;
