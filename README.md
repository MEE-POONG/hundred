# NOIR VITA - Premium Health Supplement E-Commerce

A complete **frontend-only** e-commerce website for a premium health supplement brand, built as a UI/UX demonstration prototype.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## 🌟 Overview

**NOIR VITA** is a professional, dark-themed e-commerce storefront showcasing best practices in modern web development. This is a **demonstration project only** - no real transactions or backend processing occur.

### Brand Identity
- **Name:** NOIR VITA
- **Tagline:** Professional Daily Supplement Care
- **Theme:** Dark, premium, trustworthy wellness brand

### Design System
- **Primary Color:** Pink (#FF4DA6)
- **Background:** Black (#0B0B0F)
- **Surface:** Dark (#12121A)
- **Text:** Light (#F5F5F7)
- **Accent:** Muted Purple (#7A5CFF)
- **Premium Touch:** Soft Gold (#C9A24D)

## 📦 Features

### Customer-Facing Pages
✅ **Home Page** - Hero, best sellers, trust badges, categories, testimonials
✅ **Product Listing** - Advanced filters (health goal, dietary, price), search, sorting
✅ **Product Detail** - Image gallery, tabs (benefits, ingredients, usage, warnings)
✅ **Shopping Cart** - Item management, quantity controls, order summary
✅ **Checkout** - Multi-step form, shipping methods, payment UI (demo only)
✅ **Order History** - Order tracking, detailed order views
✅ **Certifications** - GMP, HACCP, FDA (TH) displays
✅ **Blog** - Health articles with professional content
✅ **Policies** - Privacy, shipping, returns, terms & conditions

### Admin Panel
✅ **Dashboard** - Revenue, orders, customers, best-selling products
✅ **Product Management** - CRUD operations, inventory tracking
✅ **Order Management** - Status updates, filtering, customer details
✅ **Customer Management** - User listings, registration tracking
✅ **Payment Records** - Transaction history, payment methods

### Technical Features
- 🎨 **Fully Responsive** - Desktop, tablet, mobile optimized
- 🌙 **Dark Theme Only** - Professional, premium aesthetic
- 🛒 **Local Cart State** - Persistent shopping cart (localStorage)
- 📱 **Mobile Navigation** - Hamburger menu, touch-friendly
- ♿ **Accessible** - High contrast, semantic HTML
- ⚡ **Performance** - Optimized images, code splitting
- 🔍 **SEO Ready** - Meta tags, semantic structure

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Home page
│   ├── products/            # Product listing & detail
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout flow
│   ├── account/orders/      # Order history
│   ├── admin/               # Admin dashboard
│   ├── certifications/      # Quality certifications
│   ├── blog/                # Health articles
│   └── policies/            # Legal policies
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── layout/              # Header, Footer, Admin Nav
│   └── ProductCard.tsx      # Product display component
├── contexts/
│   └── CartContext.tsx      # Global cart state
├── lib/
│   └── mockData.ts          # Mock products, orders, etc.
└── types/
    └── index.ts             # TypeScript interfaces
```

## 🎯 Key Pages

### Public Routes
- `/` - Homepage
- `/products` - Product catalog with filters
- `/products/[slug]` - Individual product details
- `/cart` - Shopping cart
- `/checkout` - Checkout process (UI only)
- `/account/orders` - Order history
- `/certifications` - Quality certifications
- `/blog` - Health articles
- `/blog/[slug]` - Article detail
- `/policies` - Terms, privacy, shipping, returns

### Admin Routes
- `/admin/dashboard` - Overview & statistics
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/customers` - Customer list
- `/admin/payments` - Payment records

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **State Management:** React Context API
- **Data Storage:** localStorage (cart only)
- **Images:** Unsplash (via next/image)
- **Font:** Inter (Google Fonts)

## 📋 Mock Data

The project includes comprehensive mock data:
- **12 Products** - Collagen, Probiotics, Omega-3, Multivitamins, etc.
- **3 Sample Orders** - Various statuses and payment methods
- **3 Users** - Customers and admin
- **4 Blog Articles** - Health and wellness content
- **3 Certificates** - GMP, HACCP, FDA (TH)

## ⚠️ Important Disclaimers

**THIS IS A DEMONSTRATION ONLY**

- ❌ No real payment processing
- ❌ No actual backend or database
- ❌ No user authentication
- ❌ Not a real supplement company
- ❌ Medical/health claims are examples only
- ❌ Certifications are for display purposes

**Real health supplement websites should:**
- Consult legal professionals for compliance
- Obtain proper certifications
- Follow FDA/regulatory guidelines
- Implement secure payment processing
- Provide verified medical disclaimers

## 📝 License

This project is for demonstration purposes only. Feel free to use as reference or learning material.

## 🤝 Credits

- **Images:** [Unsplash](https://unsplash.com)
- **Icons:** Inline SVG
- **Framework:** [Next.js](https://nextjs.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)

---

**Built as a UI/UX demonstration project** | Not affiliated with any real supplement brand
