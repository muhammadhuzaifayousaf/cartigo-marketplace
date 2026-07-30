# 🛒 Cartiqo React eCommerce

A modern and fully responsive **eCommerce web application** built with **React**, **Vite**, **Tailwind CSS**, and a **Node.js + Express + MongoDB Atlas** backend. The project recreates a professional online shopping experience with a clean UI, reusable components, product browsing, a fully functional shopping cart with global state management and localStorage persistence, authentication pages with real-time form validation, a checkout flow with protected routes, live REST API endpoints, and responsive layouts optimized for desktop, tablet, and mobile devices.

<p align="center">
  <a href="https://muhammadhuzaifayousaf.github.io/ecommerce-frontend/">
    <img src="https://github.com/user-attachments/assets/746f9170-e5c1-4448-b183-9682cf0dc36c" alt="React eCommerce Preview" width="100%">
  </a>
</p>

## 🚀 Live Demo

🔗 **https://muhammadhuzaifayousaf.github.io/ecommerce-frontend/**

> **Note:** The live demo reflects the frontend-only build (Weeks 1–4). Week 5 backend integration (API + MongoDB) requires a running Node.js server and is not deployed to GitHub Pages.

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
- Verified-only product filtering
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
- MongoDB Atlas connection via Mongoose 9.x with auto-seed of 14 products across 5 categories
- `GET /api/health` — health-check endpoint
- `GET /api/products` — fetch all products with try/catch error handling
- `GET /api/products/:id` — single product lookup with 400 (invalid ID) and 404 (not found) responses
- Axios service layer (`src/services/api.js`) with `fetchProducts()` and `fetchProductById()`
- Dynamic hostname resolution (`window.location.hostname`) for mobile devices on the same network
- Loading spinner (Loader2) and error-retry UI on Home, Product Listing, and Product Detail pages
- About page — hero, mission/vision, company story, journey timeline, feature cards, offices, founder card, CTA
- All existing Week 1–4 functionality continues to work without regressions

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero banner, featured products, deals, categories, promo |
| Product Listing | `/products` | Search, filters, grid/list view, pagination |
| Product Details | `/products/:id` | Image gallery, specs, quantity selector, add to cart |
| Shopping Cart | `/cart` | Quantity controls, order summary, saved for later |
| Login | `/login` | Email/password auth with validation and show/hide toggle |
| Signup | `/signup` | Registration form with confirm password and validation |
| Checkout | `/checkout` | Shipping form + order summary (protected — requires login) |
| About | `/about` | Company info, mission/vision, timeline, features, offices, founder |

## 🛠️ Tech Stack

* **React 18**
* **React Context API** (Cart + Toast)
* **Vite**
* **Tailwind CSS**
* **React Router DOM** (HashRouter)
* **Lucide React**
* **React World Flags**
* **axios** (API requests)
* **localStorage** (auth + cart persistence)
* **Node.js / Express 5.x** (backend server)
* **Mongoose 9.x** (MongoDB ODM)
* **MongoDB Atlas** (cloud database)
* **GitHub Pages** (Week 1–4 frontend only)

## ⚙️ Installation

### Frontend

```bash
git clone https://github.com/muhammadhuzaifayousaf/ecommerce-frontend.git

cd ecommerce-frontend

npm install

npm run dev
```

### Backend

```bash
cd backend

npm install

# Create .env file with your MongoDB Atlas URI:
# MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority

node server.js
```

The backend runs on **http://localhost:5000**. Make sure MongoDB Atlas is whitelisted to accept connections from your IP address.

## 👨‍💻 Author

**Muhammad Huzaifa Yousaf**

GitHub: https://github.com/muhammadhuzaifayousaf

LinkedIn: https://www.linkedin.com/in/muhammad-huzaifa-yousaf/

## 📄 License

This project was developed for learning and educational purposes.

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
