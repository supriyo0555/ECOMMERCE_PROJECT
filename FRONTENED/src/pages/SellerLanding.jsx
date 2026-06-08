import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaRocket, FaChartLine, FaTruck, FaShieldAlt, FaHeadset, FaGraduationCap } from "react-icons/fa";
import { SellerAuthContext } from "../context/SellerAuthContext";
import "./seller-landing.css";

const SellerLanding = () => {
  const navigate = useNavigate();
  const { seller } = useContext(SellerAuthContext);

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const benefits = [
    {
      icon: <FaChartLine />,
      title: "Grow Your Business",
      desc: "Reach millions of customers and increase sales exponentially"
    },
    {
      icon: <FaTruck />,
      title: "Logistics Support",
      desc: "We handle shipping and delivery for you"
    },
    {
      icon: <FaShieldAlt />,
      title: "Trust & Safety",
      desc: "Secure payments and buyer protection guaranteed"
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      desc: "Dedicated seller support team available always"
    },
    {
      icon: <FaGraduationCap />,
      title: "Training & Tools",
      desc: "Free training and advanced selling tools"
    },
    {
      icon: <FaRocket />,
      title: "Fast Growth",
      desc: "Marketing and promotional tools included"
    }
  ];

  const stats = [
    { number: "10M+", label: "Active Buyers" },
    { number: "50K+", label: "Active Sellers" },
    { number: "₹5000Cr+", label: "GMV Per Month" }
  ];

  return (
    <div className="seller-landing">
      {/* HERO SECTION */}
      <section className="seller-hero">
        <div className="seller-hero-overlay"></div>
        <div className="seller-hero-content">
          <h1>Start Selling with ShopHub Today</h1>
          <p>Join thousands of successful sellers and grow your business with our easy-to-use platform</p>

          {seller && (
            <div className="seller-status-banner">
              ✅ {seller.storeName} account is active — open your dashboard directly from here.
            </div>
          )}

          <div className="seller-hero-actions">
            {seller ? (
              <>
                <button className="cta-button dashboard" onClick={() => navigate("/seller-dashboard")}>
                  Open Seller Dashboard
                </button>
                <button className="cta-button primary" onClick={() => navigate("/add-product")}>
                  Add Product
                </button>
              </>
            ) : (
              <>
                <button className="cta-button primary" onClick={() => navigate("/seller-register")}>
                  Create Seller Account
                </button>
                <button className="cta-button outline" onClick={() => navigate("/seller-login")}>
                  Seller Login
                </button>
              </>
            )}

            <button className="cta-button secondary" onClick={scrollToHowItWorks}>
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="seller-stats">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="seller-benefits">
        <div className="benefits-header">
          <h2>Why Choose ShopHub for Your Business?</h2>
          <p>Everything you need to succeed as an online seller</p>
        </div>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="how-it-works">
        <h2>How to Get Started as a Seller</h2>
        <p className="section-subtitle">Follow these simple 4 steps to start selling on ShopHub</p>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up for free and provide your basic business information</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Verify Your Business</h3>
            <p>Complete KYC verification and submit business documents</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Add Your Products</h3>
            <p>Upload product photos, descriptions, and pricing details</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Start Receiving Orders</h3>
            <p>Customers find your products and you start making sales</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="seller-cta">
        <div className="cta-content">
          <h2>Ready to Grow Your Business?</h2>
          <p>
            {seller
              ? "Your seller account is already ready. Use the dashboard button below to manage products and orders."
              : "Join ShopHub today and reach millions of customers."}
          </p>

          <div className="seller-hero-actions cta-actions-center">
            <button
              className="cta-button large"
              onClick={() => navigate(seller ? "/seller-dashboard" : "/seller-register")}
            >
              {seller ? "Go to Seller Dashboard" : "Start Your Seller Journey"}
            </button>

            {seller && (
              <button className="cta-button secondary" onClick={() => navigate("/add-product")}>
                Add Another Product
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="seller-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-card">
            <h4>What is the registration fee?</h4>
            <p>Registration is absolutely free! We charge only when you make sales.</p>
          </div>
          <div className="faq-card">
            <h4>How long does verification take?</h4>
            <p>Most registrations are verified within 24-48 hours.</p>
          </div>
          <div className="faq-card">
            <h4>What products can I sell?</h4>
            <p>You can sell almost anything except prohibited items. Check our policies.</p>
          </div>
          <div className="faq-card">
            <h4>Do you handle shipping?</h4>
            <p>Yes! We have partnerships with major logistics providers for easy shipping.</p>
          </div>
          <div className="faq-card">
            <h4>How do I get paid?</h4>
            <p>Earnings are transferred to your bank account within 5-7 business days.</p>
          </div>
          <div className="faq-card">
            <h4>Is there a commission?</h4>
            <p>Yes, we charge a competitive commission based on product category.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellerLanding;
