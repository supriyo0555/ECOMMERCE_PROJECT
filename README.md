# 🛍️ Multi-Vendor E-Commerce Platform

A complete MERN stack application where customers can purchase products from multiple sellers, and sellers can manage their shops and inventory.

## ✨ Features

- 👤 **User Authentication** - Login/Registration with JWT
- 🛒 **Shopping Cart** - Add products and checkout
- 📦 **Order Management** - View order history
- 🏪 **Multi-Vendor Support** - Multiple sellers, one platform
- 🎯 **Product Search & Filter** - Search by category
- 💳 **Checkout System** - Save delivery address

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, MongoDB, JWT
- **Frontend:** React 19, Vite, Context API, CSS3
- **Database:** MongoDB (Atlas or Local)



### 2. Environment Setup

**Create BACKEND/.env file:**
```env
MONGO_URI=mongodb://localhost:27017/multi_vendor_ecommerce
JWT_SECRET=your_secret_key_here
PORT=5000
#### 3...
multi_vendor_e_commerce/
├── BACKEND/              # Express API Server
│   ├── routes/          # API endpoints
│   ├── models/          # MongoDB schemas
│   ├── controllers/      # Business logic
│   └── middleware/       # JWT & Error handling
├── FRONTENED/           # React Frontend
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   └── context/     # Auth & Cart Context
└── README.md


## 🎯 Future Updates

- [ ] Payment Gateway (Stripe/Razorpay)
- [ ] Product Reviews & Ratings
- [ ] Seller Analytics Dashboard
- [ ] Email Notifications
- [ ] Coupon & Discount System

## 👨‍💻 Author

**Supriyo Ghosh ** - Creator of this project

---

**Happy Coding! 🎉**
