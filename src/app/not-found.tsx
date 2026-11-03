import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <PageShell eyebrow="404 / Not found" title="This page is unavailable">
      <p className="development-notice">
        The requested page could not be found.
      </p>
      <p>
        <Link className="text-link" href="/">Return to NDCR home <span aria-hidden="true">↗</span></Link>
        {" · "}
        <Link className="text-link" href="/radio">Open the archive <span aria-hidden="true">↗</span></Link>
      </p>
    </PageShell>
  );
}
