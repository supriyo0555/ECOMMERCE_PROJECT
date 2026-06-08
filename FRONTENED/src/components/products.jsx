import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import "./products.css";

const fallbackProducts = [
  {
    id: 1, title: "Wireless Headphones Pro",
    price: 2999,
    oldPrice: 4999,
    img: "/images/headphone.png",
    rating: "4.5", vendor: "AudioTech Store", sku: "WHP-001",
    description: "Premium wireless headphones with noise cancellation"
  },
  {
    id: 2,
    title: "Smart Watch Series X",
    price: 8499, oldPrice: 12999,
    img: "/images/Smart Watch Black.png",
    rating: "4.7",
    vendor: "GadgetHub",
    sku: "SWX-002",
    description: "Advanced fitness tracking smartwatch"
  },
  {
    id: 3,
    title: "USB-C Cable 2M",
    price: 299,
    oldPrice: 599,
    img: "/images/usb-cable-type-c.png",
    rating: "4.4",
    vendor: "TechStore",
    sku: "USB-003",
    description: "Fast charging USB-C cable"
  },
  {
    id: 4,
    title: "Phone Stand",
    price: 399,
    oldPrice: 799,
    img: "/images/phonestand.png",
    rating: "4.6",
    vendor: "Accessory Hub",
    sku: "PS-004",
    description: "Adjustable phone stand"
  },
  {
    id: 5,
    title: "Portable Charger",
    price: 1299, oldPrice: 2499,
    img: "/images/portable-charger.png",
    rating: "4.8",
    vendor: "PowerBox",
    sku: "PC-005",
    description: "20000mAh power bank"
  },
  {
    id: 6,
    title: "Screen Protector",
    price: 199, oldPrice: 499,
    img: "/images/Screen Protector.png",
    rating: "4.3",
    vendor: "ScreenGuard",
    sku: "SP-006",
    description: "Tempered glass screen protector"
  },
  {
    id: 7,
    title: "Phone Case Pro",
    price: 499, oldPrice: 999,
    img: "/images/phone cases.png",
    rating: "4.5",
    vendor: "CaseBox",
    sku: "PC-007",
    description: "Durable protective phone case"
  },
  {
    id: 8,
    title: "Bluetooth Speaker",
    price: 1999,
    oldPrice: 3999,
    img: "/images/Bluetooth Speaker.png",
    rating: "4.6",
    vendor: "AudioTech Store",
    sku: "BTS-008",
    description: "Waterproof portable bluetooth speaker"
  }
];

export default function Products() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart: addToCartContext } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (data && data.products && data.products.length > 0) {
            setProducts(data.products);
          } else {
            setProducts(fallbackProducts);
          }
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Show notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  // Add to cart
  const addToCart = (product) => {
    const isLoggedIn = localStorage.getItem("token") ? true : false;

    if (!isLoggedIn) {
      showNotification("❌ Please login first to add items to cart");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const productId = product._id || product.id;
    const productName = product.name || product.title;
    const productPrice = product.price;
    const productImage = (product.images && product.images[0]) || product.image || product.img || "/images/headphone.png";
    const productVendor = (product.seller && (product.seller.shopName || product.seller.name)) || product.vendor || "Unknown Vendor";

    const cartProduct = {
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      description: product.description,
      seller: productVendor,
      sku: product.sku || "N/A",
      rating: product.rating || "4.5"
    };

    addToCartContext(cartProduct);
    showNotification(`✓ ${productName} added to cart`);
  };

  // Add to wishlist
  const addToWishlist = (product) => {
    const isLoggedIn = localStorage.getItem("token") ? true : false;

    if (!isLoggedIn) {
      showNotification("❌ Please login first to add to wishlist");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const productId = product._id || product.id;
    const productName = product.name || product.title;
    const productPrice = product.price;
    const productImage = (product.images && product.images[0]) || product.image || product.img || "/images/headphone.png";
    const productVendor = (product.seller && (product.seller.shopName || product.seller.name)) || product.vendor || "Unknown Vendor";

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const existingItem = wishlist.find(item => item.id === productId);

    if (!existingItem) {
      const wishlistProduct = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        description: product.description,
        seller: productVendor,
        sku: product.sku || "N/A",
        rating: product.rating || "4.5"
      };
      wishlist.push(wishlistProduct);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      showNotification(`❤️ ${productName} added to wishlist`);
    } else {
      showNotification(`Already in wishlist!`);
    }
  };

  // Check if in wishlist
  const isInWishlist = (productId) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    return wishlist.some(item => item.id === productId);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="py-5 container products-section">
      {notification && (
        <div className="notification-toast">
          {notification}
        </div>
      )}

      <h2 className="text-center mb-5">Featured Products</h2>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {products.map((product) => {
          const productId = product._id || product.id;
          const productName = product.name || product.title;
          const productImage = (product.images && product.images[0]) || product.image || product.img || "/images/headphone.png";
          const productVendor = (product.seller && (product.seller.shopName || product.seller.name)) || product.vendor || "Unknown Vendor";
          const oldPrice = product.oldPrice || Math.round(product.price * 1.5);

          return (
            <div key={productId} className="col">
              <div className="card h-100 shadow-sm border-0 product-card">
                <div className="product-image-wrapper">
                  <img
                    src={productImage}
                    className="card-img-top p-3"
                    alt={productName}
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                  <button
                    className={`wishlist-btn ${isInWishlist(productId) ? 'active' : ''}`}
                    onClick={() => addToWishlist(product)}
                    title="Add to wishlist"
                  >
                    <FaHeart />
                  </button>
                </div>

                <div className="card-body">
                  <h6 className="card-title fw-bold">{productName}</h6>
                  <p className="text-muted small mb-1">Sold by: {productVendor}</p>
                  <div className="mb-2">
                    <span className="badge bg-success">{product.rating || "4.5"} ★</span>
                  </div>
                  <h5 className="text-primary mb-3">
                    ₹{product.price.toLocaleString()}
                    <del className="text-muted small ms-2">₹{oldPrice.toLocaleString()}</del>
                  </h5>
                  <button
                    className="btn btn-orange w-100 mt-2"
                    onClick={() => addToCart(product)}
                  >
                    <FaShoppingCart className="me-2" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}