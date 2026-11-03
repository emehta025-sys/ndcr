import Link from "next/link";
import { AboutNavigation } from "@/components/about-navigation";
import { PageShell } from "@/components/page-shell";

export const metadata = { title: "About", description: "Vision, what, and who: New Delhi Community Radio." };

export default function AboutPage() {
  return <PageShell eyebrow="About NDCR" title="About">
    <p className="about-index-intro">New Delhi Community Radio</p>
    <AboutNavigation />
    <p className="about-index-note">Explore <Link href="/about/vision">Vision</Link>, <Link href="/about/what">What?</Link>, and <Link href="/about/who">Who?</Link>.</p>
  </PageShell>;
}
