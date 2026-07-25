# 🛒 React eCommerce Frontend

A modern and fully responsive **eCommerce web application** built with **React**, **Vite**, and **Tailwind CSS**. The project recreates a professional online shopping experience with a clean UI, reusable components, product browsing, a fully functional shopping cart with global state management and localStorage persistence, authentication pages with real-time form validation, a checkout flow with protected routes, and responsive layouts optimized for desktop, tablet, and mobile devices.

<p align="center">
  <a href="https://muhammadhuzaifayousaf.github.io/ecommerce-frontend/">
    <img src="https://github.com/user-attachments/assets/b8a8fcb6-17f0-422d-9823-0f0f3a465951" alt="React eCommerce Frontend Preview" width="100%">
  </a>
</p>

## 🚀 Live Demo

🔗 **https://muhammadhuzaifayousaf.github.io/ecommerce-frontend/**

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

## 🛠️ Tech Stack

* **React 18**
* **React Context API** (Cart + Toast)
* **Vite**
* **Tailwind CSS**
* **React Router DOM** (HashRouter)
* **Lucide React**
* **React World Flags**
* **localStorage** (auth + cart persistence)
* **GitHub Pages**

## ⚙️ Installation

```bash
git clone https://github.com/muhammadhuzaifayousaf/ecommerce-frontend.git

cd ecommerce-frontend

npm install

npm run dev
```

## 👨‍💻 Author

**Muhammad Huzaifa Yousaf**

GitHub: https://github.com/muhammadhuzaifayousaf

LinkedIn: https://www.linkedin.com/in/muhammad-huzaifa-yousaf/

## 📄 License

This project was developed for learning and educational purposes.

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
