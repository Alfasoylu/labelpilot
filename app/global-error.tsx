"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="de">
      <body
        style={{
          fontFamily: "Arial, sans-serif",
          margin: 0,
          padding: "48px",
          background: "#F7F2E8",
          color: "#2A2926",
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h1 style={{ color: "#11100E" }}>Es ist ein technischer Fehler aufgetreten.</h1>
          <p>
            Bitte laden Sie die Seite neu oder versuchen Sie es später erneut. Falls das
            Problem bestehen bleibt, erreichen Sie uns über kontakt@labelpilot.de.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              background: "#11100E",
              color: "#FFFFFF",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Erneut versuchen
          </button>
        </div>
      </body>
    </html>
  );
}
