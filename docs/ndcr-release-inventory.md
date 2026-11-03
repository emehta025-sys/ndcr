# NDCR Release Inventory — Master Catalogue Definition

**Status:** Catalogue model proposal; no records imported and no website/CMS built  
**Prepared:** 22 October 2026  
**Purpose:** Define the single source-of-truth record for NDCR’s 83 released numbered sets, and the information required to present each release on the future website.

## 1. Confirmed operating facts and evidence boundary

The project owner confirms that NDCR has released **83 numbered sets**, that every release has a set number, each set has an artist, the same releases are published to YouTube and SoundCloud, genres appear in YouTube titles, and platform descriptions contain meaningful editorial information. The owner also confirms that the official release/premiere date and time—not technical file-upload timestamps—are the dates the website must use. Audio sets are also published to YouTube, using artwork/cover presentation where applicable.

These owner confirmations are accepted as the working publishing model for this document. They do not mean the details for all 83 records have been independently verified in the current audit. `docs/ndcr-content-audit.md` verifies only a small sample of SoundCloud metadata, some local schedule/artwork examples, and records access limitations for YouTube and Instagram. No full catalogue has been populated here.

Source labels used below:

- **NDCR-confirmed:** supplied directly by the project owner in the current instruction.
- **Public platform:** visible on an official YouTube/SoundCloud record; use as published-source evidence, not as a replacement for NDCR’s canonical editorial record.
- **NDCR editorial:** confirmed or approved by NDCR for the website, including official release slot and canonical display choices.
- **Derived:** computed from the canonical release/artist records or technical asset properties.
- **UNKNOWN:** not verified from the audit or an approved source. Never substitute a plausible value.

## 2. Canonical model

Create one canonical `Release` record per numbered NDCR set. The published set number is part of its identity and must be preserved exactly as released. Do not derive a number from record count, date, chronology, platform title, or a supposed gap. If numbering conflicts are found, retain the published value(s) and flag the record for human review.

The Release record holds shared identity and official release timing, plus links to reusable Artist and Media/Artwork records. YouTube and SoundCloud each have a platform-specific metadata group. The website is a discovery, archive, and editorial layer: it points to or embeds the platform-hosted media; it does not download or re-host the DJ sets.

```text
Release (canonical, one per numbered set)
├── Artist (reusable; a release has its credited artist relationship)
├── PlatformPublication: YouTube (URL + exact published metadata)
├── PlatformPublication: SoundCloud (URL + exact published metadata)
├── Artwork references (local asset references, not media copies)
└── Explicit optional links to Event / Collaboration records, if verified
```

Artist name, biography, and artist links are maintained once on Artist where appropriate. Platform-specific titles/descriptions remain attached to the relevant publication so their exact wording is not lost. Shared release details and NDCR-approved website display details remain on Release.

## 3. Canonical Release record: fields

