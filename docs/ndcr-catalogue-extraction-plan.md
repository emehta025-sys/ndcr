# NDCR Catalogue Extraction Plan

**Status:** Research and workflow recommendation; no extractor or catalogue dataset created  
**Prepared:** 22 October 2026  
**Goal:** Reconstruct the 83 released NDCR sets from official platform metadata with minimal hand entry, preserve the source records, and produce a reviewable cross-platform catalogue without downloading or re-hosting DJ media.

## Executive recommendation

Use a small, read-only extraction workflow with two source exports and one reconciliation review:

1. **YouTube:** use the official YouTube Data API to resolve the NDCR handle to a channel, enumerate its system-generated uploads playlist page by page, then fetch video resources in batches. This is the most reliable and lowest-friction primary catalogue source. Public channel metadata can be read with an API key; channel-owner OAuth is not necessary for public videos.
2. **SoundCloud:** use SoundCloud’s current official API and paginate the NDCR user’s track list, if an NDCR-authorized app credential can be obtained. Current developer documentation says registering API credentials requires an **Artist Pro** subscription. Public-only API calls use OAuth Client Credentials, while private/account-scoped access requires owner authorization. The exact endpoint access should be confirmed with one read-only pilot request before the full extract.
3. **Reconcile:** keep each platform’s raw export unchanged. Match by explicit NDCR set number first, then produce a discrepancy queue for human review. Never silently choose between conflicting platform values or infer missing records.
4. **Canonical release timing:** enter the official NDCR post/premiere date and time from an NDCR schedule or editorial source. Neither YouTube `publishedAt` nor SoundCloud `created_at` is the canonical NDCR release time.

No API secret or account credential is needed to decide the approach. Do not create credentials until NDCR decides whether it already has access to a SoundCloud Artist Pro account/app and approves the YouTube API project setup.

## 1. Evidence and current access boundary

The prior audit (`docs/ndcr-content-audit.md`) could not fetch the official YouTube or Instagram feeds, and could only read a limited, stale SoundCloud profile snapshot. It verified a small number of SoundCloud examples, not the complete 83-release catalogue. The platform feed fetch limitation is not evidence that the official APIs cannot return the public catalogues.

This plan describes what official APIs and account interfaces document. It does **not** claim that the channel API has already been called, that all 83 records are public on both platforms, or that all metadata values are complete. Those facts are confirmed only by the extraction and reconciliation run.

## 2. YouTube: primary extraction

### Recommended method: YouTube Data API v3

Resolve `@NewDelhiCommunityRadio` using `channels.list` with `forHandle`, requesting `snippet`, `contentDetails`, and (if useful) `statistics`. Save the returned channel ID, title, handle/branding fields that are exposed, and the channel’s `contentDetails.relatedPlaylists.uploads` ID. Then paginate the uploads playlist using `playlistItems.list` (`maxResults` up to 50; continue with each `nextPageToken`) to enumerate uploaded video IDs in channel playlist order. Fetch video details with `videos.list` in batches of up to 50 IDs, requesting `snippet`, `contentDetails`, `status`, and `liveStreamingDetails` where available.

The official API documentation explicitly identifies the channel uploads playlist as the channel’s uploaded-video list. The list endpoints return a page token for subsequent results. A single extraction for an 83-item series is small: normally one channel lookup, two playlist pages if there are about 83 relevant uploads, and a small number of `videos.list` calls. Extra videos on the channel must be retained in the raw export and classified during reconciliation rather than ignored based on a guessed count.

### Data retrievable from public videos

| Information | API source | Reliability / caveat |
|---|---|---|
| Video ID and canonical watch URL | `playlistItem.snippet.resourceId.videoId`; construct the standard watch URL from the ID | Reliable identifier for each enumerated item. Keep the ID as the key; do not infer IDs from titles. |
| Channel ID and channel title | Channel resource; each video’s `snippet.channelId` / `channelTitle` | Reliable for confirming the source channel. Resolve the supplied handle first to guard against similarly named channels. |
| Exact video title and description | `videos.list` → `snippet.title`, `snippet.description` | Source text; preserve verbatim, including genre wording, punctuation, and links. |
| Thumbnail availability and URLs | `snippet.thumbnails` variants (URL, width, height) | Metadata can be captured without downloading image bytes. URLs/variants may differ; keep the API response or chosen URL as a source reference. A thumbnail URL does not prove web reuse rights. |
| Tags/category/language | `snippet.tags`, `categoryId`, language fields when exposed | Useful supplementary metadata; may be absent and is not a substitute for exact genre text in the title. |
| Duration/caption indicator | `contentDetails.duration`, `contentDetails.caption` | Useful if returned. Caption indicator says whether captions are available, not the caption/transcript itself. |
| Public publication time | `snippet.publishedAt` | YouTube defines this as the time a video was published; it may differ from upload time. It is still YouTube publication metadata, not automatically NDCR’s official premiere time. Special cases include private/unlisted items where it can represent upload time. |
| Current public/unlisted/private status, embeddability | `status` properties subject to access/authorization rules | Public unauthenticated calls expose public data; some owner-only fields or private/unlisted items may require owner OAuth. Embedding can be blocked even when nominally embeddable. |
| Broadcast scheduled/actual times | `liveStreamingDetails` on relevant live-broadcast resources | Only present for upcoming, live, or completed live broadcasts. Do not assume it exists for an ordinary uploaded video or every YouTube Premiere. |
| Channel playlist ordering | `playlistItem.snippet.position`, page sequence, IDs | Captures the order returned by the uploads playlist at extraction time. Treat as channel order, not release chronology; preserve extraction timestamp. |
| Other useful detail | `statistics` (view/like/comment counts) | Not needed for catalogue identity and changes over time; omit from canonical import unless NDCR identifies a use. |

### Requirements and setup

- A Google Cloud project with the YouTube Data API v3 enabled.
- An API key restricted to the intended API/use where possible. Public channel/video reads do not require a Google user sign-in or channel-owner OAuth.
- A read-only request flow that resolves the exact handle and records the resolved channel identity before exporting anything.
- Default documented quota is 10,000 units/day for most endpoints; `channels.list`, `playlistItems.list`, and `videos.list` each cost 1 unit per request. The default quota is ample for a one-time 83-set extraction. Quotas can change and should be checked in the project console at implementation time.
- If private/unlisted videos or owner-only metadata must be included, NDCR must authorize a Google OAuth client/account with the appropriate channel access. This is not needed for public catalogue enumeration.

Do not use `search.list` as the primary inventory method. Search relevance and pagination are not a complete channel-catalogue guarantee; use the channel’s uploads playlist.

### Alternatives compared

| Method | Strength | Limitation | Recommendation |
|---|---|---|---|
| YouTube Data API + uploads playlist | Official, paginated, stable IDs, structured metadata, low quota cost; public data can be read without account credentials | Requires Google Cloud project/API key; public access cannot reveal private content; premiere date is not guaranteed in the video resource | **Primary method** |
| Public channel/playlist webpage | Easy for a person to browse; supports human spot-checking | Dynamic page, lazy loading, possible incomplete list, not a stable bulk-export contract; do not automate by parsing page internals | QA/fallback viewing only |
| YouTube channel RSS feed | Official/public feed can help identify recent uploads | Feed is intended for recent items, not a guaranteed full 83-video historical export; not enough metadata for descriptions/artwork/date review | Incremental recent-upload check only, not initial catalogue |
| `yt-dlp`/similar webpage extractors, reverse-engineered endpoints, browser scraping | Can expose convenient data in some cases | Depends on undocumented page behavior and may conflict with platform restrictions; can break without notice | **Do not use for this project** |
| YouTube Studio/Content Manager export | Account-side, owner view; Content Manager documents a video CSV/Sheets export | Content Manager capability may not be available to NDCR’s account; standard Studio’s export options may differ. Requires owner access and manual UI work | Fallback if API setup is unavailable or private-video review is needed |
| Google Takeout | Official account data export | May include video media downloads, which are unnecessary and explicitly out of scope; export content shape may not meet catalogue needs | Not recommended for this task |

## 3. SoundCloud: secondary extraction

### Recommended method: official SoundCloud API, conditional on app access

The current SoundCloud developer documentation specifies a public API at `api.soundcloud.com`, OAuth 2.1, and a `GET /users/{user_urn}/tracks` endpoint. Collection pagination uses `linked_partitioning=true` and requires following `next_href` until it is absent. Track metadata responses can contain a track ID/URN, title, permalink URL, description, user information, artwork URL, genre, tags, duration, and creation/publication metadata. Exact fields may be null or restricted by access level.

For public tracks, the documented Client Credentials flow authenticates an application (not a SoundCloud user) and is intended for public resources. The endpoint must be tested against NDCR’s public profile with the supported client credential before the full export. If NDCR’s list contains private/scheduled tracks that must be inspected, use an owner-authorized Authorization Code flow with PKCE and request only the required account access. For this catalogue of released sets, begin with public track resources and do not request private access unless the public catalogue proves incomplete.

