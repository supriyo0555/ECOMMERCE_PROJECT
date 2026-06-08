const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Seller = require("../models/Seller");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: "user",
      token: generateToken(user._id, "user"),
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
        token: generateToken(user._id, "user"),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

const registerSeller = async (req, res, next) => {
  try {
    const { name, email, password, shopName } = req.body;
    const existingSeller = await Seller.findOne({ email });

    if (existingSeller) {
      res.status(400);
      throw new Error("Seller already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const seller = await Seller.create({
      name,
      email,
      password: hashedPassword,
      shopName,
    });

    res.status(201).json({
      _id: seller._id,
      name: seller.name,
      email: seller.email,
      shopName: seller.shopName,
      role: "seller",
      token: generateToken(seller._id, "seller"),
    });
  } catch (error) {
    next(error);
  }
};

const loginSeller = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });

    if (seller && (await bcrypt.compare(password, seller.password))) {
      res.json({
        _id: seller._id,
        name: seller.name,
        email: seller.email,
        shopName: seller.shopName,
        role: "seller",
        token: generateToken(seller._id, "seller"),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    if (req.authRole === "seller") {
      const seller = await Seller.findById(req.seller._id).select("-password");
      return res.json({
        _id: seller._id,
        name: seller.name,
        email: seller.email,
        shopName: seller.shopName,
        role: "seller",
      });
    }

    const user = await User.findById(req.user._id).select("-password");
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: "user",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  registerSeller,
  loginSeller,
  getMe,
};
