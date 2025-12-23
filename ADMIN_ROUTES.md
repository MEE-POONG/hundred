# Admin Backend UI - Route Reference

## Complete Admin Section Routes

### 1. Admin Authentication
- **Route**: `/admin/login`
- **File**: `src/app/admin/login/page.tsx`
- **Features**:
  - Login form with email/password
  - Demo credentials: `admin@supplementshop.com` with any password
  - Remember me checkbox
  - Password recovery link
  - Dark theme with gradient design

### 2. Admin Layout
- **File**: `src/app/admin/layout.tsx`
- **Features**:
  - Collapsible sidebar with menu items
  - Sticky topbar with search, notifications, and user chip
  - Navigation to all admin pages
  - Dark mode with pink/purple gradient theme

### 3. Admin Dashboard
- **Route**: `/admin/dashboard`
- **File**: `src/app/admin/dashboard/page.tsx`
- **Features**:
  - 4 KPI cards (Revenue, Orders, Low Stock, Average Order Value)
  - Order status distribution chart (HTML/CSS bars)
  - Top products list
  - Recent orders table
  - Interactive data visualization

### 4. Admin Products
- **Route**: `/admin/products`
- **File**: `src/app/admin/products/page.tsx`
- **Features**:
  - Products table with search and filters
  - Stock level indicators (low stock highlighting)
  - Sale and featured status badges
  - Edit/delete product modals
  - Category filtering

- **Sub-Route**: `/admin/products/new`
- **File**: `src/app/admin/products/new/page.tsx`
- **Features**:
  - New product form
  - Basic info section (name, description)
  - Pricing section (regular & sale price)
  - Inventory section
  - Featured/Sale checkboxes

### 5. Admin Orders
- **Route**: `/admin/orders`
- **File**: `src/app/admin/orders/page.tsx`
- **Features**:
  - Orders table with search
  - Status filters (pending, paid, processing, shipped, delivered, cancelled)
  - Color-coded status badges
  - Link to order details

- **Sub-Route**: `/admin/orders/[id]`
- **File**: `src/app/admin/orders/[id]/page.tsx`
- **Features**:
  - Detailed order information
  - Order items with images and prices
  - Order timeline with status steps
  - Shipping address information
  - Payment and shipping method details
  - Status change dropdown with save button

### 6. Admin Inventory
- **Route**: `/admin/inventory`
- **File**: `src/app/admin/inventory/page.tsx`
- **Features**:
  - Summary cards (Total Products, Low Stock, Out of Stock)
  - Stock level filters
  - Stock list with product images
  - Stock level indicators (color-coded)
  - Stock movement modal (add/remove inventory)
  - Recent movements log
  - Movement reasons dropdown

### 7. Admin Tickets
- **Route**: `/admin/tickets`
- **File**: `src/app/admin/tickets/page.tsx`
- **Features**:
  - Ticket types table with:
    - Rarity levels (Common, Rare, Epic, Legendary)
    - Probability percentages
    - Visual representations
  - Individual ticket detail cards
  - Color indicators and glow effects
  - Probability distribution chart
  - Statistics section

### 8. Admin Redemptions
- **Route**: `/admin/redemptions`
- **File**: `src/app/admin/redemptions/page.tsx`
- **Features**:
  - Redemption statistics (total, pending, completed, shipped)
  - Status filters
  - Redemption list cards with:
    - Product images
    - Tickets used
    - Redemption date
    - Status badges
  - Action buttons (View, Approve, Reject, Mark as Shipped)

### 9. Admin Users
- **Route**: `/admin/users`
- **File**: `src/app/admin/users/page.tsx`
- **Features**:
  - User statistics
  - Role filters (All, Regular Users, Admins)
  - Users table with avatars
  - User detail drawer/sidebar showing:
    - Avatar and name
    - Email and phone
    - Join date
    - Role badge
  - User action buttons (Edit, Reset Password, Change Role, Lock Account)

### 10. Admin Reports
- **Route**: `/admin/reports`
- **File**: `src/app/admin/reports/page.tsx`
- **Features**:
  - Sales report card with:
    - Total revenue
    - Total orders
    - Average order value
    - Completed and cancelled orders
    - CSV export button
  - Inventory report card with:
    - Total products
    - Total stock
    - Average rating
    - Sales and featured count
    - CSV export button
  - Order status distribution chart
  - Product category distribution chart
  - Additional metrics (success rate, avg stock, avg price, discounted items)

### 11. Admin Settings
- **Route**: `/admin/settings`
- **File**: `src/app/admin/settings/page.tsx`
- **Features**:
  - Store profile section:
    - Logo upload
    - Store name
    - Store description
    - Contact info (phone, email)
    - Address
    - Business hours
  - Payment methods list (toggleable)
  - Shipping methods list (toggleable)
  - Theme selector with preview
  - System information
  - Danger zone (clear cache, reset system)

## Design Features

### Colors & Theme
- **Primary Color**: RGB(255, 77, 157) - Hot Pink
- **Secondary Color**: RGB(184, 77, 255) - Purple
- **Accent Color**: RGB(255, 122, 195) - Light Pink
- **Background**: RGB(11, 11, 15) - Dark Navy
- **Surface**: RGB(20, 20, 32) - Dark Gray
- **Text**: RGB(245, 245, 247) - Light White
- **Text Muted**: RGB(167, 167, 179) - Gray

### Components Used
- Tables with hover effects
- Modal dialogs for CRUD operations
- Status badges with color coding
- KPI cards
- Data visualization (HTML/CSS bars)
- Responsive grid layouts
- Drawer/sidebar panels
- Search and filter inputs
- Form controls

### Responsive Design
- Mobile-first approach
- Grid layouts adjust from 1 → 2 → 4 columns
- Collapsible sidebar on mobile
- Responsive tables with horizontal scroll
- Touch-friendly button sizes

## Data Sources
All pages use mock data from:
- `/src/data/products.ts` - Product catalog
- `/src/data/orders.ts` - Order data
- `/src/data/users.ts` - User data & KPIs
- `/src/data/tickets.ts` - Ticket types & redemptions

## Navigation Structure
```
/admin/
├── login/                    (No sidebar)
├── dashboard/               (Main overview)
├── products/                (List & manage)
│   └── new/                (Create new)
├── orders/                 (List & manage)
│   └── [id]/              (Details & status change)
├── inventory/              (Stock management)
├── tickets/               (Ticket types)
├── redemptions/           (Redemption requests)
├── users/                 (User management)
├── reports/               (Analytics & export)
└── settings/              (Configuration)
```

## Key Features Summary
✓ Dark/Black-Pink theme throughout
✓ Responsive table components
✓ Modal dialogs for forms
✓ Real-time search and filtering
✓ Status-based color coding
✓ CSV export functionality
✓ Interactive charts (HTML/CSS only)
✓ User role management
✓ Order timeline visualization
✓ Stock level tracking
✓ Drawer panels for details
✓ Admin authentication page

All components are built with Tailwind CSS and use dark background with accent colors for visual consistency.
