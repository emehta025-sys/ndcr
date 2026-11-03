import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const raw = JSON.parse(await readFile(resolve(root, "data/raw/youtube-catalogue.json"), "utf8"));
const out = resolve(root, "data/catalogue");
let editorialFeatured = new Set();
try {
  const current = JSON.parse(await readFile(resolve(out, "ndcr-releases.json"), "utf8"));
  editorialFeatured = new Set(current.filter((release) => release.featured).map((release) => release.slug));
} catch {
  // A first catalogue build has no prior editorial selections.
}
const conflicts = new Set([22, 28, 30, 32, 34, 35, 66, 67, 70]);
const soundcloudMatches = new Map([
  [9, "https://soundcloud.com/new-delhi-community-radio/ndcr-009-aayna"],
  [18, "https://soundcloud.com/new-delhi-community-radio/hamza-audio"],
  [19, "https://soundcloud.com/new-delhi-community-radio/khxdeej-master"],
]);
const val = (value) => value == null || value === "" ? null : value;
const slugify = (value) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const numberFromTitle = (r) => {
  const p = r.parsed_release_title;
  if (p?.release_number_text) return Number(p.release_number_text);
  const m = /^CR\s*#\s*(\d{1,4})/i.exec(r.title ?? "");
  return m ? Number(m[1]) : null;
};
const titleIsRelease = (r, number) => {
  const n = numberFromTitle(r);
  const expected = number === 70 ? /^CR\s*#\s*070\b/i : new RegExp(`^NDCR\\s*#\\s*0*${number}\\b`, "i");
  return n === number && expected.test(r.title ?? "") && Boolean(r.parsed_release_title?.artist_credit);
};

const byNumber = new Map();
const formalNumbers = new Set();
for (const record of raw.records) {
  const number = numberFromTitle(record);
  if (number != null && titleIsRelease(record, number)) formalNumbers.add(number);
  for (const candidate of record.release_number_candidates ?? []) {
    if (!candidate.source_fields?.some((field) => field === "title" || field === "description")) continue;
    const list = byNumber.get(candidate.number) ?? [];
    if (!list.some((item) => item.youtube_video_id === record.youtube_video_id)) list.push(record);
    byNumber.set(candidate.number, list);
  }
  if (number === 70 && !record.release_number_candidates?.some((item) => item.number === 70)) {
    const list = byNumber.get(70) ?? [];
    list.push(record);
    byNumber.set(70, list);
  }
}
// Keep all source evidence, but select the formal release-title entry over promotional uploads.
const numbers = [...formalNumbers].sort((a, b) => a - b);
if (numbers.length !== 83) throw new Error(`Expected 83 title-identified sets, got ${numbers.length}; no catalogue written.`);

const artistMap = new Map();
const releases = [];
for (const number of numbers) {
  const candidates = byNumber.get(number) ?? [];
  const primary = candidates.find((r) => titleIsRelease(r, number));
  const slug = String(number).padStart(3, "0");
  const parsed = primary.parsed_release_title;
  const credit = parsed.artist_credit ?? "";
  // Some source descriptions were parsed as if an entire bio paragraph were
  // an artist name. Keep profile labels concise; otherwise fall back to the
  // artist credit already present in the release title.
  const describedNames = [...new Set((primary.artist_profile_links ?? [])
    .map((x) => x.artist_name)
    .filter((name) => typeof name === "string" && name.trim().length > 0 && name.trim().length <= 60))];
  let artistNames = describedNames.length ? describedNames : credit.split(/\s+B2B\s+/i).map((x) => x.replace(/\s*\([^)]*\)/g, "").trim()).filter(Boolean);
  if (!artistNames.length && credit) artistNames = [credit.replace(/\s*\([^)]*\)/g, "").trim()];
  const artistIds = [];
  for (const name of artistNames) {
    const artistSlug = slugify(name);
    if (!artistSlug) continue;
    const id = `artist-${artistSlug}`;
    artistIds.push(id);
    const artist = artistMap.get(id) ?? { id, slug: artistSlug, name, externalLinks: [], releaseSlugs: [] };
    if (!artist.releaseSlugs.includes(slug)) artist.releaseSlugs.push(slug);
    for (const link of primary.artist_profile_links ?? []) {
      if (slugify(link.artist_name ?? "") === artistSlug && !artist.externalLinks.some((old) => old.url === link.url)) {
        artist.externalLinks.push({ label: link.label, url: link.url });
      }
    }
    artistMap.set(id, artist);
  }
  const thumbs = primary.thumbnail_urls ?? {};
  const thumbnail = thumbs.maxres?.url ?? thumbs.high?.url ?? thumbs.standard?.url ?? thumbs.medium?.url ?? thumbs.default?.url ?? null;
  const soundcloudUrl = soundcloudMatches.get(number) ?? null;
  const status = conflicts.has(number) ? "needs_review" : "partially_verified";
  releases.push({
    id: `ndcr-set-${slug}`, slug,
    setNumber: number === 70 ? "CR #070" : parsed.release_number_text,
    title: primary.title,
    artistId: artistIds[0] ?? null,
    artistIds,
    artistCredit: credit,
    releaseDate: parsed.release_date,
    releaseDateText: parsed.release_date_text,
    releaseTime: null,
    releaseTimezone: null,
    genres: parsed.genres,
    description: val(primary.description),
    youtubeUrl: primary.youtube_url,
    youtubeVideoId: primary.youtube_video_id,
    youtubeThumbnail: thumbnail,
    youtubePlatformPublishedAt: primary.youtube_published_at ?? null,
    youtubeDuration: raw.raw_api.video_detail_batches.flatMap((batch) => batch.items).find((item) => item.id === primary.youtube_video_id)?.contentDetails?.duration ?? null,
    soundcloudUrl,
    artistLinks: primary.artist_profile_links ?? [],
    eventIds: [],
    collaborationIds: [],
    status: "released",
    featured: editorialFeatured.has(slug),
    verificationStatus: status,
    reviewFlags: [
      ...(conflicts.has(number) ? ["numbering_or_upload_conflict_requires_human_review"] : []),
      ...(number === 70 ? ["published_prefix_is_CR_not_NDCR"] : []),
      ...(candidates.length > 1 ? ["multiple_numbered_uploads_exist"] : []),
    ],
    youtubeCandidates: candidates.map((record) => ({ videoId: record.youtube_video_id, url: record.youtube_url, title: record.title, description: record.description, playlistPosition: record.playlist_position })),
  });
}

const artists = [...artistMap.values()].map((artist) => ({
  id: artist.id, slug: artist.slug, name: artist.name,
  description: null,
  externalLinks: artist.externalLinks,
  releaseSlugs: artist.releaseSlugs.sort((a, b) => Number(a) - Number(b)),
})).sort((a, b) => a.name.localeCompare(b.name));
await mkdir(out, { recursive: true });
await writeFile(resolve(out, "ndcr-releases.json"), JSON.stringify(releases, null, 2) + "\n", "utf8");
await writeFile(resolve(out, "ndcr-artists.json"), JSON.stringify(artists, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ releases: releases.length, withDate: releases.filter((r) => r.releaseDate).length, withYouTube: releases.filter((r) => r.youtubeUrl).length, withSoundCloud: releases.filter((r) => r.soundcloudUrl).length, needingReview: releases.filter((r) => r.verificationStatus === "needs_review").length, artists: artists.length }, null, 2));
