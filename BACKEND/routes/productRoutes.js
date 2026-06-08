const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protectSeller } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getProducts).post(protectSeller, createProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(protectSeller, updateProduct)
  .delete(protectSeller, deleteProduct);

module.exports = router;
