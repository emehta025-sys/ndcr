# New Delhi Community Radio (NDCR) Website

NDCR’s site is built with Next.js, TypeScript, and the App Router. The local catalogue is the single source for release, artist, archive, and homepage data. There is no CMS in this phase.

## Catalogue pipeline

```text
Official YouTube Data API export
        ↓
Derived title dates, release credits, genres, and artist links
        ↓
Canonical release records + derived artist records
        ↓
Homepage, archive, release pages, and artist pages
```

- `data/raw/youtube-catalogue.json` preserves the official API responses and separate derived fields.
- `data/catalogue/ndcr-releases.json` contains one record for each of the 83 confirmed numbered sets.
- `data/catalogue/ndcr-artists.json` is derived from release artist credits and description link blocks.
- Release dates are parsed from the NDCR YouTube title. YouTube `publishedAt` remains platform metadata and is not shown as the release date.
- Nine known numbering/upload groups retain internal review flags and all identified video candidates.
- `data/raw/soundcloud-catalogue.json` remains an empty credentials-missing official API export. Three SoundCloud URLs already documented in inventory examples are retained; no others are guessed.
- `scripts/reconcile-platform-catalogues.mjs` proposes SoundCloud counterparts by set number and never accepts a match automatically.
- YouTube/SoundCloud media remain externally hosted; the site embeds official YouTube videos and links to SoundCloud when a source-backed URL exists.

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```powershell
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Refresh / rebuild catalogue

The saved official API export can be reprocessed without a network request:

```powershell
python scripts/youtube_catalogue.py --reprocess-existing --overwrite
node scripts/build-canonical-catalogue.mjs
```

A fresh YouTube API extraction requires `YOUTUBE_API_KEY` in the environment. SoundCloud’s official extractor requires `SOUNDCLOUD_CLIENT_ID` and `SOUNDCLOUD_CLIENT_SECRET`. After a SoundCloud export is available, run:

```powershell
npm run reconcile:catalogues
```

Reconciliation output is written to `data/reconciliation/youtube-soundcloud-candidates.json`; all proposed matches require review.

## Routes

- `/` — editorial homepage
- `/radio` — searchable, filterable set archive
- `/radio/[release]` — release detail and official YouTube player
- `/artists` and `/artists/[artist]` — artist index and set relationships
- `/events` — event information and flyer
- `/about` — NDCR context from supplied research

## Structure

```text
src/app/                  App Router pages and styles
src/components/           Shared presentation and archive controls
src/content/              Canonical content types and data accessors
data/raw/                 Read-only platform exports
data/catalogue/           Canonical local records and event content
data/reconciliation/      Cross-platform match candidates
public/images/events/     Supplied event flyer crop
scripts/                  Extraction, catalogue assembly, reconciliation
docs/                     Research, source notes, and project decisions
```

Missing fields are omitted from public pages. The full catalogue remains subject to human review for the flagged numbering groups and unavailable platform counterparts.