### Exact SoundCloud requirements

The current official app-registration guide says:

- An API app and its `client_id` + `client_secret` are required for API usage.
- Creating/retrieving API app credentials currently requires a **SoundCloud Artist Pro subscription** for the account doing the registration.
- Recommended registration uses SoundCloud’s maintained API CLI with remote pairing; the browser “Your Apps” flow is an alternative.
- Client Credentials grant provides public-resource access and requires the secret. Tokens expire after about one hour; cache/reuse and refresh rather than obtaining a new token for every request.
- Authorization Code + PKCE requires the owner to sign in and consent; use this only if access to private/account-only records is needed.
- Do not place the client secret or access token in source control, client-side website code, or the catalogue export.

**Not yet known:** whether NDCR already has Artist Pro, whether an existing approved API app/credentials are available, and whether the public tracks endpoint will enumerate exactly all 83 relevant releases. No credential has been requested or created.

### Data retrievable and caveats

| Information | API source | Reliability / caveat |
|---|---|---|
| Track ID/URN and permalink URL | Track resource | Stable source identity; retain original URL and ID. |
| Exact title and description | `title`, `description` | Preserve exact platform text; descriptions may differ from YouTube and can contain embedded artist links/credits. |
| Artist/account identity | `user` resource (ID/URN, username, permalink/profile data) and `metadata_artist` where present | Account uploader and credited artist are not necessarily the same concept. Preserve both; confirm canonical artist attribution manually. |
| Artwork reference | `artwork_url`, if present | Capture reference only; no image download. API artwork URL does not establish rights or source dimensions/variant. |
| Genre and tags | `genre`, `tag_list` | Can be absent; preserve raw text and tags separately. Do not overwrite the original YouTube genre wording or normalize automatically. |
| Duration | `duration` | Useful if present; stored unit must be checked from response/API reference before import. Does not establish audio/video session format. |
| Public access/share state | `sharing`/`access` fields as returned | Public track endpoints cannot reveal content hidden from the caller; a public profile should omit private tracks by design. |
| Creation/upload timestamp | `created_at` | Technical SoundCloud track timestamp only. Not the official NDCR release/premiere date/time. |
| Track ordering and pagination | Collection order and `next_href` cursor | Preserve source order and extraction timestamp, but do not treat it as the official NDCR chronology. |
| Other fields | tags, BPM, license, counts and streamability where returned | Capture only if useful for reconciliation; popularity/playability fields are not essential to catalogue identity and may change. |

### Alternatives compared

| Method | Strength | Limitation | Recommendation |
|---|---|---|---|
| SoundCloud API user-tracks endpoint | Official, structured, paginated; retrieves raw metadata for public tracks without media download | Requires an API app; app credentials currently require Artist Pro. Public-profile page snapshot available in our prior audit is incomplete/stale and cannot guarantee complete inventory. | **Preferred if NDCR has or approves the required app access** |
| SoundCloud profile page / browser UI | Human-visible account content and convenient spot-checking | Dynamic/lazy-loaded display; prior available snapshot exposes only a limited slice. Manual copy is error-prone at 83 entries. | Visual fallback and QA, not a scraper target |
| SoundCloud oEmbed/widget | Useful for displaying a known track and validating a permalink/embed | It is not a complete account catalogue export and does not provide the full metadata set needed here | Per-record display/verification only |
| Unofficial `api-v2` calls, hidden client IDs, session cookies, page scraping | Sometimes used by third-party tools | Unofficial, fragile, may rely on non-public credentials or site internals; not a reliable compliant internal catalogue method | **Do not use** |
| Manual owner-provided CSV/sheet | No app integration; owner can use account knowledge to provide the list | No standard, documented public-account CSV export was confirmed in the sources reviewed; transcription may still be needed | Fallback if API app registration is unavailable; ask NDCR for the simplest owner-side export or a prepared list, then validate against public links |

## 4. Cross-platform reconciliation design

### Staging outputs

Keep three separate, reviewable artifacts during extraction:

1. **Raw YouTube export:** one row per upload/video, preserving API fields and extraction time.
2. **Raw SoundCloud export:** one row per account track, preserving API fields and extraction time.
3. **Reconciliation worksheet:** one candidate NDCR release per proposed set number, with source-specific values side by side, match evidence, discrepancy flags, human decision, and official NDCR release timing/source.

Do not overwrite raw platform fields with normalized values. Avoid merging during extraction; matching and canonicalization are separate, auditable steps. The final canonical records are created only after human review. The file format can be chosen at implementation (CSV/JSON plus a review-friendly spreadsheet); this plan does not alter `docs/ndcr-content-schema.md`.

