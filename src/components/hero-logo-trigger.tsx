"use client";

import Image from "next/image";
import { useState } from "react";
import { playNDCRJingle } from "@/components/ndcr-jingle";

export function HeroLogoTrigger() {
  const [playing, setPlaying] = useState(false);

  async function activate() {
    setPlaying(true);
    const started = await playNDCRJingle(() => setPlaying(false));
    if (!started) setPlaying(false);
    else if (!window.matchMedia("(max-width: 700px)").matches) window.setTimeout(() => setPlaying(false), 1100);
  }

  return <button className={`hero-logo-trigger${playing ? " is-playing" : ""}`} type="button" onClick={activate} aria-label="Play the NDCR station jingle">
    <span className="hero-logo-artwork" aria-hidden="true">
      <Image className="hero-ndcr-logo hero-ndcr-logo-default" src="/media/logos/ndcr-logo.png" alt="" width={4500} height={4081} sizes="(max-width: 900px) 42vw, 29rem" priority />
      <Image className="hero-ndcr-logo hero-ndcr-logo-hover" src="/media/logos/ndcr-logo-hover.png" alt="" width={4500} height={4082} sizes="(max-width: 900px) 42vw, 29rem" />
      <Image className="hero-logo-mobile-mark" src="/media/logos/ndcr-mark.png" alt="" width={4500} height={4083} sizes="(max-width: 700px) 72vw, 1px" />
    </span>
    <span className="hero-logo-prompt"><span className="hero-logo-indicator" aria-hidden="true" /><span className="hero-logo-prompt-desktop">Tap to hear NDCR</span><span className="hero-logo-prompt-mobile"><span className="hero-logo-prompt-mobile-ready">Tap to tune in</span><span className="hero-logo-prompt-mobile-playing">Tuned in</span></span></span>
  </button>;
}
