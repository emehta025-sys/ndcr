"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Release } from "@/content/release-schema";

export type MobileArchiveCard = Pick<Release, "slug" | "artistCredit" | "releaseDate" | "genres" | "youtubeThumbnail"> & {
  label: string;
};

type GsapEngine = typeof import("gsap").gsap;
type ScrollTriggerInstance = InstanceType<typeof import("gsap/ScrollTrigger").ScrollTrigger>;

function formatDate(value: string | null) {
  if (!value) return "Date not listed";
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function MobileArchiveStack({ cards }: { cards: MobileArchiveCard[] }) {
  const interactionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (cards.length < 2) return;

    let active = true;
    let cleanup: (() => void) | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (!active || !interactionRef.current || !trackRef.current || !stageRef.current) return;

      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(max-width: 700px)", () => {
        const stage = stageRef.current;
        const track = trackRef.current;
        if (!stage || !track) return;

        const cardElements = Array.from(stage.querySelectorAll<HTMLElement>(".mobile-archive-card"));
        const xOffsets = [0, 5, -7, 8, -10, 11];
        const yOffsets = [0, 10, 19, 27, 34, 41];
        const rotations = [-0.7, 1.3, -2.1, 2.8, -3.3, 3.7];
        const scales = [1, 0.975, 0.95, 0.925, 0.9, 0.875];
        let currentActiveIndex = -1;

        const setActiveCard = (activeIndex: number) => {
          if (currentActiveIndex === activeIndex) return;
          currentActiveIndex = activeIndex;
          cardElements.forEach((card, index) => {
            const isActive = index === activeIndex;
            card.setAttribute("aria-hidden", String(!isActive));
            card.tabIndex = isActive ? 0 : -1;
            card.style.pointerEvents = isActive ? "auto" : "none";
          });
          if (liveRef.current) {
            liveRef.current.textContent = `Showing ${cards[activeIndex].label} by ${cards[activeIndex].artistCredit}. Scroll to move through the archive.`;
          }
        };

        cardElements.forEach((card, index) => {
          gsap.set(card, {
            x: xOffsets[index % xOffsets.length],
            y: yOffsets[index % yOffsets.length],
            rotation: rotations[index % rotations.length],
            scale: scales[index % scales.length],
            zIndex: cardElements.length - index,
          });
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: "top 18%",
            end: () => `+=${Math.max(track.offsetHeight - stage.offsetHeight + window.innerHeight * 0.18, window.innerHeight)}`,
            scrub: 0.28,
            invalidateOnRefresh: true,
            onUpdate: (self: ScrollTriggerInstance) => {
              const activeIndex = Math.min(cardElements.length - 1, Math.floor(self.progress * (cardElements.length - 1) + 0.5));
              setActiveCard(activeIndex);
            },
          },
        });

        for (let index = 0; index < cardElements.length - 1; index += 1) {
          timeline.to(cardElements[index], {
            yPercent: -138,
            x: index % 2 === 0 ? -12 : 12,
            rotation: index % 2 === 0 ? -4 : 4,
            scale: 0.965,
            duration: 1,
          }, index);
          timeline.to(cardElements[index + 1], {
            x: 0,
            y: 0,
            rotation: -0.7,
            scale: 1,
            duration: 0.82,
          }, index + 0.18);
        }

        setActiveCard(0);
        ScrollTrigger.refresh();
        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
          cardElements.forEach((card) => {
            gsap.set(card, { clearProps: "transform,zIndex,pointerEvents" });
          });
          setActiveCard(0);
        };
      });
      cleanup = () => media.revert();
    });

    return () => {
      active = false;
      cleanup?.();
    };
  }, [cards]);

  if (!cards.length) return null;

  return <div className="mobile-archive-interaction" ref={interactionRef}>
    <div className="mobile-archive-scroll-track" ref={trackRef} style={{ height: `${Math.max((cards.length - 1) * 58 + 36, 100)}svh` }}>
      <div className="mobile-archive-pin">
        <div className="mobile-archive-stack" ref={stageRef} role="group" aria-label="Selected sets from the NDCR archive" aria-roledescription="scrolling card stack">
          {cards.map((card, index) => {
            const active = index === 0;
            return <Link
              className="mobile-archive-card"
              data-stack-index={index}
              href={`/radio/${card.slug}`}
              key={card.slug}
              aria-label={`${card.label}, ${card.artistCredit}, ${formatDate(card.releaseDate)}. ${card.genres.join(", ") || "Genres not listed"}. Open set.`}
              aria-hidden={!active}
              tabIndex={active ? 0 : -1}
              style={{ pointerEvents: active ? "auto" : "none" }}
            >
              <span className="mobile-archive-card-art" aria-hidden="true">
                {card.youtubeThumbnail ? <Image src={card.youtubeThumbnail} alt="" fill sizes="(max-width: 700px) 92vw, 1px" unoptimized /> : <span className="mobile-archive-card-art-empty" />}
                <span className="mobile-archive-card-edition">NEW DELHI COMMUNITY RADIO</span>
                <span className="mobile-archive-card-number">{card.label}</span>
              </span>
              <span className="mobile-archive-card-copy">
                <span className="mobile-archive-card-artist">{card.artistCredit}</span>
                <span className="mobile-archive-card-meta">{card.genres.length ? card.genres.join(" / ") : "Genres not listed"}</span>
                <span className="mobile-archive-card-bottomline"><span>{formatDate(card.releaseDate)}</span><span>OPEN SET ↗</span></span>
              </span>
            </Link>;
          })}
        </div>
      </div>
    </div>
    <p className="mobile-archive-stack-cue" aria-hidden="true">SCROLL TO MOVE THROUGH THE STACK <span>·</span> TAP TO OPEN <span>·</span> {String(cards.length).padStart(2, "0")} SETS</p>
    <p className="visually-hidden" aria-live="polite" ref={liveRef}>Showing {cards[0].label} by {cards[0].artistCredit}. Scroll to move through the archive.</p>
  </div>;
}
