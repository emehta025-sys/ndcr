"use client";

import { useEffect } from "react";
import Lenis from "lenis";

type LenisDebugStatus = "loading" | "running" | "reduced-motion" | "stopped";

type LenisDebug = {
  status: LenisDebugStatus;
  scrollEvents: number;
  scrollTriggerUpdates: number;
  snapshot: () => Record<string, unknown>;
};

declare global {
  interface Window {
    __NDCR_LENIS?: Lenis;
    __NDCR_LENIS_DEBUG?: LenisDebug;
  }
}

export function ScrollMotionProvider() {
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = true;
    let lenis: Lenis | undefined;
    let scrollTriggerUpdate: (() => void) | undefined;
    const debug: LenisDebug = {
      status: "loading",
      scrollEvents: 0,
      scrollTriggerUpdates: 0,
      snapshot: () => ({ status: debug.status, instanceAvailable: Boolean(lenis) }),
    };

    if (process.env.NODE_ENV === "development") {
      window.__NDCR_LENIS_DEBUG = debug;
    }

    const stop = () => {
      const previousLenis = lenis;
      if (lenis && scrollTriggerUpdate) lenis.off("scroll", scrollTriggerUpdate);
      scrollTriggerUpdate = undefined;
      lenis?.destroy();
      lenis = undefined;
      if (process.env.NODE_ENV === "development" && window.__NDCR_LENIS === previousLenis) {
        delete window.__NDCR_LENIS;
      }
    };

    const start = async () => {
      stop();
      if (motionPreference.matches) {
        debug.status = "reduced-motion";
        return;
      }

      debug.status = "loading";
      const [{ ScrollTrigger }, { gsap }] = await Promise.all([
        import("gsap/ScrollTrigger"),
        import("gsap"),
      ]);
      if (!active || motionPreference.matches || lenis) return;

      gsap.registerPlugin(ScrollTrigger);
      lenis = new Lenis({
        autoRaf: true,
        anchors: true,
        lerp: 0.12,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1,
        wheelMultiplier: 1,
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
      });
      debug.status = "running";
      if (process.env.NODE_ENV === "development") window.__NDCR_LENIS = lenis;
      debug.snapshot = () => ({
        status: debug.status,
        options: lenis?.options,
        actualScroll: lenis?.actualScroll,
        animatedScroll: lenis?.animatedScroll,
        targetScroll: lenis?.targetScroll,
        velocity: lenis?.velocity,
        isScrolling: lenis?.isScrolling,
        isStopped: lenis?.isStopped,
        rafTime: lenis?.time,
        scrollEvents: debug.scrollEvents,
        scrollTriggerUpdates: debug.scrollTriggerUpdates,
      });
      scrollTriggerUpdate = () => {
        debug.scrollEvents += 1;
        ScrollTrigger.update();
        debug.scrollTriggerUpdates += 1;
      };
      lenis.on("scroll", scrollTriggerUpdate);
    };

    const onMotionPreferenceChange = () => {
      if (motionPreference.matches) {
        stop();
        debug.status = "reduced-motion";
      }
      else void start();
    };

    void start();
    motionPreference.addEventListener("change", onMotionPreferenceChange);
    return () => {
      active = false;
      motionPreference.removeEventListener("change", onMotionPreferenceChange);
      stop();
      debug.status = "stopped";
      if (process.env.NODE_ENV === "development") {
        if (window.__NDCR_LENIS_DEBUG === debug) delete window.__NDCR_LENIS_DEBUG;
        if (window.__NDCR_LENIS) delete window.__NDCR_LENIS;
      }
    };
  }, []);

  return null;
}
