import { IconAlert, IconCheck, IconX } from "./Icons";
import type { TimelineStep } from "@/lib/orders/status-style";

interface StatusTimelineProps {
  steps: TimelineStep[];
}

function dotContent(step: TimelineStep) {
  if (step.state === "done") return <IconCheck size={13} />;
  if (step.state === "error") {
    return step.tone === "danger" ? <IconX size={13} /> : <IconAlert size={13} />;
  }
  return null;
}

export function StatusTimeline({ steps }: StatusTimelineProps) {
  return (
    <ol className="account-timeline" aria-label="Bestellfortschritt">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const toneClass = step.tone ? ` account-timeline__step--tone-${step.tone}` : "";
        return (
          <li
            key={step.key}
            className={`account-timeline__step account-timeline__step--${step.state}${toneClass}`}
            aria-current={step.state === "current" ? "step" : undefined}
          >
            <span className="account-timeline__rail" aria-hidden>
              <span className="account-timeline__dot">{dotContent(step)}</span>
              {!isLast ? <span className="account-timeline__line" /> : null}
            </span>
            <span className="account-timeline__body">
              <span className="account-timeline__label">{step.label}</span>
              {step.hint ? <span className="account-timeline__hint">{step.hint}</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