| Field | Type / example | Required? | Entered or derived | Source of truth and use |
|---|---|---:|---|---|
| `release_id` | Stable opaque ID | Yes | System | Internal relationship key; never use a mutable title, artist spelling, or number as the database key. |
| `set_number_published` | Integer plus preserved display form, e.g. numeric `83`, display `083` | Yes | Manual; transcription checked against published release/artwork | NDCR-confirmed: every release is numbered. The published sequence label is a canonical identifier; do not recalculate or silently normalize away display formatting. |
| `numbering_verification_status` | `verified`, `needs_review`, `conflicting_sources`, `unknown` | Yes | Manual editorial review | Makes possible historical manual numbering mistakes visible without changing the source number. A record can be released and still flagged for number review. |
| `numbering_notes` | Text | Optional; required when flagged | Manual | Documents competing published values, source, and review outcome. Never “fix” the original title/number in this note. |
| `artist_ids` | One or more references to reusable Artist records | Yes | Manual relationship selection | Associates the release with its credited artist(s) and drives artist pages/chronology. The owner confirms each set has an artist; allow multiple credits where the release itself supports them. |
| `official_release_date` | Local date (`YYYY-MM-DD`) | Yes for released/scheduled public record | Manual, NDCR-confirmed | Official date NDCR posted/premiered or intends to premiere the set. It powers schedules and chronology. It is not platform upload date. |
| `official_release_time` | Local time (`HH:mm`, 24-hour) | Yes for released/scheduled public record | Manual, NDCR-confirmed | Official posting/premiere time. Never backfill from technical platform timestamps. |
| `release_timezone` | IANA timezone, e.g. `Asia/Kolkata` | Yes | Manual/configured once; stored or reliably associated with date/time | Defines the intended local time. Use the timezone NDCR confirms for the release. Do not assume it silently for historical records; confirm or mark unknown. |
| `release_status` | `scheduled`, `released`, `postponed`, `cancelled`, `withdrawn` | Yes | Manual state change | Controls Upcoming Set, archive visibility, and public status. Do not infer cancellation or release from a platform upload timestamp. A postponed record retains its prior slot in editorial history if needed. |
| `canonical_website_title` | Text | Optional until website editorial approval | Manual/editorial | Approved title for site display. May equal a platform title; keep separate so the exact published title is preserved. Do not auto-compose. |
| `session_format` | `audio`, `video`, `unknown` | Required for public display when verified | Manual from confirmed set/session evidence | Describes the set/session, not the destination platform. A YouTube URL does not establish `video`. Unknown stays unknown until footage/audio presentation is checked. |
| `youtube_presentation` | `video_footage`, `artwork_with_audio`, `other`, `unknown` | Optional; required only where format labeling/player treatment needs it | Manual verification from the actual YouTube item | Separates session format from YouTube’s visual presentation. Audio sets may appear on YouTube with artwork, per NDCR confirmation. Do not infer presentation solely from URL. |
| `genres_original` | Ordered list of strings exactly as published/approved | Optional if unavailable in source; expected for verified YouTube release | Manual transcription from YouTube title/description/metadata, editorially checked | NDCR-confirmed: genre wording is included in YouTube titles and is important. Preserve exact wording, order, punctuation, and multiplicity; do not normalize or correct. |
| `genres_normalized` | Optional references/labels, separate from source wording | Optional; deferred unless discovery needs it | Manual mapping with editorial approval; never automatic rewrite | Supports later broad search/filtering while retaining `genres_original`. Do not add until a vocabulary and mapping process are agreed. |
| `artist_bio_source` | Text/source reference or extracted original text | Optional | Manual capture from source | Retains the bio as published or supplied. Indicates where the text came from; do not assume platform bio is evergreen or artist-approved for reuse. |
| `artist_bio_website` | Text | Optional | Manual, artist/NDCR approved | Reusable, approved Artist-page bio. Kept on Artist entity, not copied into every Release. A bio quoted in a platform set description does not automatically qualify. |
| `set_description_website` | Text | Optional | Manual editorial | Approved shared description for the Release page/archive details. Can be adapted from platform copy only after review; preserve source copy separately. |
| `editorial_notes` | Private text | Optional | Manual | Internal context, clarification, or follow-up. Never displayed publicly by default. Do not use for unstructured copies of canonical fields. |
| `verification_status` | `unverified`, `partially_verified`, `verified`, `needs_owner_review` | Yes | Manual, evidence-based | Tracks confidence in the record as a whole. Record field-level provenance/source notes for disputed or important values; do not let a status imply values were checked when they were not. |
| `source_notes` | Repeatable source entries `{field, source_type, URL/path, checked_at, note}` | Optional; recommended for imports/review | Manual | Records where values came from (official platform, NDCR schedule/confirmation, local reference). Not public copy. Use to resolve later conflicts. |
| `event_ids` | List of Event references | Optional | Manual, only when relationship is confirmed | Links the set to an event if NDCR explicitly identifies that relationship. No date/name matching inference. |
| `collaboration_ids` | List of Collaboration references | Optional | Manual, only when relationship is confirmed | Links to explicit, verified collaborative work. A logo/partner mention alone is not sufficient. |
| `created_at`, `updated_at` | Timestamp | Yes | System | Record maintenance. Not release timing and never used to sort public archive. |

### Release dates and timestamp separation

Use `official_release_date`, `official_release_time`, and `release_timezone` as the canonical presentation timestamp. Store an equivalent timezone-aware instant internally if the eventual platform requires it, without losing the local date/time entered by NDCR. Official scheduling/premiere evidence should be captured as the source.

Technical `youtube_uploaded_at` and `soundcloud_uploaded_at` values are **not canonical Release fields**. They can be kept as optional technical audit metadata only if a future import or operations need justifies it. They must never drive latest/archive ordering, monthly schedule, artist chronology, or homepage modules.

