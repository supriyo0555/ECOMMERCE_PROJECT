const express = require("express");
const {
  createOrder,
  getOrderById,
  getUserOrders,
} = require("../controllers/orderController");
const { protectUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protectUser, createOrder);
router.route("/myorders").get(protectUser, getUserOrders);
router.route("/:id").get(protectUser, getOrderById);

module.exports = router;
