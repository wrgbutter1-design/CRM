import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { StatusBadge } from "@/components/status-badge";
import { JOB_STATUSES, formatDate, formatMoney, statusLabel, toJobStatus } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = createClient();

  let query = supabase
    .from("jobs")
    .select("*, customers(id, name, company_name)")
    .order("created_at", { ascending: false });

  if (status && (JOB_STATUSES as readonly string[]).includes(status)) {
    query = query.eq("status", toJobStatus(status));
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

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/jobs"
          className={`rounded-full border px-3 py-1 ${
            !status
              ? "border-accent text-accent"
              : "border-border text-muted hover:text-foreground"
          }`}
        >
          All
        </Link>
        {JOB_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/jobs?status=${s}`}
            className={`rounded-full border px-3 py-1 ${
              status === s
                ? "border-accent text-accent"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {statusLabel(s)}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Scheduled</th>
              <th className="px-4 py-3 text-right">Quoted</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={5}>
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
