import { useNavigate } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Big New Year Sale 2026</h1>
        <p>Up to 80% Off on Top Brands</p>
        <div className="hero-buttons">
          <button className="shop-now-btn" onClick={() => window.scrollTo(0, 500)}>
            Shop Now
          </button>
          <button className="become-seller-hero-btn" onClick={() => navigate("/seller-landing")}>
            ✨ Become Seller
          </button>
        </div>
      </div>
    </section>
  );
}