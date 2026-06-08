import { createContext, useState, useEffect, useCallback } from "react";

// Create Seller Auth Context
export const SellerAuthContext = createContext();

// Seller Auth Context Provider Component
export const SellerAuthProvider = ({ children }) => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if seller is already logged in (on mount)
  useEffect(() => {
    checkSellerAuthStatus();
  }, []);

  // Check if seller token exists in localStorage and verify with backend
  const checkSellerAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("sellerToken");
      if (token) {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setSeller({
            id: data._id,
            storeName: data.shopName,
            sellerName: data.name,
            email: data.email,
          });
          localStorage.setItem("seller", JSON.stringify({
            id: data._id,
            storeName: data.shopName,
            sellerName: data.name,
            email: data.email,
          }));
        } else {
          localStorage.removeItem("sellerToken");
          localStorage.removeItem("seller");
          setSeller(null);
        }
      }
    } catch (err) {
      console.error("Error checking seller auth status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Seller Sign Up Function
  const sellerSignup = useCallback(async (storeName, sellerName, email, password, businessDetails) => {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch("/api/auth/seller/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: sellerName, email, password, shopName: storeName })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Seller registration failed");
      }

      localStorage.setItem("sellerToken", data.token);
      localStorage.setItem("seller", JSON.stringify({
        id: data._id,
        storeName: data.shopName,
        sellerName: data.name,
        email: data.email,
      }));

      setSeller({
        id: data._id,
        storeName: data.shopName,
        sellerName: data.name,
        email: data.email,
      });

      return { success: true, message: "Seller account created successfully!" };
    } catch (err) {
      const errorMessage = err.message || "Seller sign up failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Seller Login Function
  const sellerLogin = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch("/api/auth/seller/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("sellerToken", data.token);
      localStorage.setItem("seller", JSON.stringify({
        id: data._id,
        storeName: data.shopName,
        sellerName: data.name,
        email: data.email,
      }));

      setSeller({
        id: data._id,
        storeName: data.shopName,
        sellerName: data.name,
        email: data.email,
      });

      return { success: true, message: "Login successful!" };
    } catch (err) {
      const errorMessage = err.message || "Login failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Seller Logout Function
  const sellerLogout = useCallback(() => {
    try {
      localStorage.removeItem("sellerToken");
      localStorage.removeItem("seller");
      setSeller(null);
      setError(null);
      return { success: true, message: "Logged out successfully!" };
    } catch (err) {
      const errorMessage = "Logout failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, []);

  // Context value
  const value = {
    seller,
    loading,
    error,
    sellerSignup,
    sellerLogin,
    sellerLogout,
    isSellerAuthenticated: !!seller,
  };

  return (
    <SellerAuthContext.Provider value={value}>
      {children}
    </SellerAuthContext.Provider>
  );
};