## 4. Artist record: reusable fields

| Field | Type | Required? | Entered or derived | Use |
|---|---|---:|---|---|
| `artist_id` | Stable opaque ID | Yes | System | Relationship key. |
| `canonical_artist_name` | Text | Yes for public release attribution | Manual, NDCR/artist-confirmed | Reusable artist identity; does not overwrite the spelling/casing used in a platform title. |
| `public_platform_names` | Repeatable `{platform, name}` | Optional | Manual transcription/confirmation | Preserves a different public artist display name where platform-specific spelling differs. |
| `artist_bio_source` | Text and/or source reference | Optional | Manual capture | Source copy and provenance for artist bio statements. |
| `artist_bio_website` | Text | Optional | Manual, artist/NDCR approved | Website biography, only if approved for reuse. |
| `external_links` | Repeatable `{label, URL, platform, verified_at}` | Optional | Manual, verified | Public artist-chosen links/social profiles. Do not scrape or infer identity from similar names. |
| `release_ids` | Derived list of Release references | Derived | Derived from Release.artist_ids | Artist page set list and chronology. Never maintain a second manually updated set list. |
| `artist_image_reference` | Media/Artwork reference | Optional | Manual selection after rights/identity check | Approved artist portrait/artwork. No artist image is assumed from a platform avatar or flyer. |
| `verification_status`, `source_notes` | Enum + references | Yes / optional | Manual | Tracks identity/link/bio verification and provenance. |

## 5. Platform publication metadata

Keep a distinct publication entry per platform. A public Release may have both entries, as confirmed by NDCR, while missing or broken URL values remain explicit data-quality issues rather than fabricated links.

| Field | Type | Required? | Entered or derived | Use |
|---|---|---:|---|---|
| `platform` | Enum: `youtube`, `soundcloud` | Yes | Manual/system | Identifies the destination. |
| `platform_url` | URL | Required for a verified published platform record | Manual after publication; link checked | Direct click-through/embed target. Never manufacture URLs from title or slug. |
| `platform_title` | Exact text | Required when visible | Manual transcription or import-and-confirm | Preserves exact YouTube/SoundCloud title, genre wording, punctuation, and casing. Separate from `canonical_website_title`. |
| `platform_description` | Text | Optional when visible | Manual transcription or import-and-confirm | Preserves platform-specific copy, credits, links, and other published metadata. Do not overwrite differences between platforms. |
| `platform_artist_links` | Repeatable `{label, URL}` | Optional | Manual transcription and identity verification | Links present in that platform’s description. Cross-reference to Artist.external_links where genuinely reusable, but preserve source context. |
| `platform_publication_timestamp` | Timestamp | Optional, technical only | Import/read from platform; clearly labeled | Secondary platform metadata for troubleshooting/audit only. Not the NDCR release date. |
| `youtube_presentation` | Enum `video_footage`, `artwork_with_audio`, `other`, `unknown` | Conditional for YouTube | Manual inspection | Confirms what the viewer sees/hears. Does not determine canonical session format. |
| `genre_source_text` | Ordered list/text | Optional | Manual transcription | Source-specific genre wording. YouTube title can contain genre; retain title as-is as well. Do not treat platform field and title text as necessarily identical. |
| `duration_seconds` | Integer | Optional | Read from platform and confirm | Useful display metadata if available. Not required until verified. |
| `availability_checked_at` | Timestamp | Optional | System/editor | Supports link health/maintenance without changing publication history. |

This publication group does **not** instruct the site to host or download media. The default website behavior should be direct links or an approved, accessible embed with a clear external-link fallback. Avoid eager loading heavy third-party players across the whole archive.

## 6. Artwork and media references

The inventory records where artwork exists and how to find the appropriate approved file. It does not copy the complete media library into a CMS or turn the website into a media warehouse.

