import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./forgotpassword.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter new password
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { forgotPassword, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  // Step 1: Validate email
  const validateEmail = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2: Validate new password
  const validatePassword = () => {
    const newErrors = {};

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Step 1: Request password reset
  const handleRequestReset = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setResetToken(result.resetToken);
        setSuccessMessage(
          "✅ Reset token generated! Check your email for instructions."
        );
        setStep(2);
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({
        submit: error.message || "Failed to request password reset.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 2: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(email, newPassword, resetToken);

      if (result.success) {
        setSuccessMessage("✅ " + result.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: error.message || "Password reset failed." });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Reset Password</h2>
        <p className="forgot-password-subtitle">
          {step === 1
            ? "Enter your email to reset your password"
            : "Enter your new password"}
        </p>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errors.submit && <div className="error-message">{errors.submit}</div>}

        {step === 1 ? (
          // Step 1: Email Verification
          <form onSubmit={handleRequestReset} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
                disabled={isLoading}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <button type="submit" className="reset-btn" disabled={isLoading}>
              {isLoading ? "Processing..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          // Step 2: New Password
          <form onSubmit={handleResetPassword} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="Create a new password (min 6 characters)"
                value={newPassword}
                onChange={handleChange}
                className={errors.newPassword ? "error" : ""}
                disabled={isLoading}
              />
              {errors.newPassword && (
                <span className="error-text">{errors.newPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "error" : ""}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="reset-btn" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              type="button"
              className="back-btn"
              onClick={() => {
                setStep(1);
                setNewPassword("");
                setConfirmPassword("");
                setErrors({});
              }}
              disabled={isLoading}
            >
              ← Back to Email Verification
            </button>
          </form>
        )}

        {/* Back to Login Link */}
        <p className="back-to-login">
          Remember your password?{" "}
          <Link to="/login" className="login-link">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
