import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginClient } from "./AdminLoginClient";

export const metadata: Metadata = {
  title: "Admin-Anmeldung | Labelpilot.de",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginClient />
    </Suspense>
  );
}
