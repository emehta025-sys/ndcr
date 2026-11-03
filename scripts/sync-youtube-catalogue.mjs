#!/usr/bin/env node
/** Conservative, idempotent merge from the official YouTube API export into canonical NDCR data. */
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rename, rm, writeFile, copyFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const apply = args.includes("--apply");
function argValue(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? resolve(args[index + 1]) : fallback;
}
const suppliedInput = argValue("--input", null);
const releasesPath = argValue("--releases", resolve(root, "data/catalogue/ndcr-releases.json"));
const artistsPath = argValue("--artists", resolve(root, "data/catalogue/ndcr-artists.json"));
const rawOutput = resolve(root, "data/raw/youtube-catalogue.json");
const syncReport = argValue("--report", resolve(root, "data/raw/youtube-sync-report.json"));
const pilotReport = resolve(root, "docs/youtube-catalogue-pilot.md");
const OFFICIAL_CHANNEL_ID = "UCu_UsD1my3yWkvOJi8MR7HA";

function pad(number) { return String(number).padStart(3, "0"); }
function numberFromSetNumber(value) {
  const match = /(?:NDCR\s*#\s*|CR\s*#\s*)?(\d{1,3})/i.exec(String(value ?? ""));
  return match ? Number(match[1]) : null;
}
function sourceVideoDetails(catalogue) {
  const details = new Map();
  for (const batch of catalogue.raw_api?.video_detail_batches ?? []) {
    for (const video of batch.items ?? []) details.set(video.id, video);
  }
  return details;
}
function thumbnail(record) {
  const thumbs = record.thumbnail_urls ?? {};
  return thumbs.maxres?.url ?? thumbs.high?.url ?? thumbs.standard?.url ?? thumbs.medium?.url ?? thumbs.default?.url ?? null;
}
function candidateNumber(record) {
  const parsed = record.parsed_release_title;
  const num = Number(parsed?.release_number_text);
  return Number.isInteger(num) && num > 0 ? num : null;
}
function sourceConflicts(record) {
  return record.classification !== "numbered_release"
    || !candidateNumber(record)
    || !record.parsed_release_title?.artist_credit
    || (record.release_number_candidates ?? []).length !== 1
    || (record.suspicious_title_reasons ?? []).length > 0;
}
function normalizeSlug(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function splitArtistCredit(credit, links) {
  const linked = [...new Set((links ?? []).map((link) => link.artist_name).filter((name) => typeof name === "string" && name.trim().length > 0 && name.trim().length <= 60))];
  if (linked.length) return linked;
  return credit.split(/\s+B2B\s+/i).map((name) => name.replace(/\s*\([^)]*\)/g, "").trim()).filter(Boolean);
}
async function replaceJson(path, value) {
  const temporary = `${path}.sync-tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, path);
}

async function getCatalogue() {
  if (suppliedInput) return JSON.parse(await readFile(suppliedInput, "utf8"));
  if (!process.env.YOUTUBE_API_KEY?.trim()) throw new Error("YOUTUBE_API_KEY is required for a live sync. Use --input <saved-export> for an offline dry run.");
  const tempDir = await mkdtemp(resolve(tmpdir(), "ndcr-youtube-sync-"));
  const output = resolve(tempDir, "youtube-catalogue.json");
  const report = resolve(tempDir, "youtube-catalogue-pilot.md");
  const python = process.platform === "win32" ? "python" : "python3";
  const result = spawnSync(python, [resolve(root, "scripts/youtube_catalogue.py"), "--output", output, "--report", report, "--overwrite"], {
    cwd: root,
    env: process.env,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.error || result.status !== 0) {
    await rm(tempDir, { recursive: true, force: true });
    throw new Error(result.stderr?.trim() || result.error?.message || `YouTube extraction failed (exit ${result.status}).`);
  }
  return { catalogue: JSON.parse(await readFile(output, "utf8")), tempDir, output, report };
}

const fetched = await getCatalogue();
const catalogue = fetched.catalogue ?? fetched;
if (!Array.isArray(catalogue.records) || !catalogue.metadata?.uploads_playlist_pagination_complete) {
  throw new Error("Input is not a complete official YouTube uploads export; no canonical changes were planned.");
}
if (catalogue.metadata.channel_id !== OFFICIAL_CHANNEL_ID) {
  throw new Error("Input channel ID does not match the verified NDCR YouTube channel; no canonical changes were planned.");
}

const releases = JSON.parse(await readFile(releasesPath, "utf8"));
const artists = JSON.parse(await readFile(artistsPath, "utf8"));
const beforeNumbering = releases.map((release) => `${release.id}|${release.slug}|${release.setNumber}`);
const knownVideo = new Map(releases.map((release) => [release.youtubeVideoId, release]));
const knownNumber = new Map();
for (const release of releases) {
  const n = numberFromSetNumber(release.setNumber);
  if (n != null) knownNumber.set(n, release);
}
const sourceNumbers = new Map();
for (const record of catalogue.records) {
  const number = candidateNumber(record);
  if (number == null || record.classification !== "numbered_release") continue;
  sourceNumbers.set(number, (sourceNumbers.get(number) ?? 0) + 1);
}

const details = sourceVideoDetails(catalogue);
const changes = [];
const anomalies = [];
let added = 0;
let updated = 0;
let skipped = 0;

for (const record of catalogue.records) {
  const number = candidateNumber(record);
  const currentByVideo = record.youtube_video_id ? knownVideo.get(record.youtube_video_id) : undefined;
  if (currentByVideo) {
    const before = JSON.stringify(currentByVideo);
    const video = details.get(record.youtube_video_id);
    const stats = video?.statistics?.viewCount ?? record.youtube_view_count;
    const parsed = record.parsed_release_title;
    const metadataConflicts = [
      ...(record.title && currentByVideo.title !== record.title ? ["title"] : []),
      ...(parsed?.artist_credit && currentByVideo.artistCredit !== parsed.artist_credit ? ["artist"] : []),
      ...(parsed?.release_date && currentByVideo.releaseDate && currentByVideo.releaseDate !== parsed.release_date ? ["releaseDate"] : []),
      ...(Array.isArray(parsed?.genres) && JSON.stringify(currentByVideo.genres) !== JSON.stringify(parsed.genres) ? ["genres"] : []),
      ...(record.description && currentByVideo.description !== record.description ? ["description"] : []),
    ];
    if (metadataConflicts.length) anomalies.push({ type: "canonical_metadata_differs_from_youtube", videoId: record.youtube_video_id, setNumber: currentByVideo.setNumber, fields: metadataConflicts, action: "preserved canonical editorial values; human review required" });
    if (typeof stats === "string" && /^\d+$/.test(stats)) currentByVideo.youtubeViewCount = stats;
    const thumb = thumbnail(record);
    if (!currentByVideo.youtubeThumbnail && thumb) currentByVideo.youtubeThumbnail = thumb;
    const duration = video?.contentDetails?.duration;
    if (typeof duration === "string") currentByVideo.youtubeDuration = duration;
    const publishedAt = record.youtube_published_at;
    if (typeof publishedAt === "string") currentByVideo.youtubePlatformPublishedAt = publishedAt;
    if (before !== JSON.stringify(currentByVideo)) {
      updated += 1;
      changes.push({ action: "update_platform_metadata", setNumber: currentByVideo.setNumber, youtubeVideoId: record.youtube_video_id, fields: [
        ...(stats ? ["youtubeViewCount"] : []), ...(thumb ? ["youtubeThumbnail"] : []), ...(duration ? ["youtubeDuration"] : []), ...(publishedAt ? ["youtubePlatformPublishedAt"] : []),
      ] });
    }
    if (number != null && numberFromSetNumber(currentByVideo.setNumber) !== number) {
      anomalies.push({ type: "matched_video_number_conflict", videoId: record.youtube_video_id, canonicalSetNumber: currentByVideo.setNumber, observedNumber: number, action: "preserved canonical numbering; no title/artist/date fields changed" });
    }
    continue;
  }

  if (number == null) {
    if (record.classification !== "unclassified_upload") anomalies.push({ type: "unresolved_number_candidate", videoId: record.youtube_video_id ?? null, title: record.title ?? null, action: "not added" });
    skipped += 1;
    continue;
  }
  if (knownNumber.has(number)) {
    anomalies.push({ type: "canonical_number_has_different_video", number, canonicalVideoId: knownNumber.get(number).youtubeVideoId, candidateVideoId: record.youtube_video_id, title: record.title, action: "canonical record preserved; not added or relinked" });
    skipped += 1;
    continue;
  }
  if (sourceConflicts(record) || sourceNumbers.get(number) !== 1) {
    anomalies.push({ type: "ambiguous_new_number", number, videoId: record.youtube_video_id ?? null, title: record.title ?? null, sourceCandidates: sourceNumbers.get(number) ?? 0, action: "not added; human review required" });
    skipped += 1;
    continue;
  }
  if (!/^[A-Za-z0-9_-]{11}$/.test(record.youtube_video_id ?? "") || record.youtube_url !== `https://www.youtube.com/watch?v=${record.youtube_video_id}`) {
    anomalies.push({ type: "invalid_youtube_identity", number, videoId: record.youtube_video_id ?? null, action: "not added; valid official video identity required" });
    skipped += 1;
    continue;
  }

  const parsed = record.parsed_release_title;
  const slug = pad(number);
  if (releases.some((release) => release.slug === slug || release.id === `ndcr-set-${slug}`)) {
    anomalies.push({ type: "canonical_slug_collision", number, videoId: record.youtube_video_id, action: "not added; human review required" });
    skipped += 1;
    continue;
  }
  const video = details.get(record.youtube_video_id);
  const credit = parsed.artist_credit;
  const artistNames = splitArtistCredit(credit, record.artist_profile_links);
  const artistIds = [];
  for (const name of artistNames) {
    const artistSlug = normalizeSlug(name);
    if (!artistSlug) continue;
    const id = `artist-${artistSlug}`;
    artistIds.push(id);
    let artist = artists.find((item) => item.id === id);
    if (!artist) {
      artist = { id, slug: artistSlug, name, description: null, externalLinks: [], releaseSlugs: [] };
      artists.push(artist);
    }
    if (!artist.releaseSlugs.includes(slug)) artist.releaseSlugs.push(slug);
    for (const link of record.artist_profile_links ?? []) {
      if (normalizeSlug(link.artist_name ?? "") === artistSlug && !artist.externalLinks.some((existing) => existing.url === link.url)) {
        artist.externalLinks.push({ label: link.label, url: link.url });
      }
    }
  }
  const titleDate = parsed.release_date ?? null;
  const reviewFlags = [
    ...(titleDate ? [] : ["official_release_date_not_explicit_in_title"]),
    ...(artistIds.length ? [] : ["artist_identity_requires_review"]),
  ];
  const newRelease = {
    id: `ndcr-set-${slug}`,
    slug,
    setNumber: number === 70 && parsed.title_prefix?.toUpperCase() === "CR" ? `CR #${parsed.release_number_text}` : parsed.release_number_text,
    title: record.title,
    artistId: artistIds[0] ?? null,
    artistIds,
    artistCredit: credit,
    releaseDate: titleDate,
    releaseDateText: parsed.release_date_text ?? null,
    releaseTime: null,
    releaseTimezone: null,
    genres: parsed.genres ?? [],
    description: record.description || null,
    youtubeUrl: record.youtube_url,
    youtubeVideoId: record.youtube_video_id,
    youtubeThumbnail: thumbnail(record),
    youtubePlatformPublishedAt: record.youtube_published_at ?? null,
    youtubeViewCount: video?.statistics?.viewCount ?? record.youtube_view_count ?? null,
    youtubeDuration: video?.contentDetails?.duration ?? null,
    soundcloudUrl: null,
    artistLinks: record.artist_profile_links ?? [],
    eventIds: [],
    collaborationIds: [],
    status: "released",
    featured: false,
    verificationStatus: reviewFlags.length ? "needs_review" : "partially_verified",
    reviewFlags,
    youtubeCandidates: [{ videoId: record.youtube_video_id, url: record.youtube_url, title: record.title, description: record.description ?? "", playlistPosition: record.playlist_position }],
  };
  releases.push(newRelease);
  knownVideo.set(newRelease.youtubeVideoId, newRelease);
  knownNumber.set(number, newRelease);
  added += 1;
  changes.push({ action: "add_numbered_release", setNumber: newRelease.setNumber, youtubeVideoId: newRelease.youtubeVideoId, reviewFlags });
}

