const { createClient } = require("@libsql/client");

async function main() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  const client = createClient({
    url: tursoUrl,
    authToken: tursoAuthToken,
  });

  console.log("Checking table columns in Turso...");

  // 1. Check Enquiry columns
  const enquiryInfo = await client.execute("PRAGMA table_info('Enquiry');");
  const enquiryCols = enquiryInfo.rows.map(r => r.name);
  console.log("Enquiry columns:", enquiryCols);

  if (!enquiryCols.includes("isDeleted")) {
    console.log("Adding isDeleted to Enquiry...");
    await client.execute("ALTER TABLE 'Enquiry' ADD COLUMN 'isDeleted' BOOLEAN NOT NULL DEFAULT 0;");
  }
  if (!enquiryCols.includes("deletedAt")) {
    console.log("Adding deletedAt to Enquiry...");
    await client.execute("ALTER TABLE 'Enquiry' ADD COLUMN 'deletedAt' DATETIME;");
  }

  // 2. Check Order columns
  const orderInfo = await client.execute("PRAGMA table_info('Order');");
  const orderCols = orderInfo.rows.map(r => r.name);
  console.log("Order columns:", orderCols);

  if (!orderCols.includes("isDeleted")) {
    console.log("Adding isDeleted to Order...");
    await client.execute("ALTER TABLE 'Order' ADD COLUMN 'isDeleted' BOOLEAN NOT NULL DEFAULT 0;");
  }
  if (!orderCols.includes("deletedAt")) {
    console.log("Adding deletedAt to Order...");
    await client.execute("ALTER TABLE 'Order' ADD COLUMN 'deletedAt' DATETIME;");
  }

  console.log("SUCCESS! Soft delete columns verified on Turso.");
}

main().catch(err => {
  console.error("Column update failed:", err);
  process.exit(1);
});
