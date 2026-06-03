"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Step = {
  src: string;
  no: string;
  eyebrow: string;
  title: string;
  body: string;
};

type Sector = {
  src: string;
  label: string;
  material: "Opak" | "Transparent";
};

const BASE = "/images/editorial/journey";

const STEPS: Step[] = [
  {
    src: `${BASE}/journey-01-rohmaterial-blank-rolle.webp`,
    no: "01",
    eyebrow: "Rohmaterial",
    title: "Blanko PP-Material auf der Rolle.",
    body: "Alles beginnt mit reinweißer, langlebiger PP-Folie – bahnenweise auf der Rolle.",
  },
  {
    src: `${BASE}/journey-02-bedruckt-farbe-trifft-folie.webp`,
    no: "02",
    eyebrow: "Druck",
    title: "Ihr Motiv trifft auf die Folie.",
    body: "Brillanter Druck, passgenau in Ihren Farben – sauber Bahn für Bahn.",
  },
  {
    src: `${BASE}/journey-03-veredelung-mattlack.webp`,
    no: "03",
    eyebrow: "Veredelung",
    title: "Schutzlack für matte Haptik.",
    body: "Eine matte Schutzschicht macht die Oberfläche widerstandsfähig und wertig.",
  },
  {
    src: `${BASE}/journey-04-stanzen-konturschnitt.webp`,
    no: "04",
    eyebrow: "Stanzung",
    title: "Saubere Konturstanzung.",
    body: "Präzise Konturschnitte in jeder Form – ohne ausgefranste Kanten.",
  },
  {
    src: `${BASE}/journey-05-fertige-druckrolle.webp`,
    no: "05",
    eyebrow: "Rollenfertig",
    title: "Aufgewickelt und maschinenfertig.",
    body: "Fertig konfektioniert auf der Rolle – bereit für Ihren Etikettierprozess.",
  },
  {
    src: `${BASE}/journey-06-einzeletikett-abziehen.webp`,
    no: "06",
    eyebrow: "Einzeletikett",
    title: "Leicht abzuziehen.",
    body: "Vom Liner gelöst – jedes Etikett sitzt sofort sauber auf dem Produkt.",
  },
  {
    src: `${BASE}/journey-07-proof-freigegeben.webp`,
    no: "07",
    eyebrow: "Freigabe",
    title: "Produziert wird erst nach Ihrer Freigabe.",
    body: "Druckdatencheck und Proof inklusive – erst nach Ihrem „Freigegeben“ läuft die Produktion.",
  },
  {
    src: `${BASE}/journey-08-transparent-no-label-look.webp`,
    no: "08",
    eyebrow: "Transparent",
    title: "No-Label-Look auf Glas.",
    body: "Transparentes PP wirkt wie direkt aufgedruckt – ideal für Flaschen und Gläser.",
  },
  {
    src: `${BASE}/journey-09-finale-5-branchen-wide.webp`,
    no: "09",
    eyebrow: "Im Einsatz",
    title: "Auf Ihrem Produkt – für fünf Branchen.",
    body: "Opak und transparent, von Honig bis Naturkosmetik: dieselbe saubere PP-Produktion.",
  },
];

const SECTORS: Sector[] = [
  { src: `${BASE}/journey-10-honig-opak-anwendung.webp`, label: "Imkerei & Honig", material: "Opak" },
  { src: `${BASE}/journey-11-getraenke-transparent-anwendung.webp`, label: "Getränke", material: "Transparent" },
  { src: `${BASE}/journey-12-supplement-opak-anwendung.webp`, label: "Supplement", material: "Opak" },
  { src: `${BASE}/journey-13-kaffee-opak-anwendung.webp`, label: "Rösterei & Kaffee", material: "Opak" },
  { src: `${BASE}/journey-14-kosmetik-transparent-anwendung.webp`, label: "Naturkosmetik", material: "Transparent" },
];

export function LabelJourney() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      return; // keep the static, fully-readable fallback
    }

    setInteractive(true);

    let frame = 0;
    const update = () => {
      frame = 0;
      const el = trackRef.current;
      if (!el) {
        return;
      }
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0;
      const index = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
      setActive((prev) => (prev === index ? prev : index));
    };
    const onScroll = () => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const current = STEPS[active];

  return (
    <section className="lj" aria-label="So entsteht Ihr PP-Rollenetikett">
      <div className="container lj-head section-header">
        <span className="eyebrow">Vom Material zum Regal</span>
        <h2>So entsteht Ihr PP-Rollenetikett.</h2>
        <p>
          Neun Schritte von der blanken Folie bis zum fertigen Produkt – opak und
          transparent.
        </p>
      </div>

      {interactive ? (
        <div
          ref={trackRef}
          className="lj-track"
          style={{ height: `calc(${STEPS.length} * 62vh + 100vh)` }}
        >
          <div className="lj-sticky">
            <div className="container lj-stage">
              <div className="lj-frames" aria-hidden="true">
                {STEPS.map((step, index) => (
                  <Image
                    key={step.src}
                    src={step.src}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="(max-width: 900px) 88vw, 540px"
                    className={`lj-frame${index === active ? " is-active" : ""}`}
                  />
                ))}
              </div>
              <div className="lj-caption">
                <span className="lj-caption__no">
                  {current.no} <span aria-hidden="true">/ {String(STEPS.length).padStart(2, "0")}</span>
                </span>
                <span className="eyebrow">{current.eyebrow}</span>
                <h3 key={current.title} className="lj-caption__title">
                  {current.title}
                </h3>
                <p key={current.body} className="lj-caption__body">
                  {current.body}
                </p>
                <ol className="lj-rail" aria-hidden="true">
                  {STEPS.map((step, index) => (
                    <li key={step.src} className={index === active ? "is-active" : ""} />
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ol className="container lj-static">
          {STEPS.map((step) => (
            <li key={step.src} className="lj-static__item">
              <div className="lj-static__media">
                <Image
                  src={step.src}
                  alt={step.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="lj-static__img"
                />
              </div>
              <div className="lj-static__text">
                <span className="eyebrow">
                  {step.no} · {step.eyebrow}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="container lj-sectors">
        <div className="section-header">
          <span className="eyebrow">Im Einsatz</span>
          <h3>Opak &amp; transparent – auf den Produkten unserer fünf Branchen.</h3>
        </div>
        <ul className="lj-sectors__grid">
          {SECTORS.map((sector) => (
            <li key={sector.src} className="lj-sector">
              <div className="lj-sector__media">
                <Image
                  src={sector.src}
                  alt={`PP-Etikett (${sector.material}) auf Produkt: ${sector.label}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 19vw"
                  className="lj-sector__img"
                />
              </div>
              <span className="lj-sector__label">{sector.label}</span>
              <span className="lj-sector__material">{sector.material} PP</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
