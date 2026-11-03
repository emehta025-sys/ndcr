import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollMotionProvider } from "@/components/scroll-motion-provider";
import { ScrollLinkedMotion } from "@/components/scroll-linked-motion";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NDCR — New Delhi Community Radio",
    template: "%s | NDCR",
  },
  description: "Website for New Delhi Community Radio.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <ScrollMotionProvider />
        <ScrollLinkedMotion />
        <div id="main-content">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
