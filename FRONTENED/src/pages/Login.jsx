import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    const result = await login(email.trim(), password);
    setIsLoading(false);

    if (result.success) {
      setMessage(result.message);
      navigate("/account");
    } else {
      setError(result.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setMessage("");
    setIsLoading(true);

    const result = await googleLogin();
    setIsLoading(false);

    if (result.success) {
      setMessage(result.message);
      navigate("/account");
    } else {
      setError(result.message);
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-left">
          <div className="brand">SHOPCART</div>
          <h1>Welcome back</h1>
          <p>
            Please log in to continue and get the
            <br />
            best shopping experience!
          </p>
        </div>

        <div className="login-right">
          <div className="login-card">
            <button className="close-btn" type="button" onClick={handleClose} title="Go to Home">
              ✕
            </button>
            <h2>Login</h2>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <div className="forgot-password">
                <a href="/forgot-password">Forgot Password?</a>
              </div>

              <button type="submit" className="continue-btn" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Continue"}
              </button>
            </form>

            <div className="divider">
              <span></span>
              <p>Or, login with</p>
              <span></span>
            </div>

            <button
              className="google-btn"
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <FaGoogle className="google-icon" />
              {isLoading ? "Signing in with Google..." : "Continue with Google"}
            </button>

            <div className="social-login">
              <div className="social-icon">
                <FaFacebookF />
              </div>
              <div className="social-icon">
                <FaLinkedinIn />
              </div>
              <div className="social-icon">
                <FaGithub />
              </div>
            </div>

            <p className="signup-text">
              Don't have an account? <a href="/signup">Create Account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;