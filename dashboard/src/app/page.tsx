import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createCustomer } from "./actions";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data: customers, error } = await supabase
    .from("customers")
    .select("id, name, company_name, phone, email, jobs(count)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="mt-1 text-sm text-muted">
          {customers.length} customer{customers.length === 1 ? "" : "s"} on
          file.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3 text-right">Jobs</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={4}>
                  No customers yet — add the first one below.
                </td>
              </tr>
            )}
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="font-medium hover:text-accent"
                  >
                    {customer.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">
                  {customer.company_name ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted">
                  {customer.phone ?? customer.email ?? "—"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {customer.jobs?.[0]?.count ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold">Add a customer</h2>
        <form
          action={createCustomer}
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Name</span>
            <input
              name="name"
              required
              placeholder="Dana Whitfield"
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Company (optional)</span>
            <input
              name="company_name"
              placeholder="Reyes Property Management"
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Phone</span>
            <input
              name="phone"
              placeholder="(555) 214-7783"
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Email</span>
            <input
              name="email"
              type="email"
              placeholder="dana@email.com"
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="font-medium">Billing address</span>
            <input
              name="billing_address"
              placeholder="412 Larkspur Ln, Millbrook"
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
            >
              Add customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
