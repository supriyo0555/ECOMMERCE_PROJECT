import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./signup.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      const result = await signup(formData.name, formData.email, formData.password);

      if (result.success) {
        setSuccessMessage("✅ Account created successfully! Redirecting...");
        // Clear form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect to account page after 1.5 seconds
        setTimeout(() => {
          navigate("/account");
        }, 1500);
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: error.message || "Sign up failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        {/* LEFT SIDE - Brand & Info */}
        <div className="signup-left">
          <div className="signup-brand">SHOPCART</div>
          <h2>Join Us Today</h2>
          <p className="signup-subtitle">
            Create an account to enjoy exclusive deals, save your favorite items, and track your orders.
          </p>
        </div>

        {/* RIGHT SIDE - Registration Form */}
        <div className="signup-right">
          <div className="signup-form-wrapper">
            <button className="close-btn" type="button" onClick={() => navigate("/")} title="Back to Home">
              ✕
            </button>
            <h2>Create Account</h2>

            <form onSubmit={handleSubmit} className="signup-form">
              {successMessage && <div className="success-message">{successMessage}</div>}
              {errors.submit && <div className="error-message">{errors.submit}</div>}

              {/* Name Input */}
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "error" : ""}
                  disabled={isLoading}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  disabled={isLoading}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                  disabled={isLoading}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              {/* Confirm Password Input */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>

              {/* Submit Button */}
              <button type="submit" className="signup-btn" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Login Link */}
            <p className="login-link">
              Already have an account? <a onClick={() => navigate("/login")}>Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
