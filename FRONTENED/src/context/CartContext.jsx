import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart);
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  };

  const removeFromCart = (productId) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updated = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
    setCartCount(updated.reduce((sum, item) => sum + item.quantity, 0));
  };

  const updateCartQuantity = (productId, quantity) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        setCartItems(cart);
        setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
      }
    }
  };

  const clearCart = () => {
    localStorage.setItem("cart", JSON.stringify([]));
    setCartItems([]);
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{ cartCount, cartItems, addToCart, removeFromCart, updateCartQuantity, clearCart, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};
