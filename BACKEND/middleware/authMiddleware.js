const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Seller = require("../models/Seller");

const authenticateToken = async (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "seller") {
      const seller = await Seller.findById(decoded.id).select("-password");
      if (!seller) {
        throw new Error("Seller not found");
      }
      return { role: "seller", seller };
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return { role: "user", user };
  }

  throw new Error("Not authorized, no token");
};

const protect = async (req, res, next) => {
  try {
    const auth = await authenticateToken(req);
    req.authRole = auth.role;
    req.user = auth.user || null;
    req.seller = auth.seller || null;
    next();
  } catch (error) {
    res.status(401);
    return next(new Error(error.message || "Not authorized, token failed"));
  }
};

const protectSeller = async (req, res, next) => {
  try {
    const auth = await authenticateToken(req);
    if (auth.role !== "seller") {
      res.status(403);
      throw new Error("Seller access only");
    }
    req.authRole = auth.role;
    req.seller = auth.seller;
    next();
  } catch (error) {
    res.status(res.statusCode === 200 ? 401 : res.statusCode);
    return next(new Error(error.message || "Not authorized as seller"));
  }
};

const protectUser = async (req, res, next) => {
  try {
    const auth = await authenticateToken(req);
    if (auth.role !== "user") {
      res.status(403);
      throw new Error("User access only");
    }
    req.authRole = auth.role;
    req.user = auth.user;
    next();
  } catch (error) {
    res.status(res.statusCode === 200 ? 401 : res.statusCode);
    return next(new Error(error.message || "Not authorized as user"));
  }
};

module.exports = { protect, protectSeller, protectUser };
