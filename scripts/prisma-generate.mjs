import { spawnSync } from "node:child_process";

const defaults = {
  DATABASE_URL:
    "postgresql://labelpilot:labelpilot@localhost:5432/labelpilot?schema=public",
  DIRECT_URL:
    "postgresql://labelpilot:labelpilot@localhost:5432/labelpilot?schema=public",
};

for (const [key, value] of Object.entries(defaults)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["prisma", "generate"],
  {
    stdio: "inherit",
    env: process.env,
  }
);

if (typeof result.status === "number" && result.status !== 0) {
  process.exit(result.status);
}

