"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { RadioQueueItem } from "@/content/release-schema";

type PlayerState = -1 | 0 | 1 | 2 | 3 | 5;
type Player = {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(videoId: string): void;
  getCurrentTime(): number;
  getDuration(): number;
};
type PlayerApi = {
  Player: new (element: HTMLElement, options: {
    width: string;
    height: string;
    videoId: string;
    playerVars: Record<string, number | string>;
    events: {
      onReady: (event: { target: Player }) => void;
      onStateChange: (event: { target: Player; data: PlayerState }) => void;
      onError: () => void;
      onAutoplayBlocked: () => void;
    };
  }) => Player;
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number; CUED: number };
};
declare global {
  interface Window {
    YT?: PlayerApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<PlayerApi> | undefined;
function loadPlayerApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  apiPromise ??= new Promise((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      if (window.YT) resolve(window.YT);
      else reject(new Error("YouTube player API did not initialize."));
    };
    let script = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("error", () => reject(new Error("YouTube player API could not load.")), { once: true });
  });
  return apiPromise;
}

const stateLabel: Record<PlayerState, string> = {
  [-1]: "Ready",
  0: "Set ended",
  1: "Playing",
  2: "Paused",
  3: "Buffering",
  5: "Ready",
};

export function NDCRRadio({ queue }: { queue: RadioQueueItem[] }) {
  const id = useId().replaceAll(":", "");
  const [index, setIndex] = useState(0);
  const [starting, setStarting] = useState(false);
  const indexRef = useRef(0);
  const playerRef = useRef<Player | null>(null);
  const currentVideoIdRef = useRef(queue[0]?.youtubeVideoId ?? "");
  const failedVideoIdsRef = useRef(new Set<string>());
  const [state, setState] = useState<PlayerState>(-1);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const current = queue[index];
  const playerElementId = `ndcr-radio-player-${id}`;

  useEffect(() => {
    if (state !== 1) return;
    const timer = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      const duration = player.getDuration();
      if (duration > 0) setProgress(Math.min(100, (player.getCurrentTime() / duration) * 100));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [state]);

  function nextAvailableIndex(fromIndex: number) {
    for (let offset = 1; offset <= queue.length; offset += 1) {
      const candidate = (fromIndex + offset) % queue.length;
      if (!failedVideoIdsRef.current.has(queue[candidate].youtubeVideoId)) return candidate;
    }
    return -1;
  }

  function moveToNext(player: Player, fromIndex: number, message = "") {
    const nextIndex = nextAvailableIndex(fromIndex);
    if (nextIndex < 0) {
      setError("No available sets could be played in this session. You can open a set directly on YouTube.");
      setState(-1);
      return;
    }
    indexRef.current = nextIndex;
    currentVideoIdRef.current = queue[nextIndex].youtubeVideoId;
    setIndex(nextIndex);
    setProgress(0);
    if (message) setError(message);
    player.loadVideoById(queue[nextIndex].youtubeVideoId);
  }

  async function startTransmission(requested = current) {
    if (!requested || starting) return;
    if (playerRef.current) {
      playerRef.current.playVideo();
      return;
    }
    setStarting(true);
    setError("");
    try {
      const YT = await loadPlayerApi();
      const playerElement = document.getElementById(playerElementId);
      if (!playerElement || !YT?.Player) return;
      const player = new YT.Player(playerElement, {
        width: "100%",
        height: "100%",
        videoId: requested.youtubeVideoId,
        playerVars: { autoplay: 0, controls: 1, playsinline: 1, rel: 0, origin: window.location.origin },
        events: {
          onReady: (event) => { setStarting(false); event.target.playVideo(); },
          onStateChange: (event) => {
            setState(event.data as PlayerState);
            if (event.data === YT.PlayerState.PLAYING) setError("");
            if (event.data === YT.PlayerState.ENDED) {
              moveToNext(event.target, indexRef.current);
            }
          },
          onError: () => {
            failedVideoIdsRef.current.add(currentVideoIdRef.current);
            setState(3);
            moveToNext(playerRef.current ?? player, indexRef.current, "A set was unavailable here; moving to the next set.");
          },
          onAutoplayBlocked: () => { setError("Playback was blocked. Select Start Transmission to begin."); setState(-1); },
        },
      });
      playerRef.current = player;
    } catch {
      setError("The YouTube player could not load. Check your connection and try again.");
      setStarting(false);
    }
  }

  function resumeOrStart() {
    if (playerRef.current) playerRef.current.playVideo();
    else void startTransmission();
  }

  function playNext() {
    moveBy(1);
  }

  function playPrevious() {
    moveBy(-1);
  }

  function moveBy(direction: 1 | -1) {
    if (!queue.length) return;
    const from = indexRef.current;
    let nextIndex = -1;
    for (let offset = 1; offset <= queue.length; offset += 1) {
      const candidate = (from + direction * offset + queue.length * 2) % queue.length;
      if (!failedVideoIdsRef.current.has(queue[candidate].youtubeVideoId)) { nextIndex = candidate; break; }
    }
    if (nextIndex < 0) {
      setError("No available sets could be played in this session. You can open a set directly on YouTube.");
      return;
    }
    const player = playerRef.current;
    if (player) {
      indexRef.current = nextIndex;
      currentVideoIdRef.current = queue[nextIndex].youtubeVideoId;
      setIndex(nextIndex);
      setProgress(0);
      player.loadVideoById(queue[nextIndex].youtubeVideoId);
      player.playVideo();
    } else {
      void startTransmission(queue[nextIndex]);
      indexRef.current = nextIndex;
      currentVideoIdRef.current = queue[nextIndex].youtubeVideoId;
      setIndex(nextIndex);
      setProgress(0);
    }
  }

  function togglePlayback() {
    if (state === 1 || state === 3) playerRef.current?.pauseVideo();
    else resumeOrStart();
  }

  if (!current) return null;
  return (
    <section className="ndcr-radio" aria-label="NDCR Radio">
      <div className="radio-cabinet">
        <div className="radio-topline">
          <p className="radio-overline"><span className={state === 1 ? "radio-live-dot is-live" : "radio-live-dot"} />NDCR / RADIO</p>
          <span className="radio-state-label">{state === 1 ? "ON AIR" : error ? "CHECK SIGNAL" : "STANDBY"}</span>
        </div>
        <div className="radio-display" aria-live="polite">
          <p className="radio-current-number">{current.setNumber.startsWith("CR #") ? current.setNumber : `NDCR #${current.setNumber}`}</p>
          <h3>{current.artistCredit}</h3>
          <p className="radio-current-title">{current.title}{current.genres.length ? ` / ${current.genres.join(" · ")}` : ""}</p>
        </div>
        <div className="radio-tuning" role="progressbar" aria-label="Current set progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <div className="radio-tuning-track"><span className="radio-tuning-progress" style={{ width: `${progress}%` }} /><i className="radio-tuning-needle" style={{ left: `${progress}%` }} /></div>
          <div className="radio-tuning-labels"><span>PREVIOUS SET</span><span>{index + 1} / {queue.length}</span><span>NEXT SET</span></div>
        </div>
        <p className="radio-state" aria-live="polite">{error || (state === 1 ? "Receiving from YouTube" : state === 2 ? "Paused" : "Press play to tune in")}</p>
        <div className="radio-bottom-row">
          <div className="radio-actions">
            <button className="radio-control" type="button" onClick={playPrevious} aria-label="Previous set"><span aria-hidden="true">◀|</span><small>Previous</small></button>
            <button className="radio-control radio-control-play" type="button" onClick={togglePlayback} disabled={starting} aria-label={state === 1 || state === 3 ? "Pause NDCR Radio" : "Play NDCR Radio"}><span aria-hidden="true">{starting ? "…" : state === 1 || state === 3 ? "Ⅱ" : "▶"}</span><small>{starting ? "Tuning" : state === 1 || state === 3 ? "Pause" : "Play"}</small></button>
            <button className="radio-control" type="button" onClick={playNext} aria-label="Next set"><span aria-hidden="true">|▶</span><small>Next</small></button>
          </div>
          <div className="radio-speaker" aria-hidden="true" />
        </div>
        <Link className="radio-release-link" href={`/radio/${current.slug}`}>Open this set <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="radio-player-frame">
        <div id={playerElementId} className="radio-player" aria-label="YouTube audio and video player" />
      </div>
    </section>
  );
}
