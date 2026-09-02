export function formatMoney(amount: number | null): string {
  if (amount === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export const JOB_STATUSES = [
  "quoted",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export function toJobStatus(value: string | null): JobStatus {
  return (JOB_STATUSES as readonly string[]).includes(value ?? "")
    ? (value as JobStatus)
    : "quoted";
}

export function statusLabel(status: JobStatus): string {
  switch (status) {
    case "in_progress":
      return "In progress";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
