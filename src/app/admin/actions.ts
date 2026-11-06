"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkCredential, endSession, hasRole, startSession } from "@/lib/session";
import { updateSubmissionStatus, type Submission } from "@/lib/submissions";

export type LoginState = { error?: string };

/** Team sign-in (used with useActionState) */
export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!password.trim()) return { error: "Enter the team password." };
  if (!checkCredential("admin", password)) {
    // A small pause makes guessing slower
    await new Promise((r) => setTimeout(r, 700));
    return { error: "That password isn't right. Check it and try again." };
  }
  await startSession("admin", "BOS team");
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin");
}

const STATUSES: Submission["status"][] = ["new", "reviewing", "approved", "declined"];

/** Change a submission's status from the dashboard */
export async function setSubmissionStatus(formData: FormData) {
  if (!(await hasRole("admin"))) throw new Error("You need to be signed in as the team to do that.");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as Submission["status"];
  if (!id || !STATUSES.includes(status)) return;
  await updateSubmissionStatus(id, status);
  revalidatePath("/admin");
}
