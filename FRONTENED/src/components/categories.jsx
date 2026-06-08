import { useState } from "react";
import "./categories.css";


export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const mainCategories = [
    { name: "All", icon: "🏪" },
    { name: "Electronics", icon: "📱" },
    { name: "Fashion", icon: "👕" },
    { name: "Home & Kitchen", icon: "🏠" },
    { name: "Beauty", icon: "💄" },
    { name: "Sports", icon: "⚽" },
    { name: "Books", icon: "📚" },
    { name: "Toys & Games", icon: "🎮" },
    { name: "Automotive", icon: "🚗" },
    { name: "Groceries", icon: "🛒" },
    { name: "Health", icon: "💊" },
    { name: "Pet Supplies", icon: "🐾" },
  ];


  const categoryDetails = {
    "Electronics": [
      "Mobiles", "Laptops", "Tablets", "Cameras", "Headphones", "Speakers", "Smart Home", "Gaming"
    ],
    "Fashion": [
      "Men's Clothing", "Women's Clothing", "Footwear", "Watches", "Jewelry", "Bags", "Accessories", "Ethnic Wear"
    ],
    "Home & Kitchen": [
      "Furniture", "Kitchen Appliances", "Bedding", "Lighting", "Home Decor", "Cookware", "Storage", "Outdoor"
    ],
    "Beauty": [
      "Skincare", "Makeup", "Haircare", "Fragrances", "Bath & Body", "Grooming", "Wellness", "Tools"
    ],
    "Sports": [
      "Fitness Equipment", "Sports Shoes", "Athletic Wear", "Outdoor Gear", "Bikes", "Yoga", "Swimming", "Team Sports"
    ],
    "Books": [
      "Fiction", "Non-Fiction", "Comics", "Academic", "Self-Help", "Biography", "Mystery", "Romance"
    ],
    "Toys & Games": [
      "Action Figures", "Building Blocks", "Puzzles", "Board Games", "Educational", "Outdoor Toys", "Remote Control", "Dolls"
    ],
    "Automotive": [
      "Car Accessories", "Bike Accessories", "Tools", "Maintenance", "Electronics", "Lighting", "Interior", "Exterior"
    ],
    "Groceries": [
      "Fresh Produce", "Dairy", "Bakery", "Beverages", "Snacks", "Spices", "Oils", "Packaged Food"
    ],
    "Health": [
      "Vitamins", "Supplements", "Medical Devices", "First Aid", "Fitness Trackers", "Diagnostic", "Pain Relief", "Wellness"
    ],
    "Pet Supplies": [
      "Pet Food", "Toys", "Grooming", "Beds", "Collars & Leashes", "Cages", "Accessories", "Health Care"
    ],
  };

  return (
    <>
      {/* CATEGORY MENU BAR */}
      <div className="category-menu-bar">
        <div className="category-menu-container">
          {mainCategories.map((cat) => (
            <div
              key={cat.name}
              className={`category-menu-item ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SUBCATEGORIES DROPDOWN */}
      {selectedCategory !== "All" && categoryDetails[selectedCategory] && (
        <div className="subcategory-bar">
          <div className="subcategory-container">
            <span className="subcategory-label">{selectedCategory}:</span>
            {categoryDetails[selectedCategory].map((subcat, index) => (
              <a key={index} href="#" className="subcategory-link">
                {subcat}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* MAIN CATEGORY GRID SECTION */}
      <section className="categories-section py-5">
        <div className="container">
          <h2 className="text-center mb-5" style={{ fontSize: "28px", fontWeight: "700", color: "#212121" }}>
            Shop by Category
          </h2>
          <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-4">
            {mainCategories.filter(cat => cat.name !== "All").map((item, index) => (
              <div key={index} className="col">
                <div
                  className="card category-card text-center p-3 shadow-sm border-0"
                  onClick={() => setSelectedCategory(item.name)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="category-icon-large">{item.icon}</span>
                  <p className="small mb-0 fw-medium" style={{ marginTop: "12px" }}>
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}