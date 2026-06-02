type ProcessStep = {
  title: string;
  body: string;
};

type ProcessStepsProps = {
  steps: ProcessStep[];
};

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <div className="steps-grid">
      {steps.map((step, index) => (
        <article key={step.title} className="step-card">
          <span className="badge">Schritt {index + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </article>
      ))}
    </div>
  );
}
