import artistRecords from "../../data/catalogue/ndcr-artists.json";
import releaseRecords from "../../data/catalogue/ndcr-releases.json";
import type { Artist, Release } from "@/content/release-schema";

export const canonicalReleases = releaseRecords as unknown as Release[];
export const canonicalArtists = artistRecords as unknown as Artist[];

export function getReleaseBySlug(slug: string) { return canonicalReleases.find((item) => item.slug === slug); }
export function getArtistBySlug(slug: string) { return canonicalArtists.find((item) => item.slug === slug); }
export function getArtistForRelease(release: Release) { return release.artistId ? canonicalArtists.find((item) => item.id === release.artistId) : undefined; }
export function getArtistsForRelease(release: Release) { return release.artistIds.map((id) => canonicalArtists.find((item) => item.id === id)).filter((item): item is Artist => Boolean(item)); }
export function getArtistLabel(artist: Artist | undefined) { return artist?.name ?? ""; }
export function getReleasesForArtist(artistId: string) { return getArchiveReleases().filter((release) => release.artistIds.includes(artistId)); }
export function getArchiveReleases() { return [...canonicalReleases].sort((a, b) => Number(a.slug) - Number(b.slug)); }

/** Browser radio queue derived from canonical releases; unresolved records are excluded. */
export function getRadioQueue() {
  const seenVideoIds = new Set<string>();
  return [...canonicalReleases]
    .filter((release) => {
      if (release.verificationStatus === "needs_review" || release.reviewFlags.length > 0) return false;
      if (!/^[A-Za-z0-9_-]{11}$/.test(release.youtubeVideoId) || seenVideoIds.has(release.youtubeVideoId)) return false;
      seenVideoIds.add(release.youtubeVideoId);
      return true;
    })
    .sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? "") || Number(b.slug) - Number(a.slug));
}

/** Dates are parsed from the official release title; platform upload dates are never considered. */
export function getLatestRelease() {
  return [...canonicalReleases].filter((release) => release.releaseDate).sort((a, b) =>
    (b.releaseDate ?? "").localeCompare(a.releaseDate ?? "") || Number(b.slug) - Number(a.slug),
  )[0];
}
export function getFeaturedRelease() { return canonicalReleases.find((release) => release.featured) ?? getLatestRelease(); }
export function getReleaseLabel(release: Release) { return release.setNumber.startsWith("CR #") ? release.setNumber : `NDCR #${release.setNumber}`; }
export function getReleaseHref(release: Release) { return `/radio/${release.slug}`; }

/** Most-viewed releases older than the three newest dated sets, based only on synced public YouTube stats. */
export function getMostViewedArchiveReleases(limit = 6) {
  const newestSlugs = new Set(
    [...canonicalReleases]
      .filter((release) => release.releaseDate)
      .sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? "") || Number(b.slug) - Number(a.slug))
      .slice(0, 3)
      .map((release) => release.slug),
  );
  return canonicalReleases
    .filter((release) => !newestSlugs.has(release.slug) && release.verificationStatus !== "needs_review")
    .filter((release) => release.youtubeViewCount != null && /^\d+$/.test(release.youtubeViewCount))
    .sort((a, b) => {
      const left = BigInt(a.youtubeViewCount ?? "0");
      const right = BigInt(b.youtubeViewCount ?? "0");
      return left === right
        ? (b.releaseDate ?? "").localeCompare(a.releaseDate ?? "") || Number(b.slug) - Number(a.slug)
        : left > right ? -1 : 1;
    })
    .slice(0, limit);
}
