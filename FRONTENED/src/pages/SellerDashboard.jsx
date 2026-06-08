import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SellerAuthContext } from "../context/SellerAuthContext";
import "./seller.css";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { seller, sellerLogout, loading } = useContext(SellerAuthContext);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!seller) {
      navigate("/seller-login");
      return;
    }

    const allProducts = JSON.parse(localStorage.getItem("sellerProducts") || "[]");
    setProducts(allProducts);
    setStats({
      totalProducts: allProducts.length,
      totalSales: allProducts.reduce((sum, p) => sum + (p.sold || 0), 0),
      totalOrders: allProducts.length > 0 ? Math.floor(Math.random() * 50) + 10 : 0,
      totalRevenue: allProducts.reduce((sum, p) => sum + (p.price * (p.sold || 0)), 0),
    });
  }, [navigate, seller, loading]);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      sellerLogout();
      navigate("/seller-login");
    }
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter((p) => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem("sellerProducts", JSON.stringify(updatedProducts));
    setStats({
      ...stats,
      totalProducts: updatedProducts.length,
    });
  };

  if (loading) {
    return <div className="loading">Loading seller dashboard...</div>;
  }

  if (!seller) {
    return <div className="loading">Redirecting to seller login...</div>;
  }

  return (
    <div className="seller-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <span className="dashboard-badge">🏪 Active Seller Panel</span>
          <h1>{seller.storeName}</h1>
          <p className="dashboard-subtitle">
            Manage your products, pricing and orders from one place.
          </p>
        </div>

        <div className="header-right seller-profile-card">
          <div className="seller-profile-meta">
            <span className="seller-name">{seller.sellerName}</span>
            <span className="seller-email">{seller.email}</span>
          </div>
          <button
            className="logout-btn-dashboard"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-content">
            <h3>{stats.totalSales}</h3>
            <p>Total Sales</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-seller">
        <button
          className="action-btn primary"
          onClick={() => navigate("/add-product")}
        >
          ➕ Add New Product
        </button>
        <button
          className="action-btn secondary"
          onClick={() => navigate("/seller-products")}
        >
          📋 View All Products
        </button>
        <button className="action-btn secondary">
          📈 View Analytics
        </button>
        <button className="action-btn secondary">
          📦 Manage Orders
        </button>
      </div>

      {/* Products Overview */}
      <div className="products-section">
        <div className="section-header">
          <h2>Your Products</h2>
          <button
            className="view-all-btn"
            onClick={() => navigate("/seller-products")}
          >
            View All →
          </button>
        </div>

        {products.length > 0 ? (
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Sold</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id}>
                    <td className="product-name">
                      <img src={product.image} alt={product.name} />
                      <span>{product.name}</span>
                    </td>
                    <td>₹{product.price}</td>
                    <td>{product.stock || 0}</td>
                    <td>{product.sold || 0}</td>
                    <td>
                      <span className="status-badge active">Active</span>
                    </td>
                    <td className="actions">
                      <button className="edit-btn">Edit</button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No products added yet</p>
            <button
              className="add-product-btn"
              onClick={() => navigate("/add-product")}
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
