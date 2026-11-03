import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { canonicalArtists, getReleaseLabel, getReleasesForArtist } from "@/content/catalogue";

export const metadata = { title: "Artists", description: "Artists and collectives connected to the NDCR set archive." };

export default function ArtistsPage() {
  return <PageShell eyebrow="Artists" title="The artists">
    <p className="page-intro">Find artists through their NDCR sessions.</p>
    <div className="artist-grid">{canonicalArtists.map((artist) => {
      const releases = getReleasesForArtist(artist.id);
      return <article className="artist-card" key={artist.id}>
      {releases.length ? <p className="eyebrow">{releases.map(getReleaseLabel).join(" · ")}</p> : null}
      <h2><Link href={`/artists/${artist.slug}`}>{artist.name}</Link></h2>
    </article>;
    })}</div>
  </PageShell>;
}
