import Link from "next/link";

const footerLinks = [
  ["Radio / Archive", "/radio"],
  ["Artists", "/artists"],
  ["Events", "/events"],
  ["Photo Library", "/photo-library"],
  ["About", "/about"],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer site-footer-editorial">
      <div className="footer-main">
        <Link className="footer-wordmark" href="/" aria-label="NDCR home">NDCR</Link>
        <nav aria-label="Footer navigation" className="footer-navigation">
          {footerLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
      </div>
      <div className="footer-bottomline">
        <Link href="#top">Back to top ↑</Link>
      </div>
    </footer>
  );
}
