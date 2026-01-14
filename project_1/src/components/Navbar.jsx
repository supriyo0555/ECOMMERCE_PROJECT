import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaStore } from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Brand Name */}
        <a className="navbar-brand text-primary fw-bold fs-3" href="#">
          ShopHub
        </a>

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
          <form className="d-flex mx-auto my-2 my-lg-0 w-50">
            <input 
              className="form-control me-2" 
              type="search" 
              placeholder="Search products, brands and more" 
            />
            <button className="btn btn-orange" type="submit">
              <FaSearch />
            </button>
          </form>

          {/* Action Links */}
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <FaUser className="me-1" /> Account
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Login</a></li>
                <li><a className="dropdown-item" href="#">Signup</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <FaHeart className="me-1" /> Wishlist
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <FaShoppingCart className="me-1" /> Cart
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <FaStore className="me-1" /> Become Seller
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}