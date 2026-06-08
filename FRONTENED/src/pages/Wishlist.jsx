import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./wishlist.css";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlistItems(wishlist);
  }, []);

  const removeFromWishlist = (productId) => {
    const updated = wishlistItems.filter((item) => item.id !== productId);
    setWishlistItems(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Item added to cart!");
    removeFromWishlist(item.id);
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        {/* LEFT SIDE - HERO SECTION */}
        <div className="wishlist-left">
          <div className="wishlist-brand">SHOPCART</div>
          <h1>Your Saved Favorites</h1>
          <p>Keep track of items you love and get them when you're ready.</p>
          
          <div className="wishlist-features">
            <div className="feature-item">Quick add to cart from your wishlist</div>
            <div className="feature-item">Never miss your favorite products</div>
            <div className="feature-item">Curated collection just for you</div>
          </div>
        </div>

        {/* RIGHT SIDE - CONTENT */}
        <div className="wishlist-right">
          <div className="wishlist-header">
            <h1>❤️ My Wishlist</h1>
            <p>{wishlistItems.length} items saved</p>
          </div>

          {wishlistItems.length > 0 ? (
            <div className="wishlist-grid">
              {wishlistItems.map((item) => (
                <div key={item.id} className="wishlist-card">
                  <div className="card-image">
                    <img src={item.image} alt={item.name} />
                    <button
                      className="remove-wishlist-btn"
                      onClick={() => removeFromWishlist(item.id)}
                      title="Remove from wishlist"
                    >
                      ❤️
                    </button>
                  </div>
                  <div className="card-content">
                    <h3>{item.name}</h3>
                    <p className="seller">{item.seller || "ShopHub"}</p>
                    <p className="description">{item.description?.substring(0, 60)}...</p>
                  </div>
                  <div className="card-footer">
                    <div className="price-section">
                      <span className="price">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="original-price">₹{item.originalPrice}</span>
                      )}
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-wishlist">
              <div className="empty-icon">❤️</div>
              <h2>Your Wishlist is Empty</h2>
              <p>Save your favorite items to your wishlist and buy them later</p>
              <button
                className="shop-btn"
                onClick={() => navigate("/")}
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
