import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatMoney, toJobStatus } from "@/lib/format";
import type { Database } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

type JobStatus = Database["public"]["Enums"]["job_status"];

const TABS = [
  { key: "upcoming", label: "Upcoming", statuses: ["quoted", "scheduled"] },
  { key: "ongoing", label: "Ongoing", statuses: ["in_progress"] },
  { key: "completed", label: "Completed", statuses: ["completed"] },
] as const satisfies readonly {
  key: string;
  label: string;
  statuses: readonly JobStatus[];
}[];

type TabKey = (typeof TABS)[number]["key"] | "cancelled";

function isTabKey(value: string | undefined): value is TabKey {
  return (
    value !== undefined &&
    (TABS.some((t) => t.key === value) || value === "cancelled")
  );
}

function tabStatuses(tab: TabKey): readonly JobStatus[] {
  if (tab === "cancelled") return ["cancelled"];
  return TABS.find((t) => t.key === tab)!.statuses;
}

function buildHref(tab: string, q?: string, date?: string) {
  const params = new URLSearchParams({ tab });
  if (q) params.set("q", q);
  if (date) params.set("date", date);
  return `/jobs?${params.toString()}`;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string; date?: string }>;
}) {
  const { tab: rawTab, q, date } = await searchParams;
  const tab: TabKey = isTabKey(rawTab) ? rawTab : "upcoming";
  const supabase = await createClient();

  let query = supabase
    .from("jobs")
    .select(
      "*, customers!inner(id, name, company_name), job_leaders(name)"
    )
    .in("status", tabStatuses(tab))
    .order("scheduled_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`name.ilike.%${q}%,company_name.ilike.%${q}%`, {
      foreignTable: "customers",
    });
  }
  if (date) {
    query = query.eq("scheduled_date", date);
  }

  const { data: jobs, error } = await query;
  if (error) throw new Error(error.message);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
        <p className="mt-1 text-sm text-muted">
          Every job across every customer.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-sm">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={buildHref(t.key, q, date)}
              className={`rounded-full border px-3 py-1 ${
                tab === t.key
                  ? "border-accent text-accent"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {t.label}
            </Link>
          ))}
          <Link
            href={buildHref("cancelled", q, date)}
            className={`rounded-full border px-3 py-1 ${
              tab === "cancelled"
                ? "border-accent text-accent"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            Cancelled
          </Link>
        </div>

        <form
          method="GET"
          action="/jobs"
          className="flex flex-wrap items-center gap-2"
        >
          <input type="hidden" name="tab" value={tab} />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by customer name…"
            className="w-48 rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
          />
          <input
            type="date"
            name="date"
            defaultValue={date}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:border-accent hover:text-accent"
          >
            Search
          </button>
          {(q || date) && (
            <Link
              href={buildHref(tab)}
              className="text-sm text-muted hover:text-foreground"
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Job leader</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Scheduled</th>
              <th className="px-4 py-3 text-right">Quoted</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={6}>
                  No jobs match this filter.
                </td>
              </tr>
            )}
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{job.title}</td>
                <td className="px-4 py-3">
                  {job.customers && (
                    <Link
                      href={`/customers/${job.customers.id}`}
                      className="text-muted hover:text-accent"
                    >
                      {job.customers.company_name ?? job.customers.name}
                    </Link>
                  )}
                </td>
                <td className="px-4 py-3 text-muted">
                  {job.job_leaders?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={toJobStatus(job.status)} />
                </td>
                <td className="px-4 py-3 text-muted">
                  {formatDate(job.scheduled_date)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatMoney(job.quoted_amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
