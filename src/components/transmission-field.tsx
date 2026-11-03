"use client";

import { useEffect, useRef } from "react";

export function TransmissionField() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    if (!field || reduceMotion.matches || coarsePointer.matches) return;

    let frame = 0;
    let nextX = 0;
    let nextY = 0;
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      nextX = (event.clientX / window.innerWidth - 0.5) * 2;
      nextY = (event.clientY / window.innerHeight - 0.5) * 2;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        field.style.setProperty("--pointer-x", String(nextX));
        field.style.setProperty("--pointer-y", String(nextY));
        frame = 0;
      });
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="transmission-field" ref={fieldRef} aria-hidden="true">
    <div className="transmission-orbit transmission-orbit-one" />
    <div className="transmission-orbit transmission-orbit-two" />
    <div className="transmission-orbit transmission-orbit-three" />
    <div className="transmission-crosshair" />
  </div>;
}
