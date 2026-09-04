"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

function file(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

async function uploadToStorage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  folder: string,
  uploaded: File
): Promise<string> {
  const safeName = uploaded.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${folder}/${crypto.randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("job-files")
    .upload(path, uploaded, { contentType: uploaded.type || undefined });
  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("job-files").getPublicUrl(path);
  return publicUrl;
}

export async function createCustomer(formData: FormData) {
  const name = str(formData, "name");
  if (!name) throw new Error("Customer name is required.");

  const supabase = await createClient();
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

async function resolveJobLeaderId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  name: string | null
): Promise<string | null> {
  if (!name) return null;
  const { data, error } = await supabase
    .from("job_leaders")
    .upsert({ name }, { onConflict: "name" })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id;
}

export async function createJob(formData: FormData) {
  const customerId = str(formData, "customer_id");
  const title = str(formData, "title");
  if (!customerId || !title) {
    throw new Error("Job title is required.");
  }

  const supabase = await createClient();
  const jobLeaderId = await resolveJobLeaderId(
    supabase,
    str(formData, "job_leader")
  );

  const { error } = await supabase.from("jobs").insert({
    customer_id: customerId,
    title,
    description: str(formData, "description"),
    status: toJobStatus(str(formData, "status")),
    site_address: str(formData, "site_address"),
    quoted_amount: num(formData, "quoted_amount"),
    scheduled_date: str(formData, "scheduled_date"),
    job_leader_id: jobLeaderId,
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

  const supabase = await createClient();
  const { error } = await supabase
    .from("job_notes")
    .insert({ job_id: jobId, author, note });
  if (error) throw new Error(error.message);

  if (customerId) revalidatePath(`/customers/${customerId}`);
}

export async function addJobPhoto(formData: FormData) {
  const jobId = str(formData, "job_id");
  const customerId = str(formData, "customer_id");
  const photo = file(formData, "photo");
  if (!jobId || !photo) {
    throw new Error("A photo is required.");
  }
  const label = str(formData, "label") ?? photo.name;

  const supabase = await createClient();
  const url = await uploadToStorage(supabase, `jobs/${jobId}`, photo);

  const { error } = await supabase
    .from("job_documents")
    .insert({ job_id: jobId, label, url });
  if (error) throw new Error(error.message);

  if (customerId) revalidatePath(`/customers/${customerId}`);
}

export async function addJobExpense(formData: FormData) {
  const jobId = str(formData, "job_id");
  const customerId = str(formData, "customer_id");
  const category = str(formData, "category");
  const description = str(formData, "description");
  const amount = num(formData, "amount");
  if (
    !jobId ||
    !description ||
    amount === null ||
    (category !== "materials" && category !== "labor")
  ) {
    throw new Error("Description, amount, and category are required.");
  }

  const supabase = await createClient();
  const receipt = file(formData, "receipt");
  const receiptUrl = receipt
    ? await uploadToStorage(supabase, `jobs/${jobId}`, receipt)
    : null;

  const { error } = await supabase.from("job_expenses").insert({
    job_id: jobId,
    category,
    description,
    amount,
    spent_on: str(formData, "spent_on") ?? undefined,
    receipt_url: receiptUrl,
  });
  if (error) throw new Error(error.message);

  if (customerId) revalidatePath(`/customers/${customerId}`);
}

export async function createEstimate(formData: FormData) {
  const customerId = str(formData, "customer_id");
  if (!customerId) throw new Error("Missing customer.");

  const supabase = await createClient();
  const { data: estimate, error } = await supabase
    .from("estimates")
    .insert({
      customer_id: customerId,
      site_address: str(formData, "site_address"),
      notes: str(formData, "notes"),
      estimated_amount: num(formData, "estimated_amount"),
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const photo = file(formData, "photo");
  if (photo) {
    const url = await uploadToStorage(supabase, `estimates/${estimate.id}`, photo);
    const { error: docError } = await supabase
      .from("estimate_documents")
      .insert({ estimate_id: estimate.id, label: photo.name, url });
    if (docError) throw new Error(docError.message);
  }

  revalidatePath(`/customers/${customerId}`);
}

export async function addEstimatePhoto(formData: FormData) {
  const estimateId = str(formData, "estimate_id");
  const customerId = str(formData, "customer_id");
  const photo = file(formData, "photo");
  if (!estimateId || !photo) {
    throw new Error("A photo is required.");
  }
  const label = str(formData, "label") ?? photo.name;

  const supabase = await createClient();
  const url = await uploadToStorage(supabase, `estimates/${estimateId}`, photo);

  const { error } = await supabase
    .from("estimate_documents")
    .insert({ estimate_id: estimateId, label, url });
  if (error) throw new Error(error.message);

  if (customerId) revalidatePath(`/customers/${customerId}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
