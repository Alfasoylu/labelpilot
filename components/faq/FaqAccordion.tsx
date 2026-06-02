import type { FAQ } from "@/lib/site-content";

type FaqAccordionProps = {
  faqs: FAQ[];
};

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  return (
    <div className="faq-accordion">
      {faqs.map((faq) => (
        <details key={faq.question}>
          <summary>{faq.question}</summary>
          <div className="faq-answer">{faq.answer}</div>
        </details>
      ))}
    </div>
  );
}
