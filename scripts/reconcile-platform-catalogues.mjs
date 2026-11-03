import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const releases = JSON.parse(await readFile(resolve(root, "data/catalogue/ndcr-releases.json"), "utf8"));
const soundcloud = JSON.parse(await readFile(resolve(root, "data/raw/soundcloud-catalogue.json"), "utf8"));
const numberPattern = /\b(?:NDCR|CR)\s*#\s*0*(\d{1,3})\b/i;
const normalized = (value) => (value ?? "").toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const scRecords = soundcloud.records ?? [];
const proposals = releases.map((release) => {
  const candidates = scRecords.filter((track) => {
    const rawTrack = track.raw ?? track;
    const values = [rawTrack.title, rawTrack.description, ...(track.release_number_candidates ?? []).map((x) => typeof x === "number" ? `NDCR #${x}` : x.observed_number_text ?? "")];
    return values.some((value) => Number(numberPattern.exec(value ?? "")?.[1]) === Number(release.slug));
  });
  const flags = [];
  if (!candidates.length) flags.push(soundcloud.metadata?.extraction_status === "complete" ? "soundcloud_counterpart_not_found" : "soundcloud_catalogue_not_available");
  if (candidates.length > 1) flags.push("multiple_soundcloud_candidates_for_number");
  const comparisons = candidates.map((track) => {
    const rawTrack = track.raw ?? track;
    const candidateTitle = normalized(rawTrack.title);
    const releaseTitle = normalized(release.artistCredit);
    const artistEvidence = releaseTitle && candidateTitle.includes(releaseTitle);
    return {
      trackId: rawTrack.id ?? rawTrack.urn ?? null,
      url: rawTrack.permalink_url ?? rawTrack.url ?? null,
      title: rawTrack.title ?? null,
      numberMatch: true,
      artistTitleEvidence: Boolean(artistEvidence),
      flags: artistEvidence ? [] : ["artist_or_title_needs_human_comparison"],
    };
  });
  return {
    releaseNumber: release.setNumber,
    slug: release.slug,
    youtubeUrl: release.youtubeUrl,
    soundcloudCandidates: comparisons,
    status: candidates.length === 1 ? "number_match_candidate_requires_review" : candidates.length ? "ambiguous_candidates" : soundcloud.metadata?.extraction_status === "complete" ? "not_found_in_complete_catalogue" : "not_assessable_without_catalogue",
    flags,
  };
});

const result = {
  metadata: { generatedAt: new Date().toISOString(), method: "number-first candidate matching; no automatic acceptance", soundcloudExtractionStatus: soundcloud.metadata?.extraction_status ?? "unknown", recordsCompared: releases.length },
  records: proposals,
};
const target = resolve(root, "data/reconciliation/youtube-soundcloud-candidates.json");
await mkdir(dirname(target), { recursive: true });
await writeFile(target, JSON.stringify(result, null, 2) + "\n", "utf8");
const assessable = proposals.filter((item) => item.status !== "not_assessable_without_catalogue").length;
const candidates = proposals.filter((item) => item.soundcloudCandidates.length).length;
console.log(JSON.stringify({ records: proposals.length, assessable, candidateMatches: candidates, output: "data/reconciliation/youtube-soundcloud-candidates.json" }, null, 2));
