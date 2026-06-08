# MERN Backend

Backend for the multi-vendor e-commerce application using Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and update values:
   ```env
   MONGO_URI=mongodb://localhost:27017/multi_vendor_ecommerce
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## API structure

### Auth
- `POST /api/auth/register` - register user
- `POST /api/auth/login` - login user
- `POST /api/auth/seller/register` - register seller
- `POST /api/auth/seller/login` - login seller
- `GET /api/auth/me` - get current authenticated user or seller

### Products
- `GET /api/products` - list products (supports `keyword`, `category`, `page` query)
- `GET /api/products/:id` - get a single product
- `POST /api/products` - create product (seller only)
- `PUT /api/products/:id` - update product (seller only)
- `DELETE /api/products/:id` - delete product (seller only)

### Orders
- `POST /api/orders` - create order (authenticated user only)
- `GET /api/orders/myorders` - get orders for current user
- `GET /api/orders/:id` - get order by id (authenticated user only)

## Notes
- Seller protected routes use JWT tokens with role `seller`.
- User protected routes use JWT tokens with role `user`.
- The backend now supports role-aware authentication and product owner verification.
