# AasaMedChem Sourcing & Inventory Management Portal

A high-precision, serverless B2B pharmaceutical marketplace connecting active pharmaceutical ingredient (API) manufacturers, raw chemical suppliers, and global clinical buyers.

The application is built with **Next.js App Router (v16)**, a **serverless Neon PostgreSQL cloud database**, **Prisma ORM (v7)** using a custom PostgreSQL driver adapter setup, and styled with **Tailwind CSS v4** and **Lucide React** icons.

**Live URL:** https://aasamedchem-gamma.vercel.app

---

# 1. Project Overview & Features

## Core Capabilities

### Role-Based Access Control
Secure separation between Buyers, Sellers, and Admins enforced via a cryptographically signed JWT-cookie middleware layer.

### Dynamic Sourcing Directory
A full-width search console allowing users to query chemical listings instantly by:

- Compound Name
- Purity Threshold
- Category
- CAS Registry Numbers (e.g. `103-90-2`)

### High-Precision Conversion Engine

Instantly translates quantities and prices between commercial listing units:

- kg ↔ g
- L ↔ mL

This protects financial calculations from rounding errors.

### Corporate Dashboard Suites

#### Admin Console
- Monitor active transactions
- Verify organizational accounts
- Remove listings

#### Seller Panel
- Manage catalog listings
- Review business KPIs
- Handle buyer quotations

#### Buyer Panel
- Configure Drug License & GST details
- Browse inventory
- Calculate instant quote values
- Submit procurement requests

---

# 2. Technical Stack & System Architecture

## Architecture Overview

```text
[ Client Browser ]
        │
        ▼
[ Next.js App Router ]
        │
        ▼
[ Route Handlers / APIs ]
        │
        ▼
[ Prisma ORM v7 ]
        │
        ▼
[ Neon PostgreSQL ]
```

## Frontend

- Next.js App Router
- React Server Components (RSC)
- Client Components
- Tailwind CSS v4
- Lucide React Icons

## Backend

- Next.js Route Handlers
- JWT Authentication
- Middleware Authorization

## Database

- Neon Serverless PostgreSQL
- Prisma ORM v7
- PostgreSQL Pool Adapter

---

# 3. Unit Storage & Precision Strategy

## Why Floats Are Not Allowed

Pharmaceutical sourcing often deals with tiny fractional quantities.

Example:

```js
0.1 + 0.2
// 0.30000000000000004
```

Such inaccuracies can create significant financial discrepancies.

---

## Base Unit Storage Strategy

### Quantity Storage

| Dimension | Stored As |
|------------|------------|
| Weight | g |
| Volume | mL |
| Count | items |

### Pricing Storage

Prices are stored per base unit:

- INR per gram
- INR per milliliter
- INR per item

### Database Precision

All quantity and pricing fields use:

```sql
NUMERIC(20,4)
```

---

## Conversion Factors

| Unit | Conversion |
|--------|-----------|
| 1 kg | 1000 g |
| 1 L | 1000 mL |
| 1 item | 1 item |

---

## Conversion Workflow

### Before Saving

Seller enters:

```text
Price = ₹1500/kg
Stock = 100 kg
```

Stored as:

```text
baseAvailableQty = 100000 g
pricePerBaseUnit = ₹1.5/g
```

### Before Display

Database:

```text
100000 g
₹1.5/g
```

Displayed:

```text
100 kg
₹1500/kg
```

### Calculations

- All calculations use raw precision
- Rounded only at final rendering stage
- Prevents compounding rounding errors

---

# 4. Database Schema

## Enums

```prisma
enum Role {
  ADMIN
  SELLER
  BUYER
}

enum OrderStatus {
  PENDING
  APPROVED
  REJECTED
  COMPLETED
}
```

---

## User

```prisma
id            String @id
email         String @unique
passwordHash  String
role          Role
isVerified    Boolean
```

---

## Profile

Business compliance information.

Fields include:

- name
- designation
- contactNumber
- companyName
- gstNumber
- licenseNumber
- pincode
- district
- state
- country
- companyAddress
- companyDescription
- category

---

## Product

Inventory listings.

```prisma
id                String
sellerId          String
name              String
category          String
casNumber         String
purity            Decimal
minOrderQty       Decimal
availableQty      Decimal
baseUnit          String
pricePerBaseUnit  Decimal
description       String?
certifications    String[]
```

---

## Order

Transaction records.

```prisma
id            String
buyerId       String
sellerId      String
productId     String
quantity      Decimal
orderedUnit   String
orderedQty    Decimal
totalPrice    Decimal
status        OrderStatus
```

---

# 5. Local Setup Instructions

## Clone Repository

```bash
git clone https://github.com/vanshtyagi001/aasamedchem.git
cd aasamedchem
npm install
```

---

## Environment Variables

Create `.env`

```env
DATABASE_URL="postgresql://your-neon-db-url"

JWT_SECRET="your-secret-key"
```

---

## Generate Prisma Client

```bash
npx prisma generate
npx prisma db push
```

---

## Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 6. Deploy to Vercel

### Step 1

Push repository to GitHub.

### Step 2

Import project into Vercel.

### Step 3

Framework Preset:

```text
Next.js
```

### Step 4

Add environment variables:

```env
DATABASE_URL
JWT_SECRET
```

### Step 5

Deploy.

Vercel automatically executes:

```bash
prisma generate
next build
```

---

# 7. Login & Test Credentials

## Creating an Admin Account

1. Register normally.
2. Run:

```bash
npx prisma generate
npx prisma studio
```

3. Open:

```text
http://localhost:5555
```

4. Change role:

```text
BUYER → ADMIN
```

5. Save changes and login.

---

# Demo Workflows

## Anonymous Sourcing

- Search by product name
- Search by CAS number
- View estimated pricing
- Request Quote redirects to Login

---

## Buyer Flow

### Register

Create buyer account.

### Complete Profile

Provide:

- GST Number
- License Number
- Company Details

### Verification

Admin verifies buyer account.

### Place Order

1. Search product
2. Select quantity
3. Request Quote

### Track Orders

Monitor status from Buyer Dashboard.

---

## Seller Flow

### Register Seller

Create seller account.

### Complete Company Profile

Specify:

- Manufacturer
- Supplier

### Publish Inventory

Add:

- Chemical Name
- CAS Number
- Purity
- MOQ
- Price
- Stock
- Certifications

### Analytics Dashboard

Monitor:

- Revenue
- Average Order Value (AOV)
- Conversion Funnel

### Manage Orders

- Approve
- Reject
- Complete
- Ship

---

# Key Highlights

✅ Serverless Architecture  
✅ Neon PostgreSQL  
✅ Prisma ORM v7  
✅ JWT Authentication  
✅ Role-Based Access Control  
✅ High-Precision Unit Conversion System  
✅ B2B Pharmaceutical Marketplace  
✅ Admin / Buyer / Seller Dashboards  
✅ Scalable Next.js App Router Architecture