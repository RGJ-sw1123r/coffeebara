import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma";

const globalForPrisma = globalThis;
const databaseUrl = process.env.DATABASE_URL;

function buildMariaDbConfig(connectionString) {
  const url = new URL(connectionString);
  const sslAccept = url.searchParams.get("sslaccept");
  const sslMode = url.searchParams.get("sslmode");
  const shouldUseTls =
    sslAccept === "accept_invalid_certs" ||
    sslMode === "trust" ||
    sslMode === "required" ||
    sslMode === "verify-ca" ||
    sslMode === "verify-full";

  const config = {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
  };

  if (shouldUseTls) {
    config.ssl =
      sslAccept === "accept_invalid_certs" || sslMode === "trust"
        ? { rejectUnauthorized: false }
        : true;
  }

  return config;
}

function createPrismaClient() {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to initialize Prisma.");
  }

  return new PrismaClient({
    adapter: new PrismaMariaDb(buildMariaDbConfig(databaseUrl)),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
