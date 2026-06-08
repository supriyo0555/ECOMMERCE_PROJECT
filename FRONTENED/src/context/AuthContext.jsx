import { createContext, useState, useEffect, useCallback } from "react";

// Create Auth Context
export const AuthContext = createContext();

// Auth Context Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (on mount)
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user token exists in localStorage and verify with backend
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser({
            id: data._id,
            name: data.name,
            email: data.email,
            role: data.role
          });
          localStorage.setItem("user", JSON.stringify({
            id: data._id,
            name: data.name,
            email: data.email
          }));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
    } catch (err) {
      console.error("Error checking auth status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign Up Function
  const signup = useCallback(async (name, email, password) => {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: data._id,
        name: data.name,
        email: data.email,
      }));

      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
      });

      return { success: true, message: "Account created successfully!" };
    } catch (err) {
      const errorMessage = err.message || "Sign up failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Login Function
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: data._id,
        name: data.name,
        email: data.email,
      }));

      setUser({
        id: data._id,
        name: data.name,
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

  // Google Login Function
  const googleLogin = useCallback(async (email = "googleuser@example.com", name = "Google User") => {
    try {
      setError(null);
      setLoading(true);

      const usersJson = localStorage.getItem("users");
      const users = usersJson ? JSON.parse(usersJson) : [];

      let foundUser = users.find((u) => u.email === email);
      if (!foundUser) {
        foundUser = {
          id: Date.now().toString(),
          name,
          email,
          password: "",
          createdAt: new Date().toISOString(),
          isGoogleUser: true,
        };
        users.push(foundUser);
        localStorage.setItem("users", JSON.stringify(users));
      }

      const token = btoa(`${email}:${Date.now()}`);
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true, message: "Login with Google successful!" };
    } catch (err) {
      const errorMessage = err.message || "Google login failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout Function
  const logout = useCallback(() => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setError(null);
      return { success: true, message: "Logged out successfully!" };
    } catch (err) {
      const errorMessage = "Logout failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, []);

  // Forgot Password Function
  const forgotPassword = useCallback(async (email) => {
    try {
      setError(null);

      // Get users from localStorage
      const usersJson = localStorage.getItem("users");
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Find user by email
      const foundUser = users.find((u) => u.email === email);

      if (!foundUser) {
        throw new Error("Email not found in our system.");
      }

      // Generate reset token (in production, send via email)
      const resetToken = btoa(`${email}:${Date.now()}`);
      const resetData = {
        email,
        resetToken,
        expiresAt: Date.now() + 3600000, // 1 hour expiry
      };

      localStorage.setItem("passwordReset", JSON.stringify(resetData));

      return {
        success: true,
        message: "Password reset token generated. Check your email.",
        resetToken, // In production, this would be sent via email
      };
    } catch (err) {
      const errorMessage = err.message || "Password reset failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, []);

  // Reset Password Function
  const resetPassword = useCallback(async (email, newPassword, resetToken) => {
    try {
      setError(null);

      // Get reset data from localStorage
      const resetDataJson = localStorage.getItem("passwordReset");
      const resetData = resetDataJson ? JSON.parse(resetDataJson) : null;

      // Verify reset token
      if (!resetData || resetData.email !== email || resetData.resetToken !== resetToken) {
        throw new Error("Invalid or expired reset token.");
      }

      // Check if token has expired
      if (resetData.expiresAt < Date.now()) {
        localStorage.removeItem("passwordReset");
        throw new Error("Reset token has expired. Please request a new one.");
      }

      // Update user password
      const usersJson = localStorage.getItem("users");
      const users = usersJson ? JSON.parse(usersJson) : [];

      const userIndex = users.findIndex((u) => u.email === email);
      if (userIndex === -1) {
        throw new Error("User not found.");
      }

      users[userIndex].password = btoa(newPassword);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.removeItem("passwordReset");

      return { success: true, message: "Password reset successfully! Please login with your new password." };
    } catch (err) {
      const errorMessage = err.message || "Password reset failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, []);

  // Context value
  const value = {
    user,
    loading,
    error,
    signup,
    login,
    googleLogin,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