for (const release of releases) release.artistIds = [...new Set(release.artistIds ?? [])];
for (const artist of artists) artist.releaseSlugs = [...new Set(artist.releaseSlugs ?? [])].sort((a, b) => Number(a) - Number(b));
artists.sort((a, b) => a.name.localeCompare(b.name));
const afterNumbering = releases.map((release) => `${release.id}|${release.slug}|${release.setNumber}`);
if (beforeNumbering.some((entry, index) => afterNumbering[index] !== entry) || releases.length < beforeNumbering.length) {
  throw new Error("Safety check failed: an existing canonical release identity or numbering changed.");
}

const report = {
  generatedAt: new Date().toISOString(),
  source: "YouTube Data API v3 public uploads catalogue",
  sourceExtractedAt: catalogue.metadata.extracted_at_utc,
  dryRun: !apply,
  canonicalBefore: beforeNumbering.length,
  canonicalAfter: releases.length,
  existingNumberingPreserved: true,
  additions: added,
  platformMetadataUpdates: updated,
  skippedCandidates: skipped,
  extractorDuplicateNumbers: catalogue.analysis?.duplicate_release_numbers ?? [],
  extractorNumberingGaps: catalogue.analysis?.suspicious_gaps_between_detected_min_max ?? [],
  archiveRankableRecordCount: (() => {
    const newest = new Set([...releases].filter((release) => release.releaseDate).sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? "") || Number(b.slug) - Number(a.slug)).slice(0, 3).map((release) => release.slug));
    return releases.filter((release) => !newest.has(release.slug) && release.verificationStatus !== "needs_review" && release.youtubeViewCount != null && /^\d+$/.test(release.youtubeViewCount)).length;
  })(),
  changes,
  anomalies,
};
if (apply) {
  report.dryRun = false;
  await replaceJson(releasesPath, releases);
  await replaceJson(artistsPath, artists);
  await replaceJson(syncReport, report);
  if (fetched.tempDir) {
    await copyFile(fetched.output, rawOutput);
    await copyFile(fetched.report, pilotReport);
    await rm(fetched.tempDir, { recursive: true, force: true });
  }
}
console.log(JSON.stringify(report, null, 2));
