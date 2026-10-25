import { prisma } from "../lib/prisma.ts";

async function main() {
  console.log("Testing Prisma via LibSQL adapter to Turso...");
  const usersCount = await prisma.user.count();
  console.log("Current user count in Turso DB:", usersCount);

  const ordersCount = await prisma.order.count();
  console.log("Current orders count in Turso DB:", ordersCount);

  const enquiriesCount = await prisma.enquiry.count();
  console.log("Current enquiries count in Turso DB:", enquiriesCount);

  console.log("SUCCESS! Prisma successfully queried Turso cloud database.");
}

main().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
