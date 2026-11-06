import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Members",
  description: "Black Owned Sheffield members' area.",
  robots: { index: false },
};

/** /members has no page of its own: send people to Business Support (hub or teaser) */
export default function MembersPage() {
  redirect("/business-support");
}
