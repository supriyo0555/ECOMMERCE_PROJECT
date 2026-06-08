import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SellerAuthContext } from "../context/SellerAuthContext";
import "./seller.css";

const SellerLogin = () => {
  const navigate = useNavigate();
  const { sellerLogin } = useContext(SellerAuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
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

    try {
      const result = await sellerLogin(formData.email, formData.password);

      if (result.success) {
        // Redirect to seller dashboard
        navigate("/seller-dashboard");
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: error.message || "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-login-page">
      <div className="login-container">
        {/* LEFT SIDE - Brand & Info */}
        <div className="login-left">
          <div className="seller-brand">ShopHub Seller</div>
          <h1>Sell with us</h1>
          <p>
            Access your seller dashboard and manage your products, orders, and business analytics in one place.
          </p>
        </div>

        {/* RIGHT SIDE - Login Form */}
        <div className="login-right">
          <div className="login-form-wrapper">
            <button className="close-btn" type="button" onClick={() => navigate("/")} title="Back to Home">
              ✕
            </button>
            <h2>Seller Login</h2>

            <form onSubmit={handleSubmit} className="login-form">
              {errors.submit && <div className="error-message">{errors.submit}</div>}

              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email or Username"
                  className={errors.email ? "error" : ""}
                  disabled={loading}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}

              <div className="input-group password-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={errors.password ? "error" : ""}
                  disabled={loading}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}

              <button type="submit" className="continue-btn" disabled={loading}>
                {loading ? "Logging in..." : "Continue"}
              </button>

              <p className="login-link">
                Not a seller? <a onClick={() => navigate("/seller-register")}>Register here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
