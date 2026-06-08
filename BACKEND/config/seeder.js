const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Seller = require("../models/Seller");
const Product = require("../models/Product");

const seedDatabase = async () => {
  try {
    // 1. Seed Seller if none exists
    let seller = await Seller.findOne({ email: "seller@example.com" });
    if (!seller) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);
      
      seller = await Seller.create({
        name: "Default Seller",
        email: "seller@example.com",
        password: hashedPassword,
        shopName: "TechGalaxy",
        isVerified: true
      });
      console.log("Seeded default seller: seller@example.com / password123");
    }

    // 2. Seed User if none exists
    let user = await User.findOne({ email: "customer@example.com" });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);

      user = await User.create({
        name: "Default Customer",
        email: "customer@example.com",
        password: hashedPassword,
        isSeller: false
      });
      console.log("Seeded default customer: customer@example.com / password123");
    }

    // 3. Seed Products if none exists
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const defaultProducts = [
        {
          seller: seller._id,
          name: "Wireless Headphones Pro",
          price: 2999,
          description: "Premium wireless headphones with active noise cancellation, deep bass, and 40 hours of battery life.",
          category: "electronics",
          countInStock: 25,
          images: ["/images/headphone.png"],
          sku: "WHP-001"
        },
        {
          seller: seller._id,
          name: "Smart Watch Series X",
          price: 8499,
          description: "Advanced fitness tracking smartwatch with heart rate monitor, sleep tracker, and AMOLED display.",
          category: "electronics",
          countInStock: 15,
          images: ["/images/Smart Watch Black.png"],
          sku: "SWX-002"
        },
        {
          seller: seller._id,
          name: "USB-C Cable 2M",
          price: 299,
          description: "Fast charging, durable braided USB-C to USB-C cable (2 meters).",
          category: "electronics",
          countInStock: 100,
          images: ["/images/usb-cable-type-c.png"],
          sku: "USB-003"
        },
        {
          seller: seller._id,
          name: "Phone Stand",
          price: 399,
          description: "Multi-angle adjustable aluminum desk phone stand, compatible with all smartphones.",
          category: "electronics",
          countInStock: 50,
          images: ["/images/phonestand.png"],
          sku: "PS-004"
        },
        {
          seller: seller._id,
          name: "Portable Charger",
          price: 1299,
          description: "20000mAh external battery pack power bank with high-speed charging ports.",
          category: "electronics",
          countInStock: 30,
          images: ["/images/portable-charger.png"],
          sku: "PC-005"
        },
        {
          seller: seller._id,
          name: "Screen Protector",
          price: 199,
          description: "Tempered glass screen protector, anti-scratch and bubble-free.",
          category: "electronics",
          countInStock: 150,
          images: ["/images/Screen Protector.png"],
          sku: "SP-006"
        },
        {
          seller: seller._id,
          name: "Phone Case Pro",
          price: 499,
          description: "Military-grade drop protective clear phone case with raised edges.",
          category: "electronics",
          countInStock: 80,
          images: ["/images/phone cases.png"],
          sku: "PC-007"
        },
        {
          seller: seller._id,
          name: "Bluetooth Speaker",
          price: 1999,
          description: "IPX7 waterproof portable Bluetooth speaker with stereo sound and 12 hours playtime.",
          category: "electronics",
          countInStock: 40,
          images: ["/images/Bluetooth Speaker.png"],
          sku: "BTS-008"
        }
      ];

      await Product.insertMany(defaultProducts);
      console.log("Seeded 8 default products associated with default seller");
    }
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
};

module.exports = seedDatabase;