### Matching sequence

1. Extract and preserve all platform records, not only the entries whose titles already match the expected `NDCR #NNN` pattern.
2. Parse possible set-number candidates from title and description using a deterministic pattern (`NDCR`, optional punctuation/space, `#`, digits). Store the matched substring and source field as evidence; parsing is a suggestion, not a correction.
3. Group by exact set number across YouTube, SoundCloud, and any NDCR-provided official release schedule/catalogue.
4. Flag duplicate same-platform entries with the same number, multiple number candidates, or number disagreement between title/description/artwork reference.
5. Where a number is absent in a platform title, use title/artist/description as candidate evidence only. Do not auto-match by artist/title similarity alone.
6. Compare artist strings, exact titles, original genre wording, descriptions, artwork references, URLs, and platform publication timestamps. Keep all source values side by side.
7. Add the official release/premiere date/time only from an NDCR-confirmed schedule, post/premiere source, or approved internal record. Platform timestamps remain technical metadata.
8. Human reviewer accepts, rejects, or marks each candidate unresolved. Only accepted matches become one canonical release record.

### AI’s role and discrepancy flags

AI may help classify unnumbered platform rows, suggest artist/title matches, summarize differences, or prioritize review. It must not silently edit source data or invent a missing number/date/value. A deterministic number parser should generate the primary key candidate; AI is a second-pass assistant, not the matching authority.

Flag at minimum:

- duplicate set number within YouTube or within SoundCloud;
- missing set number on either platform;
- one platform record with multiple possible set numbers;
- a numbered YouTube set with no SoundCloud match, or a SoundCloud set with no YouTube match;
- artist mismatch after comparing canonical and platform display names;
- title mismatch, including punctuation/casing differences (show both; do not necessarily treat harmless formatting as a substantive conflict);
- official date/time mismatch against NDCR schedule/post source;
- conflicting or missing genre wording;
- missing description on either platform;
- missing artwork reference or differing platform artwork;
- platform record unavailable/private/deleted or returned with incomplete metadata;
- suspicious numbering gap between observed numbers.

A suspicious gap is a review flag only. Because numbering may contain historical manual mistakes, gaps are not proof of missing releases. The 83-set owner-confirmed total is a validation constraint, not a license to generate placeholder records or renumber any entry.

## 5. What extraction cannot decide reliably

Automated platform extraction cannot establish all of the following without NDCR’s editorial source or human review:

- NDCR’s official post/premiere time when it differs from the platform’s technical timestamp;
- whether a YouTube item is an audio artwork presentation or video footage if metadata is unclear; inspect the public watch page/media manually, without downloading it;
- whether artist-name variations refer to the same canonical person/group;
- whether platform description text is an artist bio, set description, credits, or promotional copy intended for reuse on the website;
- whether title genre words map to one or multiple structured genres without changing published wording;
- whether an image URL corresponds to the intended website image, approved crop, current original, or web-cleared asset;
- creator credit, consent, copyright/license, or permission to reuse platform artwork on NDCR’s website;
- event/collaboration relationships from text/logo similarity alone;
- any hidden, private, deleted, geo-restricted, or unavailable item the public API does not return;
- whether a numbering gap represents a true missing catalogue entry or an intentional/manual numbering anomaly.

## 6. Human review required

One NDCR editor should review all 83 reconciled release rows once. This should be an exception-led review rather than retyping the catalogue:

- confirm each unique set number and preserve the published number;
- confirm artist identity/display name and platform links;
- accept exact platform titles/descriptions/genre strings as transcribed, and approve any canonical website title/description separately;
- supply official NDCR release/premiere date/time and source, especially where platform publish timestamps differ;
- mark session format and YouTube presentation only after verification;
- choose an appropriate artwork reference and separately confirm website-use rights/credit;
- resolve each cross-platform mismatch and suspicious gap, leaving unresolved values UNKNOWN;
- confirm the accepted distinct release count is 83 and document any extra channel uploads that are not NDCR numbered sets.

## 7. Estimated effort for 83 releases

Estimates assume API access works, the platform accounts contain the expected public records, and an NDCR editor can resolve schedule/date ambiguities. They are planning estimates, not measured results.

