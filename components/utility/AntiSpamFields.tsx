"use client";

import { useEffect, useState } from "react";

import { HONEYPOT_FIELD, RENDERED_AT_FIELD } from "@/lib/security/form-spam";

/**
 * Unsichtbare Schutzfelder für öffentliche Formulare.
 *
 * Das Honeypot-Feld wird bewusst NICHT über `display: none` versteckt — viele
 * Bots überspringen ausgeblendete Felder. Stattdessen steht es außerhalb des
 * sichtbaren Bereichs, ist für Screenreader ausgeblendet und nicht per Tab
 * erreichbar. Für einen Menschen ist es unerreichbar, für einen Bot, der das
 * HTML parst, sieht es wie ein normales Feld aus.
 *
 * Der Zeitstempel wird erst im Browser gesetzt (useEffect), damit er den
 * tatsächlichen Zeitpunkt des Formularaufrufs abbildet und nicht den Zeitpunkt
 * eines vorgerenderten HTML-Caches.
 */
export function AntiSpamFields() {
  const [renderedAt, setRenderedAt] = useState("");

  useEffect(() => {
    setRenderedAt(String(Date.now()));
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor={HONEYPOT_FIELD}>
          Bitte dieses Feld leer lassen
          <input
            id={HONEYPOT_FIELD}
            name={HONEYPOT_FIELD}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>
      <input
        type="hidden"
        name={RENDERED_AT_FIELD}
        value={renderedAt}
        readOnly
      />
    </>
  );
}
