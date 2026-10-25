# 🧄 Organic Fresh Gold Garlic – Website

Premium peeled garlic brand website built with Next.js 14 App Router.

**Brand**: Organic Fresh Gold Garlic  
**Location**: Araria, Bihar, India  
**WhatsApp**: +91 7488503664

---

## 🚀 Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** – Styling
- **Framer Motion** – Animations
- **Prisma + SQLite** – Enquiry database
- **jose** – JWT-based admin authentication
- **react-hot-toast** – Form notifications
- **react-hook-form + Zod** – Form validation

---

## 📋 Features

### Public Site
- Beautiful animated hero section with floating garlic cloves
- About / Products / Why Choose Us / Contact sections
- Enquiry form (saves to SQLite)
- WhatsApp floating button
- SEO metadata, sitemap, robots.txt

### Admin Panel (`/admin`)
- Password-protected dashboard (JWT cookie)
- View all enquiries in a table
- Update enquiry status: Pending → Contacted → Confirmed → Completed
- Search and filter enquiries

---

## ⚙️ Setup

### 1. Clone and install
```bash
git clone <repo-url>
cd OrganicGoldGarlic
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your values
```

`.env` values:
```
DATABASE_URL="file:./prisma/dev.db"
ADMIN_PASSWORD="GoldGarlic@2024"
ADMIN_SECRET="goldgarlic-jwt-secret-2024"
NEXT_PUBLIC_WHATSAPP="917488503664"
```

### 3. Set up database
```bash
npx prisma generate
npx prisma db push
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Admin panel
Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)  
Password: `GoldGarlic@2024`

---

## 🏗️ Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles + animations
│   ├── api/
│   │   ├── enquiry/        # POST – submit enquiry
│   │   └── admin/
│   │       ├── login/      # POST – admin login
│   │       ├── logout/     # POST – admin logout
│   │       ├── enquiries/  # GET – list enquiries
│   │       └── enquiry/[id]/ # PATCH – update status
│   └── admin/
│       ├── login/page.tsx  # Login page
│       └── page.tsx        # Dashboard (protected)
├── components/
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── AboutSection.tsx
│   ├── ProductsSection.tsx
│   ├── WhyChooseUs.tsx
│   ├── EnquirySection.tsx
│   ├── ContactSection.tsx
│   ├── Footer.tsx
│   ├── WhatsAppButton.tsx
│   └── admin/
│       └── AdminDashboard.tsx
├── lib/
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
└── public/
    ├── logo.jpg
    └── product.jpg
```

---

## 💰 Pricing

| Pack | Price |
|------|-------|
| 250g | ₹100  |
| 1 kg | ₹200  |

Custom bulk orders available – use the enquiry form or WhatsApp.

---

## 🎨 Color Palette

| Color | Hex |
|-------|-----|
| Primary Green | `#1a5c2a` |
| Gold / Accent | `#c9a227` |
| Light Gold | `#f5e6b2` |
| Cream Background | `#fffdf5` |
| Dark Text | `#1a1a1a` |

---

&copy; 2024 Organic Fresh Gold Garlic. All rights reserved.
