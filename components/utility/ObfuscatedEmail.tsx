"use client";

import { useEffect, useState } from "react";

export function ObfuscatedEmail({ className }: { className?: string }) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Assembled only on the client — never in static HTML, never crawlable by bots
    const parts = ["kontakt", "labelpilot", "de"];
    setEmail(`${parts[0]}@${parts[1]}.${parts[2]}`);
  }, []);

  if (!email) {
    return (
      <span className={className} aria-label="E-Mail-Adresse wird geladen">
        kontakt [at] labelpilot.de
      </span>
    );
  }

  return (
    <a href={`mailto:${email}`} className={className}>
      {email}
    </a>
  );
}
