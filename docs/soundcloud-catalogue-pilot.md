# SoundCloud Catalogue Pilot Report

**Extraction time (UTC):** `2026-10-23T11:29:41.016929+00:00`  
**Source:** SoundCloud official API v2  
**Target profile:** [https://soundcloud.com/new-delhi-community-radio](https://soundcloud.com/new-delhi-community-radio)  
**Status:** `not_run_credentials_missing`  
**Raw catalogue:** `data/raw/soundcloud-catalogue.json`

## Extraction summary

- Tracks retrieved: **0**
- Likely numbered release candidates: **0**
- Detected title-number range: **UNKNOWN — no authenticated catalogue was retrieved**
- Tracks with duplicate candidate numbers: **0 ambiguous tracks**; numbers: None detected (or not assessable before extraction).
- Unclassified tracks: **0**
- Possible numbering gaps: None detected (or not assessable before extraction).

Derived candidates and flags are separate from each exact `raw_api` track object. No SoundCloud track is matched to a YouTube item or canonical NDCR release by this extractor.

## Access and limitations

The official API requires a registered SoundCloud application and OAuth Client Credentials for public-resource access. SoundCloud’s current registration guide requires an Artist Pro subscription to create or retrieve app credentials. The environment used for this run did not provide `SOUNDCLOUD_CLIENT_ID` or `SOUNDCLOUD_CLIENT_SECRET`.

No password, private session, hidden client ID, unofficial endpoint, or page scraping was used. No media was downloaded. Public API results will not include private/account-only tracks; those would require owner-authorized OAuth and are outside this public catalogue pilot.

## Metadata and timestamp handling

Each returned track is preserved as received under `raw_api.track_pages[].collection[]` and again as `records[].raw`. Derived fields capture title release-number candidates, description-number candidates, possible artist/genre/date information, duplicate-number flags, ambiguity, and classification. Track order reflects API pagination order at extraction time.

SoundCloud `created_at` and other platform timestamps remain source metadata only. `official_ndcr_release_datetime` is not inferred or populated from them.

## Run when authorized app credentials are available

1. Register or retrieve an application through SoundCloud’s official developer flow. The registering account must have Artist Pro. Keep the client secret private.
2. Set `SOUNDCLOUD_CLIENT_ID` and `SOUNDCLOUD_CLIENT_SECRET` in the shell environment.
3. From the project root run:

   ```powershell
   $env:SOUNDCLOUD_CLIENT_ID = '…'
   $env:SOUNDCLOUD_CLIENT_SECRET = '…'
   python scripts/soundcloud_catalogue.py --overwrite
   ```

The script resolves the supplied public profile, follows official API `next_href` links until exhausted, and writes outputs only after a complete successful extraction. `--overwrite` is required to replace existing output files. Credentials and access tokens are never stored in the catalogue or printed by the extractor.

## Official documentation reviewed

- [SoundCloud API Guide](https://developers.soundcloud.com/docs/api/guide) — Client Credentials for public resources, OAuth token endpoint, authorization header, and pagination.
- [Get a SoundCloud API key](https://developers.soundcloud.com/docs/api/register-app) — Artist Pro requirement and official app registration / credential retrieval.
- [SoundCloud API Explorer](https://developers.soundcloud.com/docs/api/explorer/) — current API resource reference.
- [Pagination updates](https://developers.soundcloud.com/blog/pagination-updates-on-our-api/) — follow `next_href` for user track collections.
