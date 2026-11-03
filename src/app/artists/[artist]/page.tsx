import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ReleaseCard } from "@/components/release-card";
import { canonicalArtists, getArtistBySlug, getReleasesForArtist } from "@/content/catalogue";

type PageProps = { params: Promise<{ artist: string }> };
export function generateStaticParams() { return canonicalArtists.map((artist) => ({ artist: artist.slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> { const { artist: slug } = await params; const artist = getArtistBySlug(slug); return { title: artist?.name ?? "Artist not found" }; }

export default async function ArtistPage({ params }: PageProps) {
  const { artist: slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) notFound();
  const releases = getReleasesForArtist(artist.id);
  return <PageShell eyebrow="Artists / Archive" title={artist.name}>
    {artist.externalLinks.length ? <nav className="artist-external-links" aria-label={`${artist.name} links`}>{artist.externalLinks.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a>)}</nav> : null}
    <h2 className="section-heading">NDCR sets</h2>
    {releases.length ? <div className="release-grid">{releases.map((release) => <ReleaseCard key={release.id} release={release} />)}</div> : <p>No sets are currently linked to this artist.</p>}
    <Link className="back-link" href="/artists">← Back to Artists</Link>
  </PageShell>;
}
