import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./ecommerce.css";

const Cart = () => {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const { cartItems, updateCartQuantity, removeFromCart } = useContext(CartContext);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateDiscount = () => {
    return (calculateSubtotal() * discountPercent) / 100;
  };

  const calculateTotal = () => {
    const shipping = calculateSubtotal() > 500 ? 0 : 50;
    return calculateSubtotal() - calculateDiscount() + shipping;
  };

  const handleQuantityChange = (productId, newQuantity) => {
    updateCartQuantity(productId, newQuantity);
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "SAVE10") {
      setDiscountPercent(10);
    } else if (coupon.toUpperCase() === "SAVE20") {
      setDiscountPercent(20);
    } else {
      alert("Invalid coupon code");
      setDiscountPercent(0);
    }
  };

  const continueShopping = () => {
    navigate("/");
  };

  const buyNow = (item) => {
    // Create single item cart for checkout
    localStorage.setItem("checkoutItems", JSON.stringify([item]));
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>🛒 Shopping Cart</h1>
          <p>{cartItems.length} items in cart</p>
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="seller-info">Seller: {item.seller || "ShopHub"}</p>
                    <p className="item-desc">{item.description?.substring(0, 60)}...</p>
                  </div>

                  <div className="item-pricing">
                    <p className="price">₹{item.price}</p>
                  </div>

                  <div className="item-quantity">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>

                  <button
                    className="buy-now-btn"
                    onClick={() => buyNow(item)}
                    style={{
                      backgroundColor: "#2874f0",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginLeft: "8px",
                      fontWeight: "bold"
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="coupon-section">
                <div className="coupon-input">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <button onClick={applyCoupon}>Apply</button>
                </div>
                <p className="coupon-hint">Try: SAVE10 or SAVE20</p>
              </div>

              <div className="summary-line">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>

              {discountPercent > 0 && (
                <div className="summary-line discount">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-₹{calculateDiscount().toFixed(2)}</span>
                </div>
              )}

              <div className="summary-line">
                <span>Shipping</span>
                <span>
                  {calculateSubtotal() > 500 ? (
                    <span className="free">Free</span>
                  ) : (
                    "₹50"
                  )}
                </span>
              </div>

              <div className="summary-total">
                <span>Total Amount</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>

              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>

              <button className="continue-shopping-btn" onClick={continueShopping}>
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Add items to your cart and they will appear here</p>
            <button className="shop-btn" onClick={continueShopping}>
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
