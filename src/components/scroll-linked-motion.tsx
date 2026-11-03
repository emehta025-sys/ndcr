"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollLinkedMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = true;
    let runId = 0;
    let media: { revert: () => void } | undefined;

    const configure = async () => {
      const currentRun = ++runId;
      media?.revert();
      media = undefined;
      if (reducedMotion.matches) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (!active || currentRun !== runId || reducedMotion.matches) return;

      gsap.registerPlugin(ScrollTrigger);
      const nextMedia = gsap.matchMedia();
      nextMedia.add("(min-width: 701px)", () => {
        const heroArtwork = document.querySelector<HTMLElement>(".hero-logo-artwork");
        const hero = document.querySelector<HTMLElement>(".home-hero");
        if (heroArtwork && hero) {
          gsap.to(heroArtwork, {
            y: -10,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 },
          });
        }

        const headings = gsap.utils.toArray<HTMLElement>(
          ".home-event-section .editorial-section-heading h2, .home-photography-section .editorial-section-heading h2",
        );
        headings.forEach((heading) => {
          const section = heading.closest<HTMLElement>(".editorial-section");
          if (!section) return;
          gsap.fromTo(heading, { y: 5 }, {
            y: -5,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.9 },
          });
        });

        const photoFrame = document.querySelector<HTMLElement>(".home-photography-section .event-photo-1");
        const photoSection = document.querySelector<HTMLElement>(".home-photography-section");
        if (photoFrame && photoSection) {
          gsap.to(photoFrame, {
            y: -7,
            ease: "none",
            scrollTrigger: { trigger: photoSection, start: "top bottom", end: "bottom top", scrub: 1 },
          });
        }
      });
      media = nextMedia;
      ScrollTrigger.refresh();
    };

    reducedMotion.addEventListener("change", configure);
    void configure();
    return () => {
      active = false;
      runId += 1;
      reducedMotion.removeEventListener("change", configure);
      media?.revert();
    };
  }, [pathname]);

  return null;
}
