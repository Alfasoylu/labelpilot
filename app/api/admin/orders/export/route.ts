import { NextResponse } from "next/server";

import type { OrderStatus } from "@prisma/client";

import { getPrismaClient } from "@/lib/db/prisma";
import { getServerEnv } from "@/lib/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function escapeCSV(value: string | number | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function csvRow(fields: (string | number | null | undefined)[]) {
  return fields.map(escapeCSV).join(",");
}

export async function GET(request: Request) {
  const env = getServerEnv();
  const authHeader = request.headers.get("authorization");
  const url = new URL(request.url);

  // Accept basic auth (same as admin pages) or APP_SECRET bearer
  const basicMatch = authHeader?.match(/^Basic (.+)$/);
  const bearerMatch = authHeader?.match(/^Bearer (.+)$/);
  const isBasicAuth = basicMatch
    ? (() => {
        const [user, pass] = Buffer.from(basicMatch[1], "base64").toString().split(":");
        return user === env.ADMIN_BASIC_USER && pass === env.ADMIN_BASIC_PASSWORD;
      })()
    : false;
  const isBearerAuth = bearerMatch && env.APP_SECRET
    ? bearerMatch[1] === env.APP_SECRET
    : false;

  if (!isBasicAuth && !isBearerAuth) {
    return new NextResponse(null, {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const statusFilter = url.searchParams.get("status") ?? "production";
  const statusIn: OrderStatus[] =
    statusFilter === "all"
      ? ["APPROVED_FOR_PRODUCTION", "IN_PRODUCTION", "READY_TO_SHIP"]
      : ["APPROVED_FOR_PRODUCTION", "IN_PRODUCTION"];

  const orders = await prisma.order.findMany({
    where: { status: { in: statusIn } },
    include: {
      artworkFiles: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const baseUrl = (env.ADMIN_NOTIFY_EMAIL
    ? process.env.NEXT_PUBLIC_APP_URL
    : undefined) ?? "https://labelpilot.de";
  const cleanBase = baseUrl.replace(/\/$/, "");

  const headerRow = csvRow([
    "Bestellnummer", "Status", "Erstellt", "Material", "Menge",
    "Breite mm", "Höhe mm", "Oberfläche", "Rollenkern", "Abrollrichtung",
    "Max. Rollendurchmesser", "Maschine", "Firma", "Ansprechpartner",
    "E-Mail", "PLZ", "Ort", "Straße", "Druckdatei-URL",
  ]);

  const dataRows = orders.map((o) => {
    const af = o.artworkFiles[0];
    const artworkUrl = af
      ? `${cleanBase}/api/admin/orders/${o.id}/artwork/${af.id}`
      : "";
    return csvRow([
      o.orderNumber,
      o.status,
      o.createdAt.toISOString().slice(0, 10),
      o.material,
      o.quantity,
      o.widthMm,
      o.heightMm,
      o.finishing,
      o.rollKern,
      o.abrollrichtung,
      o.maxRollendurchmesser,
      o.maschineName,
      o.companyName,
      o.customerName,
      o.customerEmail,
      o.postalCode,
      o.city,
      o.streetAddress,
      artworkUrl,
    ]);
  });

  const today = new Date().toISOString().slice(0, 10);
  const csv = "﻿" + [headerRow, ...dataRows].join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="produktion-${today}.csv"`,
    },
  });
}
