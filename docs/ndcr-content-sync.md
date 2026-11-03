# NDCR YouTube Content Sync

## Purpose and source of truth

The canonical files remain `data/catalogue/ndcr-releases.json` and `data/catalogue/ndcr-artists.json`. Website sections derive from those records. YouTube is the automated discovery and platform-metadata source; it does not become authority for the official NDCR release time or for correcting an established set number.

The sync uses the official YouTube Data API v3 through the existing `scripts/youtube_catalogue.py` extractor. It reads the public uploads playlist with pagination and requests video `statistics` alongside the existing metadata. It stores YouTube's public `viewCount` as a decimal string in `youtubeViewCount`. It does not download audio, video, or image bytes.

## Local commands

Set `YOUTUBE_API_KEY` in the process environment. The key must belong to a Google Cloud project with YouTube Data API v3 enabled and sufficient quota. The key is passed only to the extractor process and is not written to files or printed.

Offline, read-only review using the existing saved export:

```powershell
node scripts/sync-youtube-catalogue.mjs --input data/raw/youtube-catalogue.json
```

Live read-only dry run (fetches YouTube; does not write catalogue files):

```powershell
npm run sync:youtube
```

Live sync and canonical update:

```powershell
npm run sync:youtube -- --apply
```

The default is dry-run. `--apply` is required to update canonical JSON. When using a saved export, `--apply --input <path>` applies that export without making an API request; use this for controlled testing only.

## Merge and safety rules

- Existing canonical releases are matched first by exact YouTube video ID, then checked against the authoritative set number.
- For an exact video-ID match, only platform-derived statistics, duration, YouTube `publishedAt`, and a missing thumbnail are eligible for automatic update. Existing non-empty editorial fields and selected artwork are preserved.
- If the current YouTube title, parsed artist/date/genres, or description differs from an existing canonical value, the run reports a discrepancy and preserves the canonical value for human review.
- `youtubeViewCount` is updated only from a returned numeric YouTube API value. A missing statistic does not become zero and does not erase the previous known count.
- New records require a single numbered-release classification, a formal `NDCR #nnn` or `CR #nnn` title parse, an artist credit, no suspicious-title flag, no duplicate source candidate for that number, and no existing canonical number or slug collision.
- The source title's explicitly formatted date may populate `releaseDate`. YouTube upload timestamps and live scheduled-start timestamps are never used as NDCR release date/time. `releaseTime` and timezone remain unknown unless separately confirmed by NDCR editorial data.
- Newly discovered records are created without SoundCloud links, event relationships, or homepage feature status unless those values are present in the approved source; absent information stays empty. Records needing editorial confirmation carry review flags and `needs_review` status.
- Existing set number, ID, slug, and canonical record count are checked before writes. No sync step renumbers or deletes a release. Numbering conflicts, suspicious records, missing artist information, and duplicate candidates are emitted in the JSON run summary and skipped for new-record creation.
- Existing canonical `featured` choices are never changed by the sync. Artist links are sourced from the matched video's description and attached only when their parsed artist label matches an artist record.
- Each applied run writes `data/raw/youtube-sync-report.json` with add/update counts, extractor gap/duplicate warnings, review anomalies, canonical counts, and how many records currently have rankable view-count data.

Radio queue, archive, release pages, and artist relationships are derived from canonical releases. Latest Set is selected from canonical `releaseDate`; featured content remains manually editorial through the existing `featured` field. External YouTube links are derived from canonical video IDs and SoundCloud links remain canonical fields. If a monthly schedule is presented later, it should be derived from the same `releaseDate`/`releaseTime` fields; the current project has no separate monthly schedule dataset, and sync will not fill an unverified time.

## Homepage archive ranking

The mobile “From the Archive” stack ranks canonical releases with a valid synced `youtubeViewCount`, excludes the three newest dated sets, and excludes `needs_review` records. It orders by view count descending, then release date and set slug for ties. No rankings are fabricated: before the first fresh API sync with statistics, the mobile section reports that ranking data is unavailable. The desktop presentation remains unchanged.

## GitHub Actions

`.github/workflows/ndcr-youtube-sync.yml` runs at:

- Thursday 19:00 IST (`30 13 * * 4` UTC), after the expected Thursday 18:00 IST publication.
- Friday 11:30 IST fallback (`0 6 * * 5` UTC), to catch a delayed publication.
- Manual `workflow_dispatch` runs are enabled.

Add a repository Actions secret named `YOUTUBE_API_KEY`. The workflow runs the live sync, then commits changes to canonical catalogue data, the raw export, and its extraction report to the selected branch. It does not configure or trigger a deployment platform. This checkout currently has no `.git` directory or existing GitHub Actions workflow, so the workflow will only run after this project is connected to a GitHub repository and the secret is configured. Repository branch protection may also need to permit the Actions bot to push, or the workflow's final step must be adapted to the repository's PR policy.

## Limits and human review

The API cannot establish the NDCR editorial release time. `publishedAt` remains a YouTube platform timestamp only. A title date is a candidate official date because it is stated in the NDCR-formatted title, but changes to existing canonical dates are never automatic. Artist identity, genre interpretation, numbered-title exceptions, duplicate numbering, SoundCloud matching, events/collaborations, and editorial featuring remain subject to human review. Statistics can change between syncs, and YouTube may not return every field for every video.

The current saved raw export predates view-count extraction and the local environment has no `YOUTUBE_API_KEY`, `.git` directory, or existing GitHub Actions workflow, so it cannot establish today's view rankings or detect uploads published after its extraction. A live API run is required to populate the ranking from real counts.