| Work | Approximate effort | Notes |
|---|---:|---|
| YouTube API setup and proof-of-access | 30–90 minutes | Create/reuse Google Cloud project, enable API, restrict API key, resolve official handle, confirm uploads playlist. No channel OAuth unless private data is required. |
| YouTube full public export | 10–30 minutes including checks | Pagination and metadata fetch for roughly 83 relevant videos is a few API requests; time includes output inspection. |
| SoundCloud credential eligibility and API proof | 30–90 minutes if Artist Pro/app access already exists; longer if subscription/app registration is needed | Test client-credentials access to profile tracks, pagination, and returned metadata. API credential setup time can vary. |
| SoundCloud full public track export | 10–30 minutes including checks | 83 tracks are below a single maximum page size if limits allow, but follow `next_href` and confirm completion. |
| Automated candidate matching and discrepancy generation | 30–90 minutes once raw exports are available | Includes number parsing, exact-number join, duplicate/missing checks, text comparison, and review sheet generation. |
| NDCR editorial review of 83 records | Roughly 3–6 hours | About 2–4 minutes per record for number, artist, official date/time/source, format/presentation, and artwork-reference confirmation, plus longer exceptions. Schedule evidence availability dominates. |

If SoundCloud app credentials are unavailable, the extraction is not blocked completely: complete YouTube through its API, then obtain an owner-supplied SoundCloud list/export or conduct an assisted UI-based verification without scraping. The SoundCloud half should not be replaced by a hidden endpoint or browser scraper merely to avoid app setup.

## 8. Exact next implementation step

After NDCR chooses the route, implement a **read-only YouTube API pilot** as the first extraction spike: resolve `@NewDelhiCommunityRadio`, verify the returned channel identity, enumerate the uploads playlist, and write a raw metadata export for inspection. Do not create canonical Release records in this pilot.

Before the SoundCloud pilot, confirm internally whether NDCR already has (a) Artist Pro eligibility and (b) an existing approved API app. If yes, test a Client Credentials token against the official public user-tracks endpoint and verify pagination/record count. If not, decide whether to register an app under an eligible NDCR account or request a SoundCloud owner-side catalogue export. No credentials are requested or created by this document.

Once both read-only exports are validated, build the reconciliation worksheet and run a human-reviewed match. Only after the 83 accepted records and the canonical date/time sources are established should the inventory schema be revisited.

## Sources

### Official YouTube documentation

- [YouTube Data API reference](https://developers.google.com/youtube/data/reference/rest) — channel uploads playlist and `playlistItems.list`.
- [Channels: list](https://developers.google.com/youtube/v3/docs/channels/list) — `forHandle` and channel resource parameters.
- [PlaylistItems: list](https://developers.google.com/youtube/data/reference/rest/v3/playlistItems/list) — paginated upload playlist retrieval.
- [Videos resource](https://developers.google.com/youtube/data/reference/rest/v3/videos) — ID, snippet title/description/thumbnails/tags, `publishedAt`, duration, status, and live-stream fields.
- [YouTube Data API quota costs](https://developers.google.com/youtube/data/determine_quota_cost) — current default quota and request costs.
- [YouTube Studio Content Manager video export](https://support.google.com/youtube/answer/10947284) — account-side CSV/Sheets export where Content Manager access is available.
- [Google Takeout help](https://support.google.com/accounts/answer/3024190) — account archive includes YouTube data; not recommended here because media download is unnecessary.

### Official SoundCloud documentation

- [SoundCloud API Guide](https://developers.soundcloud.com/docs/api/guide) — OAuth 2.1, public Client Credentials vs user Authorization Code + PKCE, pagination and endpoint use.
- [SoundCloud API Explorer](https://developers.soundcloud.com/docs/api/explorer/) — current public API resources, including `/users/{user_urn}/tracks` and track endpoints.
- [Get a SoundCloud API key](https://developers.soundcloud.com/docs/api/register-app) — Artist Pro requirement, app credentials, CLI/pairing, secure credential handling.
- [SoundCloud pagination update](https://developers.soundcloud.com/blog/pagination-updates-on-our-api/) — `next_href` cursor pagination for user track collections.
- [SoundCloud track object](https://developers.soundcloud.com/blog/soundclouds-new-api-track-object/) — track metadata examples including title, permalink, description, artwork, duration, genre, tags, and user.
- [SoundCloud access levels](https://developers.soundcloud.com/blog/high-tier-content-in-the-soundcloud-api/) — public API metadata access levels for playable, preview, and blocked content.

### NDCR project sources

- `docs/ndcr-content-audit.md` — incomplete public-source audit; do not treat its sample as the full catalogue.
- `docs/ndcr-release-inventory.md` — release catalogue fields and canonical date/time requirements.
- `docs/ndcr-content-schema.md` — prior schema proposal; unchanged by this plan.
