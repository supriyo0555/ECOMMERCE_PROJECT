import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaStore, FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { SellerAuthContext } from "../context/SellerAuthContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const { cartCount } = useContext(CartContext);
  const { seller } = useContext(SellerAuthContext);

  // Load notification count
  useEffect(() => {
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    const unreadCount = notifications.filter(n => !n.read).length;
    setNotificationCount(unreadCount);
  }, []);

  // Handle text search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      console.log("Searching for:", searchText);
      alert(`Searching for: ${searchText}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top navbar-professional">
      <div className="container">
        {/* Brand Name */}
        <Link to="/" className="navbar-brand text-primary fw-bold fs-3" style={{ color: "#111", fontWeight: "900", textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
          ShopHub
        </Link>

        {/* Mobile Toggle */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Search Bar */}
          <form className="d-flex mx-auto my-2 my-lg-0 search-form" onSubmit={handleSearch}>
            <div className="search-container">
              <input 
                className="form-control search-input" 
                type="search" 
                placeholder="Search products, brands and more" 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button className="btn btn-search" type="submit">
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Action Links */}
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                🏠 Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/account">
                <FaUser className="me-1" /> Account
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/wishlist">
                <FaHeart className="me-1" /> Wishlist
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link notification-link" to="/notifications">
                <FaBell className="me-1" /> Notifications
                {notificationCount > 0 && (
                  <span className="notification-badge">{notificationCount}</span>
                )}
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link cart-link" to="/cart">
                <FaShoppingCart className="me-1" /> Cart
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-link-seller" to="/seller-landing">
                <FaStore className="me-1" /> Become Seller
              </Link>
            </li>

            {seller && (
              <li className="nav-item">
                <Link className="nav-link nav-link-seller" to="/seller-dashboard">
                  📊 Seller Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}