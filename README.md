# MediStore - Online Pharmacy Platform

A full-stack e-commerce platform for purchasing authentic medicines and healthcare products online. Built with **Next.js 16**, **Express.js**, **Prisma**, **PostgreSQL**, and **Better Auth**.

![MediStore](https://img.shields.io/badge/MediStore-Online%20Pharmacy-0284c7?style=for-the-badge)

## Live Links

| | URL |
|---|---|
| **Frontend (Vercel)** | [https://frontend-v2-kappa-eight.vercel.app](https://frontend-v2-kappa-eight.vercel.app) |
| **Backend (Render/Railway)** | Deployed separately |
| **Frontend Repo** | [github.com/tasinzuba/frontend--v2](https://github.com/tasinzuba/frontend--v2) |
| **Backend Repo** | [github.com/tasinzuba/backend--v2](https://github.com/tasinzuba/backend--v2) |

---

## Admin / Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@medistore.com` | `admin123` |
| **Seller** | `seller@medistore.com` | `password123` |
| **Customer** | `customer@medistore.com` | `password123` |

---

## Key Features

### Public Pages
- **Home Page** - Hero carousel, bento trust badges, categories, featured products, statistics counter, testimonials, FAQ, newsletter, CTA (11 sections total)
- **Medicines Listing** - Search, category/price filters, sorting (price/name), pagination, grid/list view, skeleton loaders
- **Medicine Details** - Product images, description, specs, reviews with ratings, related products, add to cart
- **Categories** - Browse all categories with product counts
- **About** - Mission, vision, bento feature grid, team section
- **Contact** - Contact form, Google Maps embed, bento contact info cards
- **FAQ** - Searchable, categorized accordion (Ordering, Delivery, Payment, Returns)

### Authentication
- Email/Password login & registration
- Google & Facebook social login buttons
- Role selection on register (Customer / Seller)
- Email verification via Nodemailer
- Session-based auth with Better Auth

### Dashboard System (Role-Based)

#### Customer Dashboard (3 sidebar items)
- **Overview** - Stats cards (bento), bar chart (order trends), pie chart (order status), recent orders table
- **My Orders** - Full order history with status tracking, order details
- **Account Settings** - Editable profile, security, addresses, notifications

#### Seller Dashboard (5 sidebar items)
- **Dashboard** - Revenue stats, order overview
- **Inventory** - Full CRUD for medicines (add/edit/delete products with image upload)
- **Orders** - Customer order management, status updates (Pending > Processing > Shipped > Delivered)
- **Analytics** - Revenue chart, product performance ranking, inventory summary
- **Settings** - Store profile management

#### Admin Dashboard (5 sidebar items)
- **Dashboard** - System-wide statistics, charts
- **User Registry** - View all users, activate/suspend/ban accounts
- **Categories** - Category CRUD (create/edit/delete with images)
- **Order Logs** - Monitor all orders across the platform
- **Inventory** - View all medicines from all sellers

### UI/UX
- Fully responsive (Mobile, Tablet, Desktop)
- Bento grid layouts throughout
- Stagger animations on grids
- Shimmer skeleton loaders
- Smooth hover effects with image zoom
- Press feedback on buttons (`active:scale`)
- Sticky navbar with mega menu dropdown
- Dark premium footer
- Consistent color system (Sky primary, Emerald secondary)
- Custom scrollbar, smooth scroll
- No lorem ipsum - all real content

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 | React framework (App Router) |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| Recharts | Dashboard charts (Bar, Pie) |
| Lucide React | Icon library |
| Better Auth (Client) | Authentication |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | API framework |
| TypeScript | Type safety |
| Prisma | ORM |
| PostgreSQL (NeonDB) | Database |
| Better Auth | Authentication & sessions |
| Nodemailer | Email verification |
| Cloudinary | Image uploads |
| Zod | Request validation |
| Helmet | Security headers |

---

## Project Structure

```
frontend--v2/
  frontend/
    app/
      (auth)/
        login/page.tsx          # Login page (split layout + social login)
        register/page.tsx       # Registration with role selection
      about/page.tsx            # About page (bento layout)
      cart/page.tsx              # Shopping cart + checkout
      categories/page.tsx       # Category listing
      contact/page.tsx          # Contact form + map
      faq/page.tsx              # FAQ with search
      medicines/
        page.tsx                # Medicine listing (search, filter, sort, paginate)
        [id]/page.tsx           # Medicine details + reviews
      dashboard/
        page.tsx                # Customer dashboard (overview, orders, settings)
        seller/page.tsx         # Seller dashboard (5 tabs)
        admin/page.tsx          # Admin dashboard (5 tabs)
        orders/[id]/page.tsx    # Order details
      components/
        Navbar.tsx              # Sticky navbar + mega menu
        Footer.tsx              # Dark premium footer
        Logo.tsx                # Logo component
        ImageUpload.tsx         # Cloudinary upload
      context/
        CartContext.tsx          # Cart state management
      lib/
        auth-client.ts          # Better Auth client config
      globals.css               # Animations, utilities, design tokens
      layout.tsx                # Root layout
      page.tsx                  # Home page (11 sections)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or NeonDB)
- Cloudinary account (for image uploads)
- Gmail account (for email verification)

### 1. Clone Repositories
```bash
# Frontend
git clone https://github.com/tasinzuba/frontend--v2.git
cd frontend--v2/frontend
npm install

# Backend (separate repo)
git clone https://github.com/tasinzuba/backend--v2.git
cd backend--v2
npm install
```

### 2. Backend Setup
Create `.env` in `backend--v2/`:
```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"
PORT=3001
```

```bash
npm run prisma:generate
npm run prisma:push
npm run seed          # Seeds demo data (users, categories, medicines, orders, reviews)
npm run dev           # Starts on http://localhost:3001
```

### 3. Frontend Setup
Create `.env.local` in `frontend--v2/frontend/`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

```bash
npm run dev           # Starts on http://localhost:3000
```

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicines` | Browse medicines (search, filter, sort) |
| GET | `/api/medicines/:id` | Medicine details with reviews |
| GET | `/api/medicines/categories` | All categories |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-up/email` | Register new user |
| POST | `/api/auth/sign-in/email` | Login |
| POST | `/api/auth/sign-out` | Logout |

### Customer (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | My orders |
| POST | `/api/orders` | Create order |
| PATCH | `/api/orders/:id/cancel` | Cancel pending order |
| POST | `/api/reviews` | Submit review |

### Seller (Seller Role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/seller/medicines` | My medicines |
| POST | `/api/seller/medicines` | Add medicine |
| PUT | `/api/seller/medicines/:id` | Update medicine |
| DELETE | `/api/seller/medicines/:id` | Delete medicine |
| GET | `/api/seller/orders` | Orders for my products |
| PATCH | `/api/seller/orders/:id` | Update order status |

### Admin (Admin Role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | System statistics |
| GET | `/api/admin/users` | All users |
| PATCH | `/api/admin/users/:id` | Update user status |
| POST | `/api/admin/categories` | Create category |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category |
| GET | `/api/admin/orders` | All orders |
| GET | `/api/admin/medicines` | All medicines |

---

## Seeded Demo Data

| Data | Count | Details |
|------|-------|---------|
| Users | 5 | 1 Admin, 2 Sellers, 2 Customers |
| Categories | 6 | Pain Relief, Cold & Flu, Vitamins, First Aid, Skin Care, Digestive |
| Medicines | 17 | Across all categories with images, prices, stock |
| Orders | 5 | DELIVERED, SHIPPED, PROCESSING, PENDING statuses |
| Reviews | 8 | Ratings 4-5 with realistic comments |

---

## Author

**Tasin Ahmed**
- GitHub: [@tasinzuba](https://github.com/tasinzuba)
- Email: tasinahmed423@gmail.com
