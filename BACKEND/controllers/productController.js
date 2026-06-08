const Product = require("../models/Product");

const getProducts = async (req, res, next) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword
      ? {
          name: { $regex: req.query.keyword, $options: "i" },
        }
      : {};

    const categoryFilter = req.query.category
      ? { category: { $regex: req.query.category, $options: "i" } }
      : {};

    const sellerFilter = req.query.seller
      ? { seller: req.query.seller }
      : {};

    const query = { ...keyword, ...categoryFilter, ...sellerFilter };
    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("seller", "name shopName email")
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name shopName email"
    );

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    if (!req.seller) {
      res.status(403);
      throw new Error("Seller authorization required to create products");
    }

    const { name, description, price, category, countInStock, stock, images, image, sku, specifications } = req.body;

    const product = await Product.create({
      seller: req.seller._id,
      name,
      description,
      price,
      category,
      countInStock: countInStock || stock || 0,
      images: images || (image ? [image] : []),
      sku,
      specifications,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (!req.seller || !product.seller.equals(req.seller._id)) {
      res.status(403);
      throw new Error("Not authorized to update this product");
    }

    const { name, description, price, category, countInStock, stock, images, image, sku, specifications } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (countInStock !== undefined) product.countInStock = countInStock;
    if (stock !== undefined) product.countInStock = stock;
    if (images !== undefined) product.images = images;
    if (image !== undefined) product.images = image ? [image] : [];
    if (sku !== undefined) product.sku = sku;
    if (specifications !== undefined) product.specifications = specifications;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (!req.seller || !product.seller.equals(req.seller._id)) {
      res.status(403);
      throw new Error("Not authorized to delete this product");
    }

    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
