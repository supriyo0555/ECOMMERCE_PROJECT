import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./seller.css";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    sku: "",
    specifications: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validation
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    if (isNaN(formData.price) || isNaN(formData.stock)) {
      setError("Price and Stock must be numbers");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("sellerToken");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          description: formData.description,
          image: formData.image,
          sku: formData.sku,
          specifications: formData.specifications
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      setSuccess(true);
      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        image: "",
        sku: "",
        specifications: "",
      });

      setTimeout(() => {
        navigate("/seller-dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to add product. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="add-product-page">
      <div className="product-container">
        <div className="product-header">
          <h1>➕ Add New Product</h1>
          <p>Fill in the details below to list your product</p>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              Product added successfully! Redirecting to dashboard...
            </div>
          )}

          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="form-group">
                <label>SKU *</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Stock Keeping Unit"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Living</option>
                  <option value="sports">Sports</option>
                  <option value="books">Books</option>
                  <option value="beauty">Beauty & Personal Care</option>
                  <option value="toys">Toys & Games</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Pricing & Inventory</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Description & Details</h3>
            <div className="form-row">
              <div className="form-group full-width">
                <label>Product Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product in detail"
                  rows="5"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Specifications</label>
                <textarea
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleChange}
                  placeholder="e.g., Color: Red, Size: M, Material: Cotton"
                  rows="4"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Product Image</h3>
            <div className="form-row">
              <div className="form-group full-width">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            {formData.image && (
              <div className="image-preview">
                <img src={formData.image} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding Product..." : "Add Product"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/seller-dashboard")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
