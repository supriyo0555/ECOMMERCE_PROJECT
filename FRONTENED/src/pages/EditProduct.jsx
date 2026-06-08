import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./seller.css";

const EditProduct = () => {
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
  const [fetching, setFetching] = useState(true);
  const productId = localStorage.getItem("editingProductId");

  useEffect(() => {
    const checkAuthAndFetchProduct = async () => {
      const hasSellerSession = !!localStorage.getItem("sellerToken");
      if (!hasSellerSession) {
        navigate("/seller-login");
        return;
      }

      if (!productId) {
        setError("No product selected for editing.");
        setFetching(false);
        return;
      }

      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const product = await res.json();
          setFormData({
            name: product.name || "",
            category: product.category || "",
            price: product.price ? product.price.toString() : "",
            stock: product.countInStock !== undefined ? product.countInStock.toString() : "",
            description: product.description || "",
            image: (product.images && product.images[0]) || product.image || "",
            sku: product.sku || "",
            specifications: product.specifications || "",
          });
        } else {
          setError("Failed to fetch product details.");
        }
      } catch (err) {
        console.error(err);
        setError("Error loading product data.");
      } finally {
        setFetching(false);
      }
    };

    checkAuthAndFetchProduct();
  }, [navigate, productId]);

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
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
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
        throw new Error(data.message || "Failed to update product");
      }

      setSuccess(true);
      setTimeout(() => {
        localStorage.removeItem("editingProductId");
        navigate("/seller-dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="add-product-page">
        <div className="product-container text-center py-5">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-product-page">
      <div className="product-container">
        <div className="product-header">
          <h1>✏️ Edit Product</h1>
          <p>Update your product listing details below</p>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              Product updated successfully! Redirecting to dashboard...
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
              {loading ? "Updating Product..." : "Update Product"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                localStorage.removeItem("editingProductId");
                navigate("/seller-dashboard");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
