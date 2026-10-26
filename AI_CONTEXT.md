# Organic Gold Garlic — AI Context & Developer Reference

> **Purpose**: This document provides complete architectural, operational, and historical context for AI assistants and developers continuing work on the **Organic Gold Garlic** platform.

---

## 1. Project Overview & Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | React 18, TypeScript, Server Components & Client Hooks |
| **Styling** | Tailwind CSS 3.4 | Custom CSS themes, Lucide icons, glassmorphism, neomorphism |
| **Database** | Turso (LibSQL / SQLite edge) | Remote URL: `libsql://organic-gold-garlic-rishav79031.aws-ap-south-1.turso.io` |
| **ORM** | Prisma with `@prisma/adapter-libsql` | Schema located at `prisma/schema.prisma` |
| **Authentication** | Custom JWT / Iron-session cookies | `lib/auth.ts`, bcrypt password hashing, OTP verification |
| **Email** | Nodemailer / SMTP | `lib/email.ts` for order confirmations & admin alerts |
| **Deployment** | Vercel | Production domain: `https://organicgoldgarlic.com` |
| **Repository** | GitHub | `rishav79031/OrganicGoldGarlic` |

---

## 2. Directory Structure & Key Files

```
├── app/
│   ├── layout.tsx                # Root layout with SEO metadata & analytics
│   ├── page.tsx                  # Public homepage (Hero, Products, Benefits, FAQ)
│   ├── globals.css               # Global Tailwind directives & custom classes
│   ├── admin/
│   │   ├── layout.tsx            # Admin authentication guard & wrapper
│   │   ├── page.tsx              # Admin dashboard entry point
│   │   ├── login/                # Admin login & OTP password reset
│   │   └── invoice/              # Isolated A4 printable invoice page (/admin/invoice?id=...)
│   └── api/
│       ├── orders/               # Public customer checkout / order creation
│       ├── enquiry/              # Public lead & wholesale enquiry submissions
│       └── admin/
│           ├── orders/           # CRUD for orders, status updates, invoice generation
│           ├── enquiries/        # Enquiry management & soft deletes
│           ├── users/            # Team access & RBAC management
│           ├── settings/         # Store configuration & theme preferences
│           └── otp/              # OTP generation & reset password verification
├── components/
│   ├── Navbar.tsx                # Customer storefront navigation
│   ├── HeroSection.tsx           # Organic Garlic value proposition
│   ├── ProductsSection.tsx       # Product cards with direct Buy/WhatsApp checkout
│   ├── EnquirySection.tsx        # B2B & wholesale enquiry form
│   ├── WhatsAppButton.tsx        # Floating WhatsApp quick chat
│   └── admin/
│       └── AdminDashboard.tsx    # Comprehensive Admin Suite (170KB+ single modular component)
├── lib/
│   ├── prisma.ts                 # Prisma Client configured with Turso LibSQL adapter
│   ├── auth.ts                   # Token signing, cookie inspection & role validation
│   ├── printInvoice.ts           # Dedicated print engine & printable HTML generator
│   └── email.ts                  # Transporter & responsive email templates
└── prisma/
    └── schema.prisma             # Database schema (Order, Enquiry, User, Setting, Otp)
```

---

## 3. Database Schema Models (`prisma/schema.prisma`)

1. **`Order`**:
   - `orderNumber` (`unique`, formatted as `OGG-YYYYMMDD-XXXX`).
   - Customer details: `customerName`, `customerPhone`, `customerEmail`, `deliveryAddress`, `city`, `state`, `pincode`.
   - Product details: `product`, `quantity`, `totalAmount`.
   - Status pipeline: `"Order Received"` → `"Order Accepted"` → `"Invoice Generated"` → `"Payment Received"` → `"Order Processed"` → `"Shipped"` → `"Delivered"` (or `"Cancelled"`).
   - Logistics & Invoicing: `invoiceNumber`, `invoiceAmount`, `invoiceDate`, `courierName`, `trackingNumber`, `shippingDetails`.
   - Soft Delete: `isDeleted` (`Boolean`, default `false`), `deletedAt` (`DateTime?`).

2. **`Enquiry`**:
   - Customer lead details: `name`, `phone`, `email`, `city`, `product`, `quantity`, `message`.
   - Status: `"Pending"`, `"Contacted"`, `"Converted"`, `"Closed"`.
   - Soft Delete: `isDeleted`, `deletedAt`.

3. **`User`**:
   - Admin RBAC accounts: `name`, `email`, `password` (hashed), `role` (`"Superadmin"`, `"Admin"`, `"Staff"`), `status`.

4. **`Setting`**:
   - Key-value config table for active theme, invoice prefix, GSTIN, store address, contact numbers.

5. **`Otp`**:
   - Time-limited verification codes (`email`, `code`, `expiresAt`).

---

## 4. Admin Dashboard Architecture (`AdminDashboard.tsx`)

The Admin dashboard is a full-featured single-page management application containing:

