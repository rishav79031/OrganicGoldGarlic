import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  let dbUrl = process.env.DATABASE_URL || "file:./dev.db";

  // When deployed to Vercel (read-only filesystem in /var/task), copy SQLite DB to /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = "/tmp/dev.db";
    try {
      if (!fs.existsSync(tmpDbPath) || fs.statSync(tmpDbPath).size === 0) {
        // Try candidate source paths in the bundled deployment
        const candidatePaths = [
          path.join(process.cwd(), "prisma", "dev.db"),
          path.join(process.cwd(), "prisma", "prisma", "dev.db"),
          path.join(process.cwd(), "dev.db"),
          path.join(__dirname, "dev.db"),
          path.join(__dirname, "..", "prisma", "dev.db"),
        ];

        let copied = false;
        for (const src of candidatePaths) {
          try {
            if (fs.existsSync(src) && fs.statSync(src).size > 0) {
              fs.copyFileSync(src, tmpDbPath);
              copied = true;
              console.log(`[Prisma] Seeded /tmp/dev.db from ${src}`);
              break;
            }
          } catch {
            // continue searching
          }
        }

        if (!copied) {
          console.warn("[Prisma] No source dev.db found to copy to /tmp");
        }
      }
      dbUrl = "file:/tmp/dev.db";
    } catch (err) {
      console.error("[Prisma] Error setting up /tmp/dev.db:", err);
    }
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
