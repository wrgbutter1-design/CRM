import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { StatusBadge } from "@/components/status-badge";
import {
  JOB_STATUSES,
  formatDate,
  formatDateTime,
  formatMoney,
  statusLabel,
  toJobStatus,
} from "@/lib/format";
import { addJobNote, createJob } from "../../actions";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient();

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (customerError) throw new Error(customerError.message);
  if (!customer) notFound();

  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select("*, job_notes(id, author, note, created_at)")
    .eq("customer_id", id)
    .order("created_at", { ascending: false })
    .order("created_at", { ascending: true, foreignTable: "job_notes" });

  if (jobsError) throw new Error(jobsError.message);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← All customers
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {customer.name}
        </h1>
        {customer.company_name && (
          <p className="text-muted">{customer.company_name}</p>
        )}
        <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
          {customer.phone && (
            <div className="flex gap-2">
              <dt className="text-muted">Phone</dt>
              <dd>{customer.phone}</dd>
            </div>
          )}
          {customer.email && (
            <div className="flex gap-2">
              <dt className="text-muted">Email</dt>
              <dd>{customer.email}</dd>
            </div>
          )}
          {customer.billing_address && (
            <div className="flex gap-2 sm:col-span-2">
              <dt className="text-muted">Billing address</dt>
              <dd>{customer.billing_address}</dd>
            </div>
          )}
        </dl>
      </div>

      <div>
        <h2 className="text-lg font-semibold tracking-tight">Jobs</h2>
        <div className="mt-4 flex flex-col gap-4">
          {jobs.length === 0 && (
            <p className="text-sm text-muted">
              No jobs yet — add the first one below.
            </p>
          )}
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  {job.description && (
                    <p className="mt-1 text-sm text-muted">
                      {job.description}
                    </p>
                  )}
                </div>
                <StatusBadge status={toJobStatus(job.status)} />
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs text-muted">Site</dt>
                  <dd>{job.site_address ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Scheduled</dt>
                  <dd>{formatDate(job.scheduled_date)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Quoted</dt>
                  <dd className="tabular-nums">
                    {formatMoney(job.quoted_amount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Final</dt>
                  <dd className="tabular-nums">
                    {formatMoney(job.final_amount)}
                  </dd>
                </div>
              </dl>

              {job.job_notes.length > 0 && (
                <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-3">
                  {job.job_notes.map((note) => (
                    <li key={note.id} className="text-sm">
                      <span className="text-muted">
                        {formatDateTime(note.created_at)} · {note.author}
                      </span>
                      <p>{note.note}</p>
                    </li>
                  ))}
                </ul>
              )}

              <form
                action={addJobNote}
                className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3"
              >
                <input type="hidden" name="job_id" value={job.id} />
                <input type="hidden" name="customer_id" value={customer.id} />
                <input
                  name="author"
                  placeholder="Your name"
                  required
                  className="w-28 rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
                />
                <input
                  name="note"
                  placeholder="Add a note…"
                  required
                  className="min-w-[200px] flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:border-accent hover:text-accent"
                >
                  Add note
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold">Add a job</h2>
        <form
          action={createJob}
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <input type="hidden" name="customer_id" value={customer.id} />
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="font-medium">Title</span>
            <input
              name="title"
              required
              placeholder="Water heater replacement"
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="font-medium">Description (optional)</span>
            <input
              name="description"
              placeholder="What needs doing"
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Status</span>
            <select
              name="status"
              defaultValue="quoted"
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            >
              {JOB_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Scheduled date</span>
            <input
              type="date"
              name="scheduled_date"
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Site address</span>
            <input
              name="site_address"
              placeholder="Defaults to billing address"
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Quoted amount</span>
            <input
              type="number"
              step="0.01"
              name="quoted_amount"
              placeholder="0.00"
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
            >
              Add job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
