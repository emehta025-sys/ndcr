import Link from "next/link";
import type { Release } from "@/content/release-schema";
import { getArtistsForRelease, getReleaseHref, getReleaseLabel } from "@/content/catalogue";

export function ReleaseCard({ release }: { release: Release }) {
  const artists = getArtistsForRelease(release);
  return (
    <article className="release-card">
      <p className="release-number">{getReleaseLabel(release)}</p>
      <h2><Link href={getReleaseHref(release)}>{artists.map((artist) => artist.name).join(" B2B ") || release.artistCredit}</Link></h2>
      {release.genres.length ? <p className="release-genres">{release.genres.join(" / ")}</p> : null}
      {release.releaseDate ? <time className="release-date" dateTime={release.releaseDate}>{new Date(`${release.releaseDate}T12:00:00`).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</time> : null}
    </article>
  );
}
