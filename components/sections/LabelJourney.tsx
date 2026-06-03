"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

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
const MOBILE_MIN = 700; // below this width → static fallback (reliability)

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
const pad2 = (value: number) => String(value).padStart(2, "0");

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
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectorRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [interactive, setInteractive] = useState(false);

  // Decide mode on mount + on resize / motion-pref change.
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => {
      setInteractive(!reduce.matches && window.innerWidth >= MOBILE_MIN);
    };
    decide();
    window.addEventListener("resize", decide);
    reduce.addEventListener?.("change", decide);
    return () => {
      window.removeEventListener("resize", decide);
      reduce.removeEventListener?.("change", decide);
    };
  }, []);

  // Scroll scrubbing — only while interactive. Imperative style writes, no per-frame re-render.
  useEffect(() => {
    if (!interactive || typeof window === "undefined") {
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const track = trackRef.current;
      if (!track) {
        return;
      }
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
      const pos = progress * (STEPS.length - 1);

      const frames = frameRefs.current;
      for (let i = 0; i < frames.length; i += 1) {
        const el = frames[i];
        if (!el) {
          continue;
        }
        const distance = clamp(Math.abs(i - pos), 0, 1);
        el.style.opacity = String(1 - distance);
        el.style.transform = `scale(${(1 + 0.03 * distance).toFixed(4)})`;
      }
      stageRef.current?.style.setProperty("--lj-progress", progress.toFixed(4));

      const index = clamp(Math.round(pos), 0, STEPS.length - 1);
      setActive((prev) => (prev === index ? prev : index));
    };
    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
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
  }, [interactive]);

  // Staggered payoff-grid reveal (once). Reduced-motion / no-IO → show immediately.
  useEffect(() => {
    const elements = sectorRefs.current.filter(Boolean) as HTMLLIElement[];
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      return; // leave tiles visible (no-JS / reduced-motion safe)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    elements.forEach((el) => {
      el.classList.add("is-armed"); // hidden state applied only when JS+IO present
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const jumpTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const top = track.getBoundingClientRect().top + window.scrollY;
    const scrollable = track.offsetHeight - window.innerHeight;
    const target = top + (index / (STEPS.length - 1)) * Math.max(scrollable, 0);
    window.scrollTo({ top: target, behavior: "smooth" });
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
            <div ref={stageRef} className="container lj-stage">
              <div className="lj-frames" aria-hidden="true">
                {STEPS.map((step, index) => (
                  <div
                    key={step.src}
                    className="lj-frame"
                    ref={(el) => {
                      frameRefs.current[index] = el;
                    }}
                  >
                    <Image
                      src={step.src}
                      alt=""
                      fill
                      priority={index < 2}
                      sizes="(max-width: 900px) 88vw, 540px"
                      className="lj-frame__img"
                    />
                  </div>
                ))}
              </div>
              <div className="lj-caption">
                <span className="lj-caption__no">
                  {current.no}{" "}
                  <span aria-hidden="true">/ {pad2(STEPS.length)}</span>
                </span>
                <span className="eyebrow">{current.eyebrow}</span>
                <h3 key={current.title} className="lj-caption__title">
                  {current.title}
                </h3>
                <p key={current.body} className="lj-caption__body">
                  {current.body}
                </p>
                <div className="lj-bar" aria-hidden="true">
                  <span className="lj-bar__fill" />
                </div>
                <ol className="lj-ticks">
                  {STEPS.map((step, index) => (
                    <li key={step.src}>
                      <button
                        type="button"
                        className={`lj-tick${index === active ? " is-active" : ""}`}
                        aria-label={`Schritt ${step.no}: ${step.eyebrow}`}
                        aria-current={index === active ? "step" : undefined}
                        onClick={() => jumpTo(index)}
                      />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Screen-reader narrative — interactive stage is decorative/aria-hidden */}
          <ol className="lj-sr">
            {STEPS.map((step) => (
              <li key={step.src}>
                {step.no} – {step.eyebrow}: {step.title} {step.body}
              </li>
            ))}
          </ol>
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
          {SECTORS.map((sector, index) => (
            <li
              key={sector.src}
              className="lj-sector"
              ref={(el) => {
                sectorRefs.current[index] = el;
              }}
            >
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
