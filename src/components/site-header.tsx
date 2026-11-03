"use client";

import Link from "next/link";
import { useState } from "react";
import { NDCRBrandLink } from "@/components/ndcr-brand-link";

const navigation = [
  { href: "/radio", label: "Radio / Archive", index: "01" },
  { href: "/artists", label: "Artists", index: "02" },
  { href: "/events", label: "Events", index: "03" },
  { href: "/photo-library", label: "Photo Library", index: "04" },
  { href: "/about", label: "About", index: "05" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header" id="top">
      <NDCRBrandLink />
      <button className="mobile-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen((open) => !open)}>
        <span>{menuOpen ? "Close" : "Menu"}</span><span className="menu-icon" aria-hidden="true">{menuOpen ? "×" : "+"}</span>
      </button>
      <nav aria-label="Main navigation" className={`main-navigation${menuOpen ? " is-open" : ""}`} id="main-navigation">
        {navigation.map((item) => (
          <Link href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
            <span className="nav-index" aria-hidden="true">{item.index}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
