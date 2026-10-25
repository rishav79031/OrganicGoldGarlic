const { PrismaClient } = require("@prisma/client");
const { PrismaLibSQL } = require("@prisma/adapter-libsql");
const { createClient } = require("@libsql/client");

async function main() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  console.log("Turso URL:", tursoUrl);

  const libsql = createClient({
    url: tursoUrl,
    authToken: tursoAuthToken,
  });

  const adapter = new PrismaLibSQL(libsql);
  const prisma = new PrismaClient({ adapter });

  console.log("Querying Turso through Prisma via PrismaLibSQL adapter...");
  const usersCount = await prisma.user.count();
  console.log("Users count in Turso DB:", usersCount);

  const ordersCount = await prisma.order.count();
  console.log("Orders count in Turso DB:", ordersCount);

  const enquiriesCount = await prisma.enquiry.count();
  console.log("Enquiries count in Turso DB:", enquiriesCount);

  console.log("SUCCESS! Prisma successfully connected and queried Turso cloud database!");
  await prisma.$disconnect();
}

main().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
