import "./beforelogin.css";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaShieldAlt, FaCreditCard, FaTruck, FaHeadphones } from "react-icons/fa";

const BeforeLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="account-page">
      {/* Hero Section */}
      <div className="login-section">
        <div className="login-content">
          <div className="login-icon"><FaUser /></div>
          <div className="login-text">
            <h2>Your Account</h2>
            <p>Sign in to access your personalized experience</p>
          </div>
        </div>
        <div className="login-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Sign In
          </button>
          <button className="signup-btn" onClick={() => navigate("/signup")}>
            Create Account
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon"><FaCreditCard /></div>
          <h3>Easy Payments</h3>
          <p>Multiple payment options for convenient shopping</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><FaTruck /></div>
          <h3>Fast Delivery</h3>
          <p>Quick and reliable shipping to your doorstep</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><FaShieldAlt /></div>
          <h3>Secure & Safe</h3>
          <p>Your data is protected with industry-leading security</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><FaHeadphones /></div>
          <h3>24/7 Support</h3>
          <p>Round-the-clock customer support at your service</p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <h2>Why Create an Account?</h2>
        <div className="benefits-list">
          <div className="benefit-item">
            <span className="benefit-number">✓</span>
            <div>
              <h4>Track Orders</h4>
              <p>Monitor your purchases in real-time</p>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-number">✓</span>
            <div>
              <h4>Exclusive Deals</h4>
              <p>Access member-only offers and discounts</p>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-number">✓</span>
            <div>
              <h4>Wishlists</h4>
              <p>Save your favorite items for later</p>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-number">✓</span>
            <div>
              <h4>Rewards</h4>
              <p>Earn points on every purchase</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h3>Ready to Get Started?</h3>
        <p>Join thousands of happy customers</p>
        <button className="cta-btn" onClick={() => navigate("/signup")}>Sign Up Now</button>
      </div>
    </div>
  );
};

export default BeforeLogin;
