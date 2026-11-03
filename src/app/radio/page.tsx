import { ArchiveBrowser } from "@/components/archive-browser";
import { PageShell } from "@/components/page-shell";
import { canonicalArtists, getArchiveReleases } from "@/content/catalogue";

export const metadata = { title: "Radio / Archive", description: "Explore NDCR sets by artist, genre, or set number." };

export default function RadioPage() {
  const releases = getArchiveReleases();
  const genres = [...new Set(releases.flatMap((release) => release.genres))].sort((a, b) => a.localeCompare(b));
  return <PageShell eyebrow="Radio / Archive" title="The sets">
    <p className="page-intro">A catalogue of NDCR sessions. Search by artist, set number, or genre.</p>
    <ArchiveBrowser artists={canonicalArtists.map(({ id, name }) => ({ id, name }))} genres={genres} releases={releases.map(({ id, slug, setNumber, title, artistIds, artistCredit, releaseDate, genres: releaseGenres }) => ({ id, slug, setNumber, title, artistIds, artistCredit, releaseDate, genres: releaseGenres }))} />
  </PageShell>;
}