| Field | Type | Required? | Entered or derived | Use |
|---|---|---:|---|---|
| `artwork_status` | `available_reference`, `known_external_only`, `not_located`, `unknown` | Yes | Manual verification | Makes absence/availability explicit. “Available” must identify a usable source reference. |
| `preferred_website_artwork_ref` | Relative path, asset ID, or approved storage locator | Optional until website asset is selected | Manual selection | Points to the preferred, rights-cleared image for website presentation. Do not use a social crop automatically. |
| `artwork_reference_note` | Text/source note | Optional | Manual | Records how to locate the original (e.g. reference filename or future Drive locator) without importing it. |
| `platform_artwork_refs` | Repeatable `{platform_or_variant, reference, verified}` | Optional | Manual | References platform-specific variants: Instagram Story 9:16, Instagram feed 4:5, SoundCloud 1:1, YouTube 16:9. Local examples in `docs/references/artist-story-9x16.jpg`, `artist-instagram-4x5.jpg`, `artist-soundcloud-1x1.jpg`, and `artist-youtube-16x9.jpg` demonstrate formats only; they are not assumed to be per-release originals. |
| `artwork_credit` | Text/reference | Optional; record when known or required | Manual | Creator attribution. Unknown credit remains unknown. |
| `artwork_rights_status` | `unknown`, `cleared_for_web`, `restricted`, `not_for_web` | Yes before public use | Manual owner/editor confirmation | Separates platform availability from permission to display on NDCR’s website. Platform artwork is not automatically cleared for reuse. |
| `artwork_alt_text` | Text or decorative classification | Required for selected informative web image | Manual accessibility review | Provides meaningful alternative; essential flyer details also need HTML text. |
| `source_file_dimensions`, `mime_type`, `file_size` | Technical metadata | Optional | Derived only when local file is provided | Helps prepare responsive web images later. No file download/import is authorized in this inventory task. |

The larger Google Drive library is owner-reported and not locally reviewed. Do not place fictional Drive paths, infer per-set asset filenames, or mark rights cleared based on social publication.

## 7. Manually entered vs derived

### Manual or editorially confirmed

- Published set number and its displayed form; number verification state and notes.
- Canonical artist record/name and source-to-artist identity matching.
- Official release date/time/timezone and release status, based on NDCR’s schedule/premiere information.
- Actual YouTube/SoundCloud URLs and exact platform titles/descriptions/genre wording.
- Session format and YouTube presentation after checking the media.
- Website title, website description, artist bio, credits, normalized genre mapping, and featured selections.
- Artwork references, preferred website artwork, image context, rights, credit, and alt text.
- Event/collaboration relationship and all exceptions or corrections.

### Derived after canonical data is verified

- Website release timestamp from the official local date/time/timezone.
- Latest Set and Upcoming Set from `release_status` plus official release timestamp (and an explicit NDCR policy for scheduled/premiere versus actual publication).
- Monthly schedule grouping and display date/time from the canonical release date/time.
- Artist release list and chronology from Release.artist_ids and canonical release dates.
- Archive filtering/sorting from stored genre/source title/artist/date data.
- Display rendering of the stored set number (only if display formatting is confirmed; preserve raw published number too).
- File dimensions/format/size and web derivatives only after an approved asset is actually made available locally.

Do not derive the set number, official release date/time, session format, artist identity, genre normalization, platform descriptions, rights, or event/collaboration relationships from numbering sequence, platform upload timestamps, filenames, or patterns.

## 8. Numbering anomaly handling

1. Capture the number shown in each published source/artwork without changing it.
2. Compare platform title, platform artwork, and any NDCR-maintained catalogue; record each source and the exact conflicting text.
3. Set `numbering_verification_status=needs_review` or `conflicting_sources`; add a concise note and route to an NDCR editor.
4. Keep a stable internal `release_id` so the record’s relationships do not depend on the number.
5. Only NDCR editorial confirmation may determine whether a separate canonical website display label is used. Preserve source-published title/number even if a correction is approved.
6. Never close gaps by creating placeholder releases, infer a missing set from adjacent numbers, renumber later releases, or silently “repair” a manual mistake.

## 9. How one Release feeds the future website

| Website surface | Data used from the canonical catalogue | Editorial/validation guardrail |
|---|---|---|
| Homepage | Manually selected featured Release/artwork; Latest Set; upcoming Event; selected photography and Artists from their own records | The feature is editorial. Do not call an item “live” unless a real live broadcast is confirmed. Homepage feature does not duplicate the Set. |
| Latest Set | Most recent eligible `released` record by **official release date/time**, not upload timestamp | Define policy for delayed/late platform publication and ties before implementation. |
| Upcoming Set | Earliest eligible `scheduled` Release by official scheduled date/time | Requires an NDCR-confirmed upcoming slot and public-ready artist/title/artwork policy. Do not show draft/cancelled entries. |
| Monthly Schedule | Scheduled/released Releases grouped by official local release month; display artist, number/title, time, approved artwork | Schedule graphic/Instagram post is a source/reference, not a second copy of set data. Editorially confirm changes and exceptions. |
| Radio / Archive | Release cards/details with number, approved title, artist, original genres, official date/time, artwork, format where confirmed, YouTube/SoundCloud actions | Filters derive from verified fields. Missing format/genre stays unknown/omitted instead of guessed. Embedded playback is optional; links remain available. |
| Artist page | Reusable Artist identity, approved biography/links/image, and derived list of all linked Releases | Do not copy artist bio or links onto every release. Keep appearance/event connections explicit and verified. |

