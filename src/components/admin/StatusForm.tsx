"use client";

import { useFormStatus } from "react-dom";
import { setSubmissionStatus } from "@/app/admin/actions";
import type { Submission } from "@/lib/submissions";
import { cn } from "@/lib/utils";

const options: { value: Submission["status"]; label: string }[] = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
];

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 shrink-0 items-center rounded-full border-2 border-espresso bg-espresso px-4 font-heading text-sm font-bold text-cream transition-all hover:bg-pink hover:text-espresso disabled:opacity-60"
    >
      {pending ? "Saving…" : "Update"}
    </button>
  );
}

export function StatusForm({ id, status, className }: { id: string; status: Submission["status"]; className?: string }) {
  const selectId = `status-${id}`;
  return (
    <form key={status} action={setSubmissionStatus} className={cn("flex flex-col gap-1.5", className)}>
      <input type="hidden" name="id" value={id} />
      <label htmlFor={selectId} className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-cocoa/80">
        Status
      </label>
      <div className="flex gap-2">
        <select
          id={selectId}
          name="status"
          defaultValue={status}
          className="h-11 min-w-0 flex-1 appearance-none rounded-full border-2 border-espresso/20 bg-white bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%232a1910%22%20stroke-width%3D%222.5%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:14px] bg-[right_0.9rem_center] bg-no-repeat pr-9 pl-4 text-sm font-semibold text-espresso focus:border-espresso focus:outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <SaveButton />
      </div>
    </form>
  );
}
