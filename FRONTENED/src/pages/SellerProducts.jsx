import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SellerAuthContext } from "../context/SellerAuthContext";
import "./seller.css";

const SellerProducts = () => {
  const navigate = useNavigate();
  const { seller, loading } = useContext(SellerAuthContext);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    if (loading) {
      return;
    }

    const token = localStorage.getItem("sellerToken");
    if (!seller && !token) {
      navigate("/seller-login");
      return;
    }

    const fetchSellerProducts = async () => {
      try {
        const sellerId = seller?.id || JSON.parse(localStorage.getItem("seller"))?.id;
        if (!sellerId) return;

        const res = await fetch(`/api/products?seller=${sellerId}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Error fetching seller products:", err);
      }
    };

    fetchSellerProducts();
  }, [navigate, seller, loading]);

  const handleDeleteProduct = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("sellerToken");
        const res = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          setProducts(products.filter((p) => (p._id || p.id) !== productId));
          alert("Product deleted successfully");
        } else {
          const data = await res.json();
          alert(data.message || "Failed to delete product");
        }
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product");
      }
    }
  };

  const handleEditProduct = (productId) => {
    // Store product to edit
    localStorage.setItem("editingProductId", productId);
    navigate("/edit-product");
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="seller-products-page">
      <div className="products-container">
        <div className="products-header">
          <div>
            <h1>📋 My Products</h1>
            <p>Manage and monitor your product listings</p>
          </div>
          <button
            className="add-new-btn"
            onClick={() => navigate("/add-product")}
          >
            ➕ Add New Product
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="category-filter">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Living</option>
              <option value="sports">Sports</option>
              <option value="books">Books</option>
              <option value="beauty">Beauty & Personal Care</option>
              <option value="toys">Toys & Games</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const productId = product._id || product.id;
              const productImage = (product.images && product.images[0]) || product.image || "/images/headphone.png";
              const productStock = product.countInStock !== undefined ? product.countInStock : product.stock;

              return (
                <div key={productId} className="product-card">
                  <div className="product-image">
                    <img src={productImage} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="sku">SKU: {product.sku || "N/A"}</p>
                    <p className="category">{product.category}</p>

                    <div className="product-stats">
                      <div className="stat">
                        <span className="label">Price</span>
                        <span className="value">₹{product.price}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Stock</span>
                        <span className="value">{productStock}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Sold</span>
                        <span className="value">{product.sold || 0}</span>
                      </div>
                    </div>

                    {product.description && (
                      <p className="description">{product.description.substring(0, 80)}...</p>
                    )}

                    <div className="product-actions">
                      <button
                        className="edit-product-btn"
                        onClick={() => handleEditProduct(productId)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="delete-product-btn"
                        onClick={() => handleDeleteProduct(productId)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h2>No Products Found</h2>
            <p>
              {products.length === 0
                ? "You haven't added any products yet. Start by adding your first product!"
                : "No products match your search criteria."}
            </p>
            <button
              className="add-product-btn"
              onClick={() => navigate("/add-product")}
            >
              ➕ Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;
