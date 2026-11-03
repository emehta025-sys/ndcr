import Link from "next/link";

const items = [
  { href: "/about/vision", label: "Vision" },
  { href: "/about/what", label: "What?" },
  { href: "/about/who", label: "Who?" },
];

export function AboutNavigation({ current }: { current?: string }) {
  return <nav className="about-navigation" aria-label="About NDCR">
    {items.map((item) => <Link href={item.href} key={item.href} aria-current={current === item.href ? "page" : undefined}>{item.label}<span aria-hidden="true">↗</span></Link>)}
  </nav>;
}
