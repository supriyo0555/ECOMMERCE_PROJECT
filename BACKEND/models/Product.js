const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    sku: { type: String },
    specifications: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
