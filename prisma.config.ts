import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Falls back to empty string to prevent build-time crashes if DB is offline
    url: process.env.DATABASE_URL ?? "", 
  },
});