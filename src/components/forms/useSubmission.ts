"use client";

import { useState } from "react";
import type { SubmissionType } from "@/lib/submissions";

type State = { status: "idle" | "submitting" | "success" | "error"; error?: string; id?: string };

/**
 * const { submit, state, honeypot, setHoneypot } = useSubmission("member");
 * await submit({ name, email, ... })  // resolves true on success
 */
export function useSubmission(type: SubmissionType) {
  const [state, setState] = useState<State>({ status: "idle" });
  const [honeypot, setHoneypot] = useState("");

  async function submit(data: Record<string, unknown>) {
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type, data, website: honeypot }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; id?: string };
      if (!res.ok || !json.ok) {
        setState({ status: "error", error: json.error ?? "Something went wrong. Please try again." });
        return false;
      }
      setState({ status: "success", id: json.id });
      return true;
    } catch {
      setState({ status: "error", error: "We couldn't reach the server. Check your connection and try again." });
      return false;
    }
  }

  return { submit, state, setState, honeypot, setHoneypot, submitting: state.status === "submitting" };
}
