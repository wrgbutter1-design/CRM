"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/client";
import { toJobStatus } from "@/lib/format";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() !== ""
    ? value.trim()
    : null;
}

function num(formData: FormData, key: string): number | null {
  const value = str(formData, key);
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function createCustomer(formData: FormData) {
  const name = str(formData, "name");
  if (!name) throw new Error("Customer name is required.");

  const supabase = createClient();
  const { error } = await supabase.from("customers").insert({
    name,
    company_name: str(formData, "company_name"),
    phone: str(formData, "phone"),
    email: str(formData, "email"),
    billing_address: str(formData, "billing_address"),
  });
  if (error) throw new Error(error.message);

  revalidatePath("/");
}

export async function createJob(formData: FormData) {
  const customerId = str(formData, "customer_id");
  const title = str(formData, "title");
  if (!customerId || !title) {
    throw new Error("Job title is required.");
  }

  const supabase = createClient();
  const { error } = await supabase.from("jobs").insert({
    customer_id: customerId,
    title,
    description: str(formData, "description"),
    status: toJobStatus(str(formData, "status")),
    site_address: str(formData, "site_address"),
    quoted_amount: num(formData, "quoted_amount"),
    scheduled_date: str(formData, "scheduled_date"),
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/customers/${customerId}`);
  revalidatePath("/jobs");
}

export async function addJobNote(formData: FormData) {
  const jobId = str(formData, "job_id");
  const customerId = str(formData, "customer_id");
  const author = str(formData, "author");
  const note = str(formData, "note");
  if (!jobId || !author || !note) {
    throw new Error("Author and note are required.");
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("job_notes")
    .insert({ job_id: jobId, author, note });
  if (error) throw new Error(error.message);

  if (customerId) revalidatePath(`/customers/${customerId}`);
}
