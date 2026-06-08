import "./Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <h2 className="logo">ShopHub</h2>
          <p>Your trusted multi-vendor marketplace</p>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li>About Us</li>
            <li>Contact</li>
            <li>Careers</li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Policy</h3>
          <ul>
            <li>Return Policy</li>
            <li>Privacy Policy</li>
            <li>Terms of Use</li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Connect</h3>
          <div className="social-icons">
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
          </div>
        </div>
      </div>

      <hr />

      <p className="footer-bottom">
        © 2026 ShopHub. All rights reserved.
      </p>
    </footer>
  );
}
