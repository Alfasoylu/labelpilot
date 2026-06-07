"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AdminLoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten.");
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <main
      className="container"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <article className="surface-card" style={{ width: "100%", maxWidth: "400px" }}>
        <h1 style={{ marginBottom: "1.5rem" }}>Admin-Anmeldung</h1>
        <form onSubmit={handleSubmit} className="form-grid">
          <div>
            <label htmlFor="admin-email">E-Mail-Adresse</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-password">Passwort</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? <p className="form-status error">{error}</p> : null}
          <div className="inline-actions">
            <button type="submit" className="cta-button" disabled={loading}>
              {loading ? "Anmelden …" : "Anmelden"}
            </button>
          </div>
        </form>
      </article>
    </main>
  );
}
