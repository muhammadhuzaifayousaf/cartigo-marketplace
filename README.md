# 🛒 Cartiqo - Full Stack eCommerce Marketplace

A modern and fully responsive **full-stack eCommerce marketplace** built with **React**, **Vite**, **Tailwind CSS**, and a **Node.js + Express + MongoDB Atlas** backend. The project recreates a professional online shopping experience with a clean UI, reusable components, product browsing and filtering, a fully functional shopping cart with global state management and localStorage persistence, real JWT-based user accounts with customer/seller/admin roles, order management with tracking, product reviews, Cloudinary image uploads, protected routes, live REST API endpoints, and responsive layouts optimized for desktop, tablet, and mobile devices.

<p align="center">
  <a href="https://cartiqo-shop.vercel.app/">
    <img src="https://github.com/user-attachments/assets/a972fa3e-43e7-4698-b347-eed10a7bde9f" alt="Cartiqo eCommerce Preview" width="100%">
  </a>
</p>

## 🚀 Live Demo

🔗 **https://cartiqo-shop.vercel.app/**
▶️ **Demo Video:** https://youtu.be/3Ru8KJNPLmU

> **Note:** Cartiqo is deployed as a full-stack application — the React + Vite frontend runs on **Vercel**, the Node.js + Express backend runs on **Render** (https://cartigo-backend.onrender.com/), data is stored in **MongoDB Atlas**, and images are served from **Cloudinary**.

## 📖 Project Documentation

### Week 1 Documentation
- 📄 **Week 1 Report / Assignment:** https://drive.google.com/file/d/1g6lAi9o9RGVqysEF54cbjk7uEjh9v9Pd/
- Includes the initial UI structure, layout planning, and first phase of the eCommerce frontend implementation.

### Week 2 Documentation
- 📄 **Week 2 Report / Assignment:** https://drive.google.com/file/d/1zqtx4suPVpXScFWPUOUaI1xB3uRvlZ8L/
- Covers dynamic product data integration, featured products, product listing filters, product detail routing, and responsive UI improvements.

### Week 3 Documentation
- 📄 **Week 3 Report / Assignment:** https://drive.google.com/file/d/1O547JKEvQBWn6v3IIdzf4HEgi68ZFF-I/
- Covers cart functionality, React Context API state management, localStorage persistence, interactive cart page with quantity controls, and dynamic totals.

### Week 4 Documentation
- 📄 **Week 4 Report / Assignment:** https://drive.google.com/file/d/1MDBP3lRaihF9iZ7qHJVLaUu3GQW1EwBm/
- Covers UI forms, frontend validation, authentication pages (Login/Signup), checkout flow, protected routes, toast notifications, and success feedback.

### Week 5 Documentation
- 📄 **Week 5 Report / Assignment:** https://drive.google.com/file/d/16UFGLUIaHY3NQKRYEZGl_MjAulVNoxPy/
- Covers backend setup (Node.js + Express + MongoDB Atlas), REST API endpoints (GET /api/products, GET /api/products/:id), axios frontend integration, loading/error states, dynamic hostname for mobile access, and the About page.

### Week 6 Documentation
- 📄 **Week 6 Report / Assignment:** https://drive.google.com/file/d/1z0TTvPVRnP8aX1YbCQDgN9LcCOBxYe9m/
- Covers full backend integration and deployment — JWT authentication, role-based access (customer/seller/admin), order and review systems, Cloudinary uploads, and deployment to Vercel and Render.

### Week 7 Documentation
- 📄 **Week 7 Report / Assignment:** https://drive.google.com/file/d/1pHTy-esiBpU-possOzb2EXHyQgqBJorw/
- Covers advanced React features, custom hooks, wishlist functionality, performance optimization, error boundaries, product comparison, and feature-based code architecture.

## ✨ Features

### Core App Experience
- Modern and responsive eCommerce user interface
- Responsive navigation bar with category dropdowns and auth-aware buttons
- Hero banner with promotional sections and dynamic user greeting
- Product listing page with multiple products and real-time toast notifications
- Product details page with image gallery and quantity-based add to cart
- Shopping cart with quantity management
- Save for later (wishlist) functionality
- Login and Signup pages with glassmorphism card design
- Checkout page with shipping form and order summary
- Protected routes with authentication state management

### Week 2 Enhancements
- Product search and category filtering
- Featured products section on the Home page
- Dynamic product cards driven from local JSON data
- Responsive mobile menu improvements
- Improved routing and navigation behavior
- Deals and offers section with live countdown timer
- Home & Outdoor and Consumer Electronics sections
- Supplier inquiry banner with contact form
- Regional suppliers section with country flags
- Mobile friendly design using Tailwind CSS
- Client side routing with React Router
- Reusable React components for better maintainability

### Week 3 Enhancements
- Global cart state management using React Context API
- Functional Add to Cart buttons on Product Listing and Product Detail pages
- Duplicate prevention — same product increases quantity instead of adding duplicates
- Cart Page with quantity increment (+) and decrement (-) controls
- Remove button to delete items from cart
- Remove All button to clear the entire cart
- Running total price that updates dynamically (subtotal, discount, tax, total)
- Empty cart state with friendly message and "Continue Shopping" link
- Navbar cart badge showing real item count across all pages
- localStorage persistence — cart data survives page refreshes
- Fully responsive cart UI on mobile and desktop

### Week 4 Enhancements
- Login page with email/password fields, validation, show/hide toggle, and Remember Me
- Signup page with four-field form, confirm password validation, and duplicate email detection
- Checkout page with two-column layout: 6-field shipping form + sticky order summary
- Real-time form validation — red borders, error messages, clear-on-typing across all forms
- Success modal with animated checkmark after placing an order
- Protected route — Checkout redirects to Login with toast when unauthenticated
- Auth-aware navbar — shows Login/Join Now when logged out, Avatar/Logout when logged in
- Dynamic greeting on Home page hero based on logged-in user name
- Global toast notifications — "Successfully added to cart!" on all Add to Cart buttons
- Reusable FormInput component with label, error, password toggle, red border
- Reusable AuthLayout component with glassmorphism card design
- ToastContext for system-wide toast state management
- CSS keyframe animations — fadeIn, scaleIn, bounceIn, toastIn
- Page reload on login/signup for clean state hydration
- Mobile search bar fix — category dropdown hidden on small screens, icon never clips

### Week 5 Enhancements
- Node.js + Express 5.x backend server on port 5000 with CORS and dotenv
- MongoDB Atlas connection via Mongoose 9.x with auto-seed of 20 products across 8 categories
- `GET /api/health` — health-check endpoint
- `GET /api/products` — fetch all products with try/catch error handling
- `GET /api/products/:id` — single product lookup with 400 (invalid ID) and 404 (not found) responses
- Axios service layer (`src/services/api.js`) with `fetchProducts()` and `fetchProductById()`
- Dynamic hostname resolution (`window.location.hostname`) for mobile devices on the same network
- Loading spinner (Loader2) and error-retry UI on Home, Product Listing, and Product Detail pages
- About page — hero, mission/vision, company story, journey timeline, feature cards, offices, founder card, CTA
- All existing Week 1–4 functionality continues to work without regressions

### Week 6 Enhancements

**Backend & Integration**
- Node.js + Express 5.x REST API with CORS, dotenv, and a global error handler
- MongoDB Atlas integration via Mongoose 9.x with four models (users, products, orders, reviews)
- JWT authentication (register, login, change-password) with bcryptjs password hashing
- Role-based access control via `protect` (JWT verification) and `authorize` (role guard) middleware
- Full REST API for products, orders, reviews, users, seller, and admin functionality
- Axios interceptor automatically attaches the JWT from localStorage to every request
- Cloudinary image uploads through Multer — product images and profile avatars

**Customer**
- Real user registration and login with JWT-based protected routes
- Checkout, order history, order details, and cancellation (full order and individual items)
- Per-item order tracking lifecycle (Pending → Confirmed → In Transit → Arrived → Delivered / Cancelled)
- Product reviews — only customers with a delivered purchase can review, one review per product (edit/delete)
- Customer profile with avatar upload and a public profile page
- Password change

**Seller**
- Seller dashboard, product management (add/edit/delete) with multi-image Cloudinary uploads
- Seller order management with per-item status and tracking updates
- Seller profile with business category, store description, and avatar
- Seller registration with location and business category

**Admin**
- Product approval workflow (approve/reject pending storefront listings)
- Admin-only protected routes

**Deployment**
- Frontend deployed on Vercel and backend on Render, using MongoDB Atlas and Cloudinary

### Week 7 Enhancements

**Custom React Hooks**
- `useLocalStorage(key, initialValue, transform)` — reusable hook with lazy initialization and automatic write-back, powering cart and wishlist persistence
- `useDebounce(value, delay)` — debounced search input for the product listing page
- `useFetch(requestFn, deps)` — reusable data-fetching hook returning `{ data, loading, error, refetch }` with unmount-safe cleanup

**Wishlist**
- Dedicated Wishlist feature with global state via React Context and localStorage persistence
- Wishlist heart button on product cards with instant add/remove toggle
- Navbar wishlist badge showing the current item count
- Wishlist page (`/wishlist`) with remove and "Add to Cart" actions
- Save for later from the cart (SavedProducts)

**Performance Optimization**
- `React.memo` on ProductCard to prevent unnecessary re-renders
- `useMemo` / `useCallback` in contexts and listing pages to memoize values and handlers
- Native lazy image loading (`loading="lazy"`) on product, cart, and wishlist thumbnails
- Debounced search to avoid filtering on every keystroke

**Error Handling**
- Reusable class-based `ErrorBoundary` component with `resetKey` that reloads on route change
- ErrorBoundary wraps the whole app in `main.jsx` and again around routes in `App.jsx`
- Fallback UI with a friendly message and "Try Again" button instead of a blank screen

**Code Architecture**
- Refactored into a feature-based structure with focused directories: `features/products`, `features/cart`, `features/wishlist`, `features/compare`
- Shared building blocks extracted into `shared/components` and `shared/hooks`
- Existing routes and imports updated after the refactor with no broken links

**Product Comparison**
- Compare checkbox on product cards to select products for side-by-side comparison
- Comparison limit of up to 3 products with toast feedback when the limit is reached
- Floating Compare Bar with thumbnails, remove, and "Compare" actions
- Dedicated compare page (`/compare`) rendering a side-by-side spec comparison
- Compare list auto-clears when leaving the compare page

## 📄 Application Pages

### Customer Pages

| File | Route |
|------|-------|
| `src/pages/HomePage.jsx` | `/` |
| `src/features/products/ProductListingPage.jsx` | `/products` |
| `src/features/products/ProductDetailPage.jsx` | `/products/:id` |
| `src/features/cart/CartPage.jsx` | `/cart` |
| `src/features/wishlist/WishlistPage.jsx` | `/wishlist` |
| `src/features/compare/ComparePage.jsx` | `/compare` |
| `src/pages/LoginPage.jsx` | `/login` |
| `src/pages/SignupPage.jsx` | `/signup` |
| `src/pages/CheckoutPage.jsx` | `/checkout` |
| `src/pages/OrderSuccessPage.jsx` | `/order-success` |
| `src/pages/MyOrders.jsx` | `/orders` |
| `src/pages/OrderTracking.jsx` | `/orders/:id` |
| `src/pages/CustomerProfile.jsx` | `/profile` |
| `src/pages/PublicProfile.jsx` | `/profile/:id` |
| `src/pages/AboutPage.jsx` | `/about` |

### Seller & Admin Pages

| File | Route |
|------|-------|
| `src/pages/seller/SellerDashboard.jsx` | `/seller` |
| `src/pages/seller/SellerProducts.jsx` | `/seller/products` |
| `src/pages/seller/AddProduct.jsx` | `/seller/products/add` |
| `src/pages/seller/EditProduct.jsx` | `/seller/products/:id/edit` |
| `src/pages/seller/SellerOrders.jsx` | `/seller/orders` |
| `src/pages/seller/AdminApprovals.jsx` | `/seller/approvals` |
| `src/pages/seller/SellerProfile.jsx` | `/seller/profile` |

> Routes in the seller area are protected with `RoleProtectedRoute` (seller/admin), while Checkout, Orders, and Customer Profile require an authenticated customer role.

## 🛠️ Tech Stack

**Frontend**
* React 18
* Vite
* JavaScript
* Tailwind CSS
* React Router DOM (HashRouter)
* React Context API (Auth, Cart, Wishlist, Compare, Toast)
* Custom React hooks (useFetch, useDebounce, useLocalStorage)
* Axios (API requests)
* Lucide React
* React World Flags
* localStorage (auth, cart + wishlist persistence)

**Backend**
* Node.js
* Express 5.x
* REST API
* JWT (jsonwebtoken)
* bcryptjs (password hashing)
* Mongoose 9.x (MongoDB ODM)
* CORS
* Multer (image uploads)
* Cloudinary
* dotenv (environment variables)

**Database**
* MongoDB Atlas (cloud database)

**Deployment**
* Vercel (frontend)
* Render (backend)
* Git & GitHub (version control)

## 🔌 REST API Endpoints

The frontend communicates with the Express backend through REST APIs using Axios. The Axios instance automatically attaches the JWT stored in `localStorage` to every request through a request interceptor.

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/health` | Server health check | Public |
| POST | `/api/auth/register` | Register a customer or seller account | Public |
| POST | `/api/auth/login` | Log in and receive a JWT | Public |
| PUT | `/api/auth/change-password` | Change the logged-in user's password | Private |
| GET | `/api/products` | Get approved products (`?seller=` optional) | Public |
| GET | `/api/products/:id` | Get a single approved product | Public |
| GET | `/api/categories` | Get the canonical product categories | Public |
| POST | `/api/orders` | Place an order | Private |
| GET | `/api/orders/my` | Customer order history | Private |
| GET | `/api/orders/:id` | Single order (owner or admin) | Private |
| PUT | `/api/orders/:id/items/:itemId/status` | Update an item's tracking status | Seller/Admin |
| PATCH | `/api/orders/:id/items/:itemId/cancel` | Cancel a single pending item | Private |
| PUT | `/api/orders/:id/cancel` | Cancel a pending order | Private |
| DELETE | `/api/orders/:id` | Delete an order | Admin |
| GET | `/api/seller/products` | Seller's own products | Seller/Admin |
| POST | `/api/seller/products` | Create a product (Cloudinary image upload) | Seller/Admin |
| PUT | `/api/seller/products/:id` | Update a product | Seller/Admin |
| DELETE | `/api/seller/products/:id` | Delete a product | Seller/Admin |
| GET | `/api/seller/orders` | Orders containing the seller's items | Seller/Admin |
| GET | `/api/admin/products` | Product approval queue | Admin |
| PUT | `/api/admin/products/:id/verify` | Approve or reject a product | Admin |
| GET | `/api/reviews/product/:productId` | Reviews for a product | Public |
| GET | `/api/reviews/seller/:sellerId/stats` | Seller rating summary | Public |
| GET | `/api/reviews/my/:productId` | User's review and eligibility | Private |
| GET | `/api/reviews/seller` | Reviews across the seller's products | Seller/Admin |
| POST | `/api/reviews` | Create a review (delivered purchase required) | Private |
| PUT | `/api/reviews/:id` | Edit own review | Private |
| DELETE | `/api/reviews/:id` | Delete own review | Private |
| GET | `/api/users/:id/public` | Public profile card | Public |
| GET | `/api/users/me` | Own profile | Private |
| PUT | `/api/users/me` | Update own profile | Private |
| PUT | `/api/users/me/avatar` | Upload/replace profile avatar | Private |

## 🗄️ Database

Cartiqo uses **MongoDB Atlas** as its cloud database, connected through **Mongoose**. The database contains four main collections/models:

* **users** — registered accounts (customer, seller, admin) with bcrypt-hashed passwords, avatars, and role-based fields
* **products** — the product catalog with categories, pricing, stock, images, seller references, and an approval status
* **orders** — customer orders with per-item snapshots, a per-item status lifecycle, tracking numbers, and shipping details
* **reviews** — customer ratings and reviews tied to a delivered order

A helper auto-seeds **20 products across 8 categories** (Electronics, Computers & Accessories, Home Appliances, Clothing & Fashion, Shoes & Footwear, Sports & Outdoors, Home & Furniture, Bags & Luggage) whenever the products collection is empty.

## ☁️ Cloudinary

Cloudinary is used for media storage:

* **Product images** — sellers upload up to 5 images per product (jpg/jpeg/png/webp)
* **User avatars** — customer and seller profile/avatar images

Credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) are stored in environment variables and never committed to the repository.

## 🚀 Deployment

Cartiqo is deployed as a full-stack application:

* **Frontend** — React + Vite hosted on **Vercel**
* **Backend** — Node.js + Express hosted on **Render**
* **Database** — MongoDB Atlas
* **Media** — Cloudinary

The frontend connects to the deployed backend through the `VITE_API_URL` environment variable — the deployed API base URL is `https://cartigo-backend.onrender.com/api`.

* **Live Website:** https://cartiqo-shop.vercel.app/
* **Backend:** https://cartigo-backend.onrender.com/

## ⚙️ Installation

### Frontend

```bash
git clone https://github.com/muhammadhuzaifayousaf/cartigo-marketplace.git

cd cartigo-marketplace

npm install

npm run dev
```

### Backend

```bash
cd backend

npm install

# Create a .env file with your credentials:
# MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/cartiqo?retryWrites=true&w=majority
# JWT_SECRET=<your-secret>
# JWT_EXPIRE=7d
# CLOUDINARY_CLOUD_NAME=<your-cloud-name>
# CLOUDINARY_API_KEY=<your-api-key>
# CLOUDINARY_API_SECRET=<your-api-secret>

npm run dev
```

The backend runs on **http://localhost:5000**. Make sure MongoDB Atlas is whitelisted to accept connections from your IP address. The frontend can point at a deployed backend by setting `VITE_API_URL` (e.g. `https://cartigo-backend.onrender.com/api`).

## 🔗 Project Links

* **Live Website:** https://cartiqo-shop.vercel.app/
* **Demo Video:** https://youtu.be/3Ru8KJNPLmU

## 👨‍💻 Author

**Muhammad Huzaifa Yousaf**

GitHub: https://github.com/muhammadhuzaifayousaf

LinkedIn: https://www.linkedin.com/in/muhammad-huzaifa-yousaf/

## 📄 License

This project was developed for learning and educational purposes.

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
