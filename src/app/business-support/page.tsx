import type { Metadata } from "next";
import { getSession, hasRole } from "@/lib/session";
import { requestNow } from "@/components/support/deadline";
import { MemberHub } from "@/components/support/MemberHub";
import { SupportTeaser } from "@/components/support/SupportTeaser";

// Shows the public teaser or the members' hub depending on the session cookie
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Business Support for members",
  description:
    "Members-only business support from Black Owned Sheffield: funding, grants, advice, mentoring, workshops, training, networking and the Business Opportunities board for Black-owned businesses in South Yorkshire.",
  alternates: { canonical: "/business-support" },
};

export default async function BusinessSupportPage(props: PageProps<"/business-support">) {
  const searchParams = await props.searchParams;

  if (!(await hasRole("member"))) {
    return <SupportTeaser signedOut={searchParams.signedout === "1"} />;
  }

  const session = await getSession();
  return <MemberHub name={session?.name} now={requestNow()} />;
}
