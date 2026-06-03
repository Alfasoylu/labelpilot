import { isReorderReminderEnabled } from "../env.ts";

type ReorderStockDuration =
  | "UNDER_4_WEEKS"
  | "ONE_TO_THREE_MONTHS"
  | "THREE_TO_SIX_MONTHS"
  | "OVER_SIX_MONTHS";

const STOCK_DURATION_TO_DEPLETION_DAYS: Record<ReorderStockDuration, number> = {
  UNDER_4_WEEKS: 21,
  ONE_TO_THREE_MONTHS: 60,
  THREE_TO_SIX_MONTHS: 135,
  OVER_SIX_MONTHS: 240,
};

export type RefillReminderCalculation = {
  featureEnabled: boolean;
  predictedDepletionAt: Date;
  reminderEligibleAt: Date | null;
  shouldScheduleReminder: boolean;
  reason: "scheduled" | "below_30_day_window";
  algorithmVersion: "v1";
};

export function calculateRefillReminder(input: {
  anchorDate: Date;
  stockDuration: ReorderStockDuration;
}) {
  const depletionDays = STOCK_DURATION_TO_DEPLETION_DAYS[input.stockDuration];
  const predictedDepletionAt = addDays(input.anchorDate, depletionDays);
  const reminderEligibleAt =
    depletionDays > 30 ? addDays(predictedDepletionAt, -30) : null;

  return {
    featureEnabled: isReorderReminderEnabled(),
    predictedDepletionAt,
    reminderEligibleAt,
    shouldScheduleReminder: reminderEligibleAt !== null,
    reason: reminderEligibleAt ? "scheduled" : "below_30_day_window",
    algorithmVersion: "v1",
  } satisfies RefillReminderCalculation;
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}
