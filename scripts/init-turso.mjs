import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "libsql://organic-gold-garlic-rishav79031.aws-ap-south-1.turso.io",
  authToken: process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTI5NjYxNzMsImlkIjoiMDFhMTc1MWItNTAwMS03ZDBkLTlmMjMtMDY3NmJmOGU2MWI4Iiwia2lkIjoibGRMM0hOVmRWUFVfLW5MblAzbmNYeUNkeXY1bXl2MW9fdVVWUE5ocUdRNCIsInJpZCI6ImVjMDk2NTE2LTFiNGMtNDQxMS04YjEyLTBmMWQ5NDFlMTRhNSJ9.0-EJXrZ2Bv20fnf4p86SdYpPzeXZlA5co0r_2fpfzViJzKcl8yzpcxHK2sfKeZKFGPnr7nS2_8zl_l_yDw9oAw",
});

async function main() {
  console.log("Connecting to Turso...");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Enquiry" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "name" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "email" TEXT,
      "city" TEXT,
      "product" TEXT NOT NULL,
      "quantity" TEXT NOT NULL,
      "message" TEXT,
      "status" TEXT NOT NULL DEFAULT 'Pending',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Order" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "orderNumber" TEXT NOT NULL UNIQUE,
      "customerName" TEXT NOT NULL,
      "customerPhone" TEXT NOT NULL,
      "customerEmail" TEXT,
      "deliveryAddress" TEXT NOT NULL,
      "city" TEXT NOT NULL,
      "state" TEXT,
      "pincode" TEXT,
      "product" TEXT NOT NULL,
      "quantity" INTEGER NOT NULL DEFAULT 1,
      "totalAmount" REAL NOT NULL DEFAULT 0,
      "status" TEXT NOT NULL DEFAULT 'Order Received',
      "paymentStatus" TEXT NOT NULL DEFAULT 'Pending',
      "invoiceNumber" TEXT,
      "invoiceAmount" REAL,
      "invoiceDate" DATETIME,
      "courierName" TEXT,
      "trackingNumber" TEXT,
      "shippingDetails" TEXT,
      "notes" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'Staff',
      "status" TEXT NOT NULL DEFAULT 'Active',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Setting" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "key" TEXT NOT NULL UNIQUE,
      "value" TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Otp" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "email" TEXT NOT NULL,
      "code" TEXT NOT NULL,
      "expiresAt" DATETIME NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table';");
  console.log("Successfully connected! Tables in Turso DB:", res.rows.map(r => r.name));
}

main().catch(err => {
  console.error("Turso init failed:", err);
  process.exit(1);
});
