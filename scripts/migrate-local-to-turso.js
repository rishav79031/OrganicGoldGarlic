const { PrismaClient: LocalPrisma } = require("@prisma/client");
const { PrismaLibSQL } = require("@prisma/adapter-libsql");
const { createClient } = require("@libsql/client");

async function main() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  const localPrisma = new LocalPrisma({
    datasources: { db: { url: "file:./prisma/dev.db" } },
  });

  const libsql = createClient({ url: tursoUrl, authToken: tursoAuthToken });
  const adapter = new PrismaLibSQL(libsql);
  const tursoPrisma = new LocalPrisma({ adapter });

  console.log("Checking local data in prisma/dev.db...");

  // 1. Migrate Users
  const localUsers = await localPrisma.user.findMany();
  console.log(`Found ${localUsers.length} local users.`);
  for (const u of localUsers) {
    const existing = await tursoPrisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      await tursoPrisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          password: u.password,
          role: u.role,
          status: u.status,
          createdAt: u.createdAt,
        },
      });
      console.log(`Migrated user: ${u.email}`);
    }
  }

  // 2. Migrate Settings
  const localSettings = await localPrisma.setting.findMany();
  console.log(`Found ${localSettings.length} local settings.`);
  for (const s of localSettings) {
    const existing = await tursoPrisma.setting.findUnique({ where: { key: s.key } });
    if (!existing) {
      await tursoPrisma.setting.create({
        data: { key: s.key, value: s.value },
      });
      console.log(`Migrated setting: ${s.key}`);
    }
  }

  // 3. Migrate Orders
  const localOrders = await localPrisma.order.findMany();
  console.log(`Found ${localOrders.length} local orders.`);
  for (const o of localOrders) {
    const existing = await tursoPrisma.order.findUnique({ where: { orderNumber: o.orderNumber } });
    if (!existing) {
      const { id, ...dataWithoutId } = o;
      await tursoPrisma.order.create({ data: dataWithoutId });
      console.log(`Migrated order: ${o.orderNumber}`);
    }
  }

  // 4. Migrate Enquiries
  const localEnquiries = await localPrisma.enquiry.findMany();
  console.log(`Found ${localEnquiries.length} local enquiries.`);
  for (const e of localEnquiries) {
    const { id, ...dataWithoutId } = e;
    await tursoPrisma.enquiry.create({ data: dataWithoutId });
    console.log(`Migrated enquiry from: ${e.name}`);
  }

  console.log("Migration complete!");
  await localPrisma.$disconnect();
  await tursoPrisma.$disconnect();
}

main().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
