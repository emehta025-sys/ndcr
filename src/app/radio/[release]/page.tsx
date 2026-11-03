import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { getArtistLabel, getArtistsForRelease, getReleaseBySlug, getReleaseLabel } from "@/content/catalogue";

type PageProps = { params: Promise<{ release: string }> };

export function generateStaticParams() { return Array.from({ length: 83 }, (_, index) => ({ release: String(index + 1).padStart(3, "0") })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { release: slug } = await params;
  const release = getReleaseBySlug(slug);
  return { title: release ? `${getReleaseLabel(release)} — ${release.artistCredit}` : "Release not found" };
}

export default async function ReleasePage({ params }: PageProps) {
  const { release: slug } = await params;
  const release = getReleaseBySlug(slug);
  if (!release) notFound();
  const artists = getArtistsForRelease(release);
  const artistText = artists.map((artist) => getArtistLabel(artist)).join(" B2B ") || release.artistCredit;
  return <PageShell eyebrow={getReleaseLabel(release)} title={artistText}>
    <p className="release-genres detail-genres">{release.genres.join(" / ")}</p>
    {release.releaseDate ? <p className="detail-date"><time dateTime={release.releaseDate}>{new Date(`${release.releaseDate}T12:00:00`).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</time></p> : null}
    {release.youtubeThumbnail ? <a className="video-frame video-frame-link" href={release.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${getReleaseLabel(release)} — ${artistText} on YouTube`}><Image src={release.youtubeThumbnail} alt={`YouTube thumbnail for ${getReleaseLabel(release)} — ${artistText}`} fill sizes="(max-width: 700px) 100vw, 70vw" unoptimized /></a> : null}
    <div className="media-actions">
      {!release.youtubeThumbnail ? <a className="button-link" href={release.youtubeUrl} target="_blank" rel="noopener noreferrer">Watch on YouTube <span aria-hidden="true">↗</span></a> : null}
      {release.soundcloudUrl ? <a className="button-link button-link-secondary" href={release.soundcloudUrl} target="_blank" rel="noreferrer">Listen on SoundCloud <span aria-hidden="true">↗</span></a> : null}
    </div>
    {release.description ? <section className="release-description"><h2>About this set</h2><p>{release.description}</p></section> : null}
    {artists.length ? <section className="release-artists"><h2>Artist links</h2>{artists.map((artist) => {
      const links = artist.externalLinks;
      return <div className="artist-link-row" key={artist.id}><Link href={`/artists/${artist.slug}`}>{artist.name}</Link>{links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a>)}</div>;
    })}</section> : null}
    <Link className="back-link" href="/radio">← Back to the archive</Link>
  </PageShell>;
}