## 10. Example records using existing verified project information only

These examples intentionally remain incomplete. The official release date/time is `UNKNOWN` because the audit surfaced SoundCloud technical publication timestamps, which the owner explicitly says are not canonical. YouTube values are `UNKNOWN` because the official channel could not be audited in the available fetch. Do not treat these as publish-ready records.

### Example A — NDCR #009: Aayna

Evidence: official SoundCloud indexed track page linked in `docs/ndcr-content-audit.md`.

```yaml
release_id: not_assigned
set_number_published: "009"
numbering_verification_status: verified
numbering_notes: UNKNOWN
artist:
  canonical_artist_name: Aayna
  public_platform_name: Aayna
  artist_bio_source: UNKNOWN
  artist_bio_website: UNKNOWN
  external_links:
    - label: Instagram
      url: https://www.instagram.com/aayna.music
    - label: SoundCloud
      url: https://soundcloud.com/user-519313833
  verification_status: verified_for_links_in_the_SoundCloud_description_only
platform_publications:
  - platform: SoundCloud
    platform_url: https://soundcloud.com/new-delhi-community-radio/ndcr-009-aayna
    platform_title: "NDCR #009: Aayna"
    platform_description: "NDCR Instagram: https://www.instagram.com/newdelhicommunityradio\nSoundCloud: https://soundcloud.com/new-delhi-community-radio\nAayna Instagram: https://www.instagram.com/aayna.music\nSoundCloud: https://soundcloud.com/user-519313833"
    genre_source_text: [Electronic]
    platform_publication_timestamp_utc: "2025-05-20T12:13:07Z" # technical metadata only; not canonical release date
    youtube_url: UNKNOWN
    youtube_title: UNKNOWN
    youtube_description: UNKNOWN
official_release_date: UNKNOWN
official_release_time: UNKNOWN
release_timezone: UNKNOWN
release_status: released
session_format: UNKNOWN
youtube_presentation: UNKNOWN
canonical_website_title: UNKNOWN
set_description_website: UNKNOWN
artwork_status: available_on_soundcloud_track_page
preferred_website_artwork_ref: UNKNOWN
platform_artwork_refs: UNKNOWN
artwork_rights_status: UNKNOWN
duration_seconds: UNKNOWN
event_ids: []
collaboration_ids: []
verification_status: partially_verified
source_notes:
  - Official SoundCloud indexed page verifies displayed title, genre, image indicator, description links and technical timestamp.
  - Official NDCR release date/time and YouTube counterpart were not verified.
editorial_notes: UNKNOWN
```

### Example B — NDCR #018 : Hamza Rahimtula

Evidence: official SoundCloud indexed track page. The description calls it the 18th NDCR session, describes a vinyl-only set, and includes artist biography/context; those words are source text, not independently approved artist-page copy.

```yaml
release_id: not_assigned
set_number_published: "018"
numbering_verification_status: verified
artist:
  canonical_artist_name: Hamza Rahimtula
  public_platform_name: Hamza Rahimtula
  artist_bio_website: UNKNOWN
  external_links: UNKNOWN
platform_publications:
  - platform: SoundCloud
    platform_url: https://soundcloud.com/new-delhi-community-radio/hamza-audio
    platform_title: "NDCR #018 : Hamza Rahimtula"
    platform_description: UNKNOWN # Description exists; exact copy not transcribed into this example.
    genre_source_text: [House]
    platform_publication_timestamp_utc: "2025-08-05T19:06:33Z" # technical metadata only
  - platform: YouTube
    platform_url: UNKNOWN
    platform_title: UNKNOWN
    platform_description: UNKNOWN
official_release_date: UNKNOWN
official_release_time: UNKNOWN
release_timezone: UNKNOWN
release_status: released
session_format: UNKNOWN
youtube_presentation: UNKNOWN
canonical_website_title: UNKNOWN
artwork_status: image_visible_on_soundcloud_track_page
preferred_website_artwork_ref: UNKNOWN
artwork_rights_status: UNKNOWN
duration_seconds: UNKNOWN
event_ids: []
collaboration_ids: []
verification_status: partially_verified
source_notes:
  - Official SoundCloud indexed page verifies title, artist string, House genre, descriptive copy, image indicator and technical timestamp.
  - Official release date/time, SoundCloud URL availability, YouTube counterpart, and web image rights require owner/source verification.
editorial_notes: Do not promote platform bio copy into Artist.artist_bio_website without approval.
```

