import { PrismaClient } from "@prisma/client";

import { hasDatabaseEnv } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var __labelpilotPrisma__: PrismaClient | undefined;
}

export function getPrismaClient() {
  if (!hasDatabaseEnv()) {
    return null;
  }

  if (!global.__labelpilotPrisma__) {
    global.__labelpilotPrisma__ = new PrismaClient();
  }

  return global.__labelpilotPrisma__;
}

