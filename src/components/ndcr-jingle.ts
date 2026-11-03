"use client";

let jingle: HTMLAudioElement | undefined;

export async function playNDCRJingle(onEnded?: () => void) {
  jingle ??= new Audio("/media/audio/ndcr-jingle.wav");
  jingle.pause();
  jingle.currentTime = 0;
  jingle.onended = onEnded ?? null;
  try {
    await jingle.play();
    return true;
  } catch {
    return false;
  }
}