### Example C — NDCR #019 : KHXDEEJ

Evidence: official SoundCloud indexed track page. The exact title and Techno genre are visible. The long description includes a DJ/location/background description; no artist profile URL was visible in the returned excerpt.

```yaml
release_id: not_assigned
set_number_published: "019"
numbering_verification_status: verified
artist:
  canonical_artist_name: UNKNOWN
  public_platform_name: KHXDEEJ
  artist_bio_website: UNKNOWN
  external_links: UNKNOWN
platform_publications:
  - platform: SoundCloud
    platform_url: https://soundcloud.com/new-delhi-community-radio/khxdeej-master
    platform_title: "NDCR #019 : KHXDEEJ"
    platform_description: UNKNOWN # Description exists; exact copy not transcribed into this example.
    genre_source_text: [Techno]
    platform_publication_timestamp_utc: "2025-08-12T18:41:41Z" # technical metadata only
official_release_date: UNKNOWN
official_release_time: UNKNOWN
release_timezone: UNKNOWN
release_status: released
session_format: UNKNOWN
youtube_presentation: UNKNOWN
canonical_website_title: UNKNOWN
artwork_status: image_visible_on_soundcloud_track_page
preferred_website_artwork_ref: UNKNOWN
artwork_rights_status: UNKNOWN
duration_seconds: UNKNOWN
event_ids: []
collaboration_ids: []
verification_status: partially_verified
source_notes:
  - Official SoundCloud indexed page verifies displayed artist/title casing, Techno genre, description presence, image indicator and technical timestamp.
  - Canonical artist name, official NDCR release time/date, YouTube counterpart and artwork rights are UNKNOWN.
editorial_notes: Retain the original title casing; do not infer canonical artist styling.
```

The examples intentionally do not fill the owner-confirmed fields for every release from assumptions. The SoundCloud publication timestamps shown are secondary technical evidence only and must never populate the website’s official release date/time.

## 11. Decisions before this becomes an import template

1. Confirm whether `release_timezone` is always Asia/Kolkata, including for all historical premiere dates, or whether any exceptions exist.
2. Confirm the precise allowed `release_status` lifecycle and how postponements/withdrawals appear in the archive.
3. Confirm whether an official website title is needed for every set, or whether exact platform title can be the default display title with an optional editorial override.
4. Decide whether `session_format` should describe audio/video content, while `youtube_presentation` describes footage vs artwork-plus-audio; the distinction is modeled separately here to prevent false inference.
5. Decide how exact YouTube genre-in-title text is parsed into `genres_original` without changing the stored title.
6. Confirm the owner-approved sources for official premiere dates/times and the provenance fields required during catalogue review.
7. Confirm artwork rights/contact workflow and which source formats/crops may be used on the website.
8. Resolve only actual number conflicts, individually, with the original published values retained.

## 12. Related project sources

- `docs/ndcr-content-audit.md` — current public-source audit and explicitly limited verified sample.
- `docs/ndcr-content-schema.md` — earlier V1 schema proposal; this document clarifies release/platform separation but does not modify it.
- `docs/ndcr-content-architecture.md` — content relationships and intended site surfaces.
- `docs/ndcr-discovery.md` and `docs/ndcr-design-direction.md` — product and visual research.
- `docs/references/artist-story-9x16.jpg`, `artist-instagram-4x5.jpg`, `artist-soundcloud-1x1.jpg`, `artist-youtube-16x9.jpg` — examples of platform-shaped artwork variants; not a complete catalogue or rights grant.
- `docs/references/Sept2026-06.jpg`, `OctoberArtworks-16.jpg` — schedule examples; planned slots do not establish the official history of a released set.