### A. Theme Engine
Supports 5 switchable visual themes:
1. **Classic Light**: Crisp white cards, neutral borders, emerald accents.
2. **Glassmorphism (Apple Frosted Glass)**: Translucent white-greyish frosted glass backdrop (`rgba(255, 255, 255, 0.72)` + `backdrop-blur-xl`), dark high-contrast typography, vivid red Sign Out button, delicate borders.
3. **Midnight Glass**: Dark futuristic translucent glass with emerald/cyan glow.
4. **Neomorphism (Soft Light)**: Extruded dual-shadow surfaces (`#e8ecf2` base with light/dark convex shadows).
5. **Dark Neomorphism**: High-tech extruded dark surfaces (`#1a1f29` base).

### B. Order Row UX & Actions Architecture
- **Direct Outside Icons (High-Frequency Actions)**:
  - `📄` **Print Tax Invoice Button**: Directly accessible on desktop rows and mobile cards. Displays hover tooltip `"Print / View Tax Invoice (A4 PDF)"`. Triggering it opens the preview modal / dedicated print engine.
  - `🚚` **Courier & Tracking Details Button**: Directly accessible outside the menu. Displays dynamic hover tooltip showing courier name & tracking number if present (or `"Add Courier & Tracking Details"`). Opens shipping modal with prefilled carrier quick links (Delhivery, Shiprocket, BlueDart, DTDC, India Post).
- **Three-Dot Action Menu (`⋮`)**:
  - Compact dropdown (`w-48`, height ~115px) positioned via a **Fixed Viewport Portal** (`z-[99999]`) calculated from `getBoundingClientRect()`.
  - **Does NOT** contain repetitive order details or the externalized Print/Tracking buttons.
  - Automatically calculates viewport height (`window.innerHeight`) and flips upward if clicked near the bottom of the screen.
  - Contains only 3 targeted actions:
    1. 📜 **Generate / Edit Invoice Details**
    2. 💬 **WhatsApp Chat**
    3. 🗑️ **Delete Order** (triggers soft-delete confirmation modal)
- **Status Select Styling**:
  - Custom badge-styled select dropdown with custom SVG chevron.
  - Tailored colorways per status (notably `"Shipped"` uses an eye-catching indigo pill: `bg-indigo-50 text-indigo-700 border-indigo-300 ring-1 ring-indigo-200/70`).
  - Below the status select, desktop rows render a compact AWB pill when tracking details exist.

### C. Tax Invoice System (`lib/printInvoice.ts` & `/admin/invoice`)
- Standards-compliant Indian GST Tax Invoice format.
- Includes Seller Info, Buyer Billing/Shipping Address, HSN code, Tax breakup (CGST/SGST or IGST), Amount in words, Bank payment details, and authorized signature stamp.
- Features dual-mode rendering:
  - In-browser iframe/isolated window print preview.
  - Dedicated route `/admin/invoice?id=<orderId>` with standard `@media print` CSS for pixel-perfect A4 printing or saving to PDF.

---

## 5. Environment & CLI Conventions

### Local Git Commands
On the local macOS host, standard `~/.gitconfig` can encounter permission restrictions. Always execute git commands with:
```bash
GIT_CONFIG_GLOBAL=/dev/null git -C /Users/rishavkumar/.gemini/antigravity/scratch/OrganicGoldGarlic <command>
```

### Local Development
```bash
# Start local development server
npm run dev

# Prisma migrations / client regeneration
npx prisma generate
npx prisma db push
```

### Production Build & Deployment
```bash
# 1. Typecheck & production build
npm run build

# 2. Deploy to Vercel production
./node_modules/.bin/vercel deploy --prod --yes --token <VERCEL_TOKEN>
```
*Live Production URL*: `https://organicgoldgarlic.com` (aliased to Vercel production deployment).

---

## 6. Recent Evolution & Decisions Log

1. **Invoice Print Fix**: Replaced inline dynamic window DOM injections with a dedicated server-rendered route `/admin/invoice?id=...` and pure CSS print rules to prevent stylesheet stripping.
2. **Dashboard Performance**: Parallelized `/api/admin/orders`, `/api/admin/enquiries`, and `/api/admin/stats` data fetching using `Promise.all` on dashboard mount to eliminate loading bottlenecks.
3. **Apple Glassmorphism**: Transitioned glassmorphism from low-contrast dark cards to Apple-style frosted light glass with translucent grey-white backgrounds and dark charcoal text for high readability.
4. **Action Menu Portal**: Refactored the table action menu from standard relative dropdowns to a fixed coordinate portal (`position: fixed`, `z-[99999]`) to eliminate table cell clipping caused by `overflow-x: auto`.
5. **Separation of Print & Tracking**: Moved Print (`📄`) and Courier Tracking (`🚚`) out of the three-dot menu onto the table row with hover tooltips for instant 1-click operation, slimming the action menu down to infrequent administrative actions.
