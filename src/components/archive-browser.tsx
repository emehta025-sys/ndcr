"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ArchiveItem = Pick<import("@/content/release-schema").Release, "id" | "slug" | "setNumber" | "title" | "artistIds" | "artistCredit" | "releaseDate" | "genres">;

export function ArchiveBrowser({ releases, artists, genres }: { releases: ArchiveItem[]; artists: { id: string; name: string }[]; genres: string[] }) {
  const [query, setQuery] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [order, setOrder] = useState("newest");
  const filtered = useMemo(() => releases.filter((release) => {
    const artistNames = release.artistIds.map((id) => artists.find((item) => item.id === id)?.name ?? "").join(" ");
    const searchText = `${release.setNumber} ${release.title} ${release.artistCredit} ${artistNames} ${release.genres.join(" ")}`.toLowerCase();
    return (!query || searchText.includes(query.toLowerCase()))
      && (!artist || release.artistIds.includes(artist))
      && (!genre || release.genres.includes(genre));
  }).sort((a, b) => {
    if (a.releaseDate && b.releaseDate && a.releaseDate !== b.releaseDate) return order === "newest" ? b.releaseDate.localeCompare(a.releaseDate) : a.releaseDate.localeCompare(b.releaseDate);
    if (a.releaseDate && !b.releaseDate) return -1;
    if (!a.releaseDate && b.releaseDate) return 1;
    return order === "newest" ? Number(b.slug) - Number(a.slug) : Number(a.slug) - Number(b.slug);
  }), [releases, artists, query, artist, genre, order]);

  return <>
    <div className="archive-filters" aria-label="Filter releases">
      <label>Search releases<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Artist, set number, genre" /></label>
      <label>Artist<select value={artist} onChange={(event) => setArtist(event.target.value)}><option value="">All artists</option>{artists.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label>Genre<select value={genre} onChange={(event) => setGenre(event.target.value)}><option value="">All genres</option>{genres.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label>Order<select value={order} onChange={(event) => setOrder(event.target.value)}><option value="newest">Newest release date</option><option value="oldest">Oldest release date</option></select></label>
    </div>
    <p className="archive-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "set" : "sets"}</p>
    {filtered.length ? <div className="release-grid">{filtered.map((release) => {
      const names = release.artistIds.map((id) => artists.find((item) => item.id === id)?.name).filter(Boolean);
      return <article className="release-card" key={release.id}>
        <p className="release-number">{release.setNumber.startsWith("CR #") ? release.setNumber : `NDCR #${release.setNumber}`}</p>
        <h2><Link href={`/radio/${release.slug}`}>{names.join(" B2B ") || release.artistCredit}</Link></h2>
        {release.genres.length ? <p className="release-genres">{release.genres.join(" / ")}</p> : null}
        {release.releaseDate ? <time className="release-date" dateTime={release.releaseDate}>{new Date(`${release.releaseDate}T12:00:00`).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</time> : null}
      </article>;
    })}</div> : <p>No sets match these filters.</p>}
  </>;
}
