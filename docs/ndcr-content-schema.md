# NDCR V1 Content Schema

**Status:** Concrete schema proposal for review; not implemented  
**Date:** 22 October 2026  
**Scope:** Defines what the editor enters for one NDCR set and the related records needed to derive the site’s archive, artist pages, schedule, events, and homepage. Field labels are platform-neutral; no CMS or code is selected.

## 1. Source rules and schema conventions

The `Set` record is the canonical source for a weekly set. One record is entered/updated once. The archive, artist set lists, monthly schedule, audio/video treatment, and latest/upcoming set modules are views of that record, not separate copies.

Owner-confirmed publishing rules:

- One set is released each Thursday at 18:00 IST.
- Formats alternate: video, audio, video, audio, and so on.
- Each release is published to YouTube and SoundCloud through separate platform workflows.
- A monthly schedule is prepared about one day before the month begins and currently published on Instagram.
- Artwork references exist for Instagram Story 9:16, Instagram feed 4:5, SoundCloud 1:1, YouTube 16:9 for audio sets, and video-set artwork/assets.
- The content editor is currently one person; weekly website upkeep must avoid duplicate page edits.

The DEDHSAAL deck and local references were reviewed as background. The deck’s `80+` claim is not used to create records or public copy unless checked against the actual catalog. The 20 reference images include schedule samples and platform-specific art layouts; they demonstrate formats and hierarchy, not rights to use each file as live site content.

Field requirement labels: **Required** means needed for the stated lifecycle step; **Optional** may be empty; **Conditional** applies only when a record is scheduled, published, displayed publicly, or the relevant content exists.

Entry method: **Manual** means a person confirms or enters the value; **Derived** means computed from canonical records/configuration; **Manual override** means normally derived but overrideable with a recorded reason; **System** means generated (IDs, timestamps, file metadata).

Dates are stored as timezone-aware instants. Programming time zone is a single shared setting, `Asia/Kolkata`; the editor sees local date and time fields and the site displays `18:00 IST`. Do not store a separate timezone on every Set.

## 2. Canonical Set schema

One `Set` represents one NDCR set/session. It is the primary thing entered for each Thursday release and the root of downstream site updates.

| Field name | Data type / allowed values | Required? | Entry | What it is used for |
|---|---|---:|---|---|
| `id` | Stable opaque ID (string/UUID) | Yes | System | Permanent internal identity and relationship target; never based on mutable title or artist spelling. |
| `set_number` | Positive integer or approved display code, e.g. `70` displayed as `#070` | Conditional: required for public release if NDCR numbering is confirmed for that set | Manual | NDCR sequence label on artwork, set page, and archive. Do not infer missing numbers or conflate this with release-cycle position. |
| `title` | Text | Yes before public site publication | Manual/editor-approved | Canonical human-readable set title; preserve NDCR’s title/casing. Do not auto-compose unless NDCR confirms a title convention. |
| `artist_ids` | One or more references to `Artist` records | Yes for scheduled/published Set | Manual relationship selection | Credits contributor(s); supplies artist page links, names, and artist-chosen external links. Supports B2B/multi-artist sets. |
| `description` | Plain text or restrained rich text | Optional | Manual, artist/editor-approved | Context on set page and selected cards. Do not copy unapproved bio text from a flyer or social post. |
| `scheduled_release_at` | Timezone-aware date-time | Required for scheduled slot | Manual confirmation; default suggestion derived | Planning, monthly schedule, upcoming set, and release-date display. Suggest Thursday at 18:00 `Asia/Kolkata`; exceptions require review. |
| `published_at` | Timezone-aware date-time | Conditional: required when website status becomes published | Manual confirmation in V1 | Sorts published archive and determines Latest Set. Keep separate from planned time so delays do not rewrite schedule history. |
| `format` | Enum: `video`, `audio`, `unknown` (temporary for incomplete imports only) | Required for scheduled/published Set | Derived from confirmed cycle; manually confirmed for historical imports; override with reason | Determines format label, media treatment, and expected artwork slots. `unknown` blocks publishing. Never infer from image ratio or guessed set number. |
| `format_override_reason` | Short text | Conditional: required if format is overridden | Manual | Explains an exception and prevents override silently changing the sequence. |
| `format_cycle_slot` | Integer/sequence reference | No | Derived | Chronological Thursday slot used for alternation; distinct from `set_number`. Useful for audit and schedule consistency. |
| `genre_tags` | List of controlled values or approved text tags | Optional in V1 | Manual/editor-approved | Powers archive genre filter. Use only NDCR/artist-selected genres; no automatic guessing. Agree vocabulary before bulk entry. |
| `youtube_url` | Valid URL | Conditional: required for public published Set | Manual after YouTube upload | Link/embed for the YouTube release. No website upload or autopublish in V1. |
| `soundcloud_url` | Valid URL | Conditional: required for public published Set | Manual after SoundCloud upload | Link/embed for the SoundCloud release. No website upload or autopublish in V1. |
| `primary_artwork_id` | Reference to approved `MediaAsset` | Conditional: required for featured presentation; recommended for public archive card | Manual relationship selection | Preferred image for set page/card. Must be web-usable, permitted, credited, and have crop guidance if needed. |
| `media_asset_ids` | List of `MediaAsset` references | Optional | Manual relationship selection | Links platform artwork variants, video artwork, captions/transcript, or approved web derivative. Asset type indicates purpose. |
| `duration_seconds` | Non-negative integer | Optional | Manual or import-and-confirm | Human-readable duration and media context. Do not calculate if unavailable. |
| `event_ids` | List of `Event` references | Optional | Manual relationship selection | Connects a Set to an event only when it is actually part of/event documentation for that event. Never infer from similar dates. |
| `collaboration_ids` | List of `Collaboration` references | Optional | Manual relationship selection | Connects verified collaborative releases. Do not copy partner names into Set free text. |
| `workflow_status` | Enum: `draft`, `scheduled`, `published`, `cancelled`, `withdrawn` | Yes | Manual state transition, validated by rules | Controls draft/public visibility. `published` requires confirmed external URLs and known format. |
| `archive_visibility` | Enum: `listed`, `unlisted` | Yes; default `listed` | Manual editorial control | Decides whether a published set appears in archive browsing. An unlisted Set may have a direct page if policy allows. Does not duplicate publication state. |
| `slug` | URL-safe string | Conditional: required when public | Derived with uniqueness check; manual correction allowed | Stable public page path; retain if title is later edited and redirect if changed. |
| `created_at`, `updated_at` | Date-time | Yes | System | Audit and cache/build invalidation. |
| `created_by`, `updated_by` | User reference/editor name | Yes where supported | System | Accountability, not editorial content. |

### Set publishing validation

- A Set can be saved as a draft with incomplete information.
- `scheduled` requires a confirmed `scheduled_release_at`, one or more linked Artist records, and known `format`. Platform URLs may still be blank before release.
- `published` requires `published_at`, both YouTube and SoundCloud URLs (per the confirmed workflow), known `format`, and a public visibility decision. Require approved artwork for featured placement; whether artwork should block archive publication remains an owner decision.
- `cancelled` or `withdrawn` content is omitted from upcoming schedule/archive. Keep the internal record and change history; do not delete it to hide it.
- A missing external link is shown as unavailable to the editor, not rendered as a broken player button.

### What is not a Set field

- Artist name, biography, profile photo, and artist links belong to `Artist`; Set links to Artist IDs.
- Artwork creator, rights, original file, dimensions, and crop variants belong to `MediaAsset`; Set links to asset IDs.
- Month key, schedule row, archive card, artist-page set list, and homepage latest/upcoming status are derived views.
- A manually toggled “featured” boolean does not belong on Set. Home feature selection is a relationship in `HomepageContent`.
- Monthly graphic files and Instagram post URLs belong to the monthly schedule publication record/asset, not every Set.
- Platform-specific social image URLs should not be duplicated as arbitrary fields on Set; attach typed media variants via `media_asset_ids`.

## 3. Artist schema

An `Artist` record is reusable. A Set refers to it; artist page details and external links are not retyped for each set.

| Field name | Data type / allowed values | Required? | Entry | What it is used for |
|---|---|---:|---|---|
| `id` | Stable opaque ID | Yes | System | Relationship target. |
| `display_name` | Text | Yes for attribution | Manual, artist-approved | Name displayed on set, archive, and artist page. |
| `page_status` | Enum: `private`, `approved_public` | Yes; default `private` | Manual/editor | Allows Set attribution without publishing an unapproved artist profile. |
| `bio` | Plain text or short rich text | Optional | Manual, artist-approved | Artist page introduction. No generated bio. |
| `external_links` | List of `{label, url}` | Optional, repeatable | Manual, artist-approved | Artist-chosen platform/site links shown once on profile. Do not copy into every Set. |
| `genre_description` | Text/tags | Optional | Manual, artist-approved | Artist’s own description, separate from controlled archive genre tags. |
| `portrait_asset_id` | `MediaAsset` reference | Optional | Manual | Approved portrait/profile art. |
| `photography_asset_ids` | List of `MediaAsset` refs | Optional | Manual | Selected approved photos associated with artist; relation must be verified. |
| `event_ids` | List of `Event` refs | No | Derived from Event artist links | Artist appearances; no duplicate manually maintained event list. |
| `set_ids` | List of `Set` refs | No | Derived from Set `artist_ids` | Published NDCR sets, newest first. Never enter these on Artist. |
| `pronouns` | Text | Optional | Manual only if artist chooses to share | Publish only with consent. |
| `location` | Text | Optional | Manual, artist-approved | Optional; do not infer from external profiles or names. |
| `created_at`, `updated_at` | Date-time | Yes | System | Audit. |

## 4. Media / Artwork schema

One `MediaAsset` record per actual file. Different social aspect ratios are distinct files/variants linked to a common artwork family; they are not separate Sets or duplicate media metadata.

| Field name | Data type / allowed values | Required? | Entry | What it is used for |
|---|---|---:|---|---|
| `id` | Stable opaque ID | Yes | System | Relationship target. |
| `file` | CMS media file or approved external file URL | Yes | Manual upload/link | Source file. Google Drive assets are not assumed available until connected/exported. |
| `asset_type` | Enum: `set_artwork`, `platform_artwork`, `artist_portrait`, `event_flyer`, `event_photo`, `video_thumbnail`, `video_artwork`, `logo`, `schedule_graphic`, `caption`, `transcript`, `other` | Yes | Manual | Indicates expected use and validation. |
| `variant_role` | Enum/text, e.g. `instagram_story`, `instagram_feed`, `soundcloud_cover`, `youtube_audio_thumbnail`, `video_artwork`, `web_primary` | Optional | Manual | Identifies why a specific crop/file exists. Use role, not ratio alone. |
| `variant_of_id` | Reference to base/family asset | Optional | Manual | Connects platform versions without implying one file fits all platforms. |
| `source_filename` | Text | Yes | System on import; editor may correct | Provenance and traceability. |
| `alt_text` | Text, or `decorative` boolean plus reason | Conditional for informative images | Manual/accessibility review | Accessible alternative; flyers also require essential event details in HTML. |
| `caption` | Text | Optional | Manual, approved | Context for editorial photography/artwork. |
| `credit` | Text/Artist/organization reference | Conditional: required when known/required by license | Manual | Creator attribution; never invent missing credit. |
| `rights_status` | Enum: `unknown`, `cleared_for_web`, `restricted`, `expired` | Yes; default `unknown` | Manual, rights owner/editor | Publishing gate. Only `cleared_for_web` is eligible for public use. |
| `rights_note` | Text, permitted uses, restrictions, expiry | Conditional if restricted/time-limited | Manual | Supports consent and license compliance. |
| `dimensions` | Width/height pixels | Optional | Derived on upload | Crop/responsive processing. |
| `mime_type`, `file_size` | Text/integer | Optional | Derived on upload | File handling and performance. |
| `focal_point` | Normalized x/y or crop guidance text | Optional | Manual | Preserves faces, text, important flyer details in generated crops. |
| `web_derivatives` | List of generated file refs/URLs | Optional | Derived after approval | Responsive compressed site images; original retained. |
| `associated_set_ids`, `artist_ids`, `event_ids`, `collaboration_ids` | Entity references | At least one for contextual asset | Manual relationship selection | Connects asset to verified NDCR content; do not match by filename alone. |
| `created_at`, `updated_at` | Date-time | Yes | System | Audit. |

Owner-confirmed platform artwork roles are Story 9:16, Instagram feed 4:5, SoundCloud 1:1, YouTube 16:9 for audio sets, and related artwork/assets for video sets. Website crops are separate approved variants or derivatives. Do not distort a source flyer to fit a web card.

## 5. Event schema

One Event is one approved upcoming or past gathering. Event facts and documentation are entered once, and artists, collaborations, and media refer to it.

| Field name | Data type / allowed values | Required? | Entry | What it is used for |
|---|---|---:|---|---|
| `id` | Stable opaque ID | Yes | System | Relationship target. |
| `title` | Text | Yes for public listing | Manual/approved | Event name. |
| `status` | Enum: `draft`, `upcoming`, `past`, `cancelled` | Yes | Manual with date validation | Controls upcoming/past/cancelled views. Do not infer cancellation. |
| `starts_at`, `ends_at` | Timezone-aware date-time | Conditional: required for public event | Manual/confirmed | Event time/order; use venue timezone where known and display clearly. |
| `venue_name`, `location_text` | Text | Conditional: required for public upcoming listing | Manual/approved | Venue/address; publish only details approved for release. |
| `description` | Text | Optional | Manual/approved | Public event context. |
| `artist_ids` | List of Artist refs | Optional | Manual | Artists confirmed for event; artist appearances derive from this relation. |
| `collaboration_ids` | List of Collaboration refs | Optional | Manual | Verified partners; do not infer from flyer logos. |
| `flyer_asset_id` | MediaAsset reference | Optional, recommended | Manual | Main event artwork, with accessible HTML event details. |
| `documentation_asset_ids` | List of MediaAsset refs | Optional | Manual | Approved event photos/video with creator credit and consent. |
| `external_event_url` | URL | Optional | Manual/verified | RSVP/ticket/partner page; no ticketing system assumed. |
| `access_info` | Text | Optional; recommended when known | Manual/venue-confirmed | Entry and accessibility details. |
| `created_at`, `updated_at` | Date-time | Yes | System | Audit. |

## 6. Collaboration schema

One Collaboration describes a confirmed NDCR relationship or joint project. A one-off shared bill can remain only on its Event if NDCR does not want a separate collaboration story.

| Field name | Data type / allowed values | Required? | Entry | What it is used for |
|---|---|---:|---|---|
| `id` | Stable opaque ID | Yes | System | Relationship target. |
| `name` | Text | Yes for public entry | Manual, partner-approved | Public relationship/project name; use approved partner naming. |
| `partner_names` | List of text or Partner refs if later justified | Yes | Manual, partner-approved | Identifies involved groups. Do not auto-create from artwork logos. |
| `summary` | Text | Conditional: required for public story | Manual, NDCR and partner-approved where applicable | Explains the specific collaboration without overclaiming ongoing status. |
| `status` | Enum: `draft`, `current`, `past` | Yes | Manual | Verified relationship state. |
| `date_range` | Optional start/end dates | Optional | Manual/confirmed | Time context for the relationship/project. |
| `external_links` | List of `{label, url}` | Optional | Manual, partner-approved | Reciprocal links. |
| `event_ids`, `set_ids`, `artist_ids` | Lists of entity refs | Optional | Manual | Explicit links to related work. |
| `media_asset_ids` | List of MediaAsset refs | Optional | Manual | Approved co-branded art/documentation. |
| `created_at`, `updated_at` | Date-time | Yes | System | Audit. |

## 7. Monthly Schedule and programming settings

### 7.1 Monthly Schedule: generated website view plus optional social-publishing record

The website schedule is generated by grouping scheduled Sets by local release month. Since NDCR also prepares an Instagram schedule graphic, V1 may optionally keep a small `MonthlySchedulePublication` record for that artifact/post; it references the same Set records.

| Field name | Data type / allowed values | Required? | Entry | What it is used for |
|---|---|---:|---|---|
| `month_key` | `YYYY-MM` | Yes for displayed month | Derived from `scheduled_release_at` in Asia/Kolkata | Group key for Set rows. |
| `display_label` | Localized month/year string | Yes for display | Derived | Schedule heading. |
| `set_ids` / schedule rows | Set refs plus derived date, time, artist, format, status | Derived | Derived, chronological | Website schedule; not a second content entry. Cancelled/withdrawn display follows a policy. |
| `schedule_graphic_asset_id` | MediaAsset ref | Optional | Manual | Links the prepared Instagram graphic if retained; not required for site schedule. |
| `instagram_post_url` | URL | Optional | Manual after Instagram post | Reference to manually published post; no Instagram API publishing assumed. |
| `prepared_at`, `published_at` | Date-time | Optional | Manual/system timestamp | Operational history if the editor wants it tracked. |
| `status` | Enum: `not_started`, `in_preparation`, `published` | Optional; needed only if tracking social workflow | Manual | Tracks the Instagram schedule graphic without changing Set data. |

Set IDs, names, artist/date/time/format are derived, not editable on the monthly schedule. If a schedule graphic disagrees with a Set, correct the canonical Set and regenerate/replace the graphic in the existing social workflow.

### 7.2 Shared Programming Settings (one configuration record)

This is not a record entered for every Set. It drives slot suggestions and default format calculation.

| Field name | Data type / allowed values | Required? | Entry | What it is used for |
|---|---|---:|---|---|
| `timezone` | IANA timezone string; confirmed `Asia/Kolkata` | Yes | Set once/configuration | Date/time interpretation/display; never duplicated per Set. |
| `release_weekday` | Weekday enum; confirmed `Thursday` | Yes | Set once/configuration | Suggest weekly slots. |
| `release_local_time` | Time; confirmed `18:00` | Yes | Set once/configuration | Suggest release time/display. |
| `cadence` | Enum/interval; confirmed `weekly` | Yes | Set once/configuration | Generates the next Thursday slot. |
| `format_cycle` | Ordered list `[video, audio]` | Yes | Set once/configuration | Alternation rule. |
| `format_cycle_anchor_set_id` | Reference to first verified cycle slot/set | Conditional: required before format auto-derivation | Manually confirmed | Establishes phase; do not infer from #070 or calendar week. |
| `format_cycle_anchor_format` | Enum `video`/`audio`; sequence starts video but specific historic anchor remains unverified | Conditional | Manually confirmed | Format of anchor slot. |
| `skip_policy` | Enum `advance_by_slot`, `advance_by_published_set`, `manual_decision` | Required before automation | NDCR decision | Defines how skipped/postponed Thursday affects next format. |

Monthly web schedule can be displayed without a separate content record. The optional publication record only tracks the existing Instagram graphic/post and does not create a required monthly web-admin task.

## 8. Homepage / Featured Content schema

Homepage modules point to canonical records. The editor curates only content that benefits from selection; latest/upcoming items are derived.

| Field name | Data type / allowed values | Required? | Entry | What it is used for |
|---|---|---:|---|---|
| `homepage_id` | Singleton ID | Yes | System | One V1 homepage configuration. |
| `featured_broadcast_target_id` | Set or separately confirmed live-broadcast reference | Optional | Manual selection | Home lead. In V1 a Set can represent a featured weekly release. Do not label `Live` unless a genuine stream is confirmed. |
| `featured_broadcast_label` | Enum `featured`, `latest`, `live` | Conditional | Manual/editorial; `live` requires verified stream | Accurate status, so a scheduled set is not shown as live. |
| `featured_broadcast_active_from`, `featured_broadcast_active_until` | Date-time | Optional | Manual | Time-bounds one-off feature; expired selection gets safe fallback. |
| `latest_set_id` | Set ref | Yes when at least one published Set exists | Derived | Latest published Set using `published_at`. |
| `upcoming_set_id` | Set ref | Optional | Derived | Earliest approved future Set by `scheduled_release_at`, excluding cancelled/withdrawn. |
| `upcoming_event_id` | Event ref | Optional | Derived | Earliest approved upcoming Event, excluding cancelled. |
| `selected_photography_asset_ids` | Ordered MediaAsset refs | Optional | Manual editorial selection | Homepage photography selection with rights/credits checked. |
| `featured_artist_ids` | Ordered Artist refs | Optional | Manual editorial selection | Selected artists; details and sets populate from Artist records. |
| `module_order` | Ordered list of module keys | Optional; approved IA default | Manual, infrequent | Editorial pacing without altering entity data. |
| `intro_or_announcement` | Text with start/end time | Optional | Manual/approved | Temporary homepage copy, hidden after expiry. |
| `updated_at` | Date-time | Yes | System | Audit. |

## 9. Relationship map

```text
ProgrammingSettings
  ├── generates Thursday 18:00 IST suggestions
  └── derives default Set.format from verified anchor and skip policy

Artist 1 ── 0..many Sets
Set 1 ── 1..many Artists (supports B2B/multi-artist sessions)
Set 1 ── 1 scheduled slot ── 1 derived Month
Monthly Schedule ── groups 0..many Set records (no duplicate rows)
Set 1 ── 0..many MediaAssets
Artist 1 ── 0..many MediaAssets

Event 1 ── 0..many Artists; Artist 1 ── 0..many Events
Event 1 ── 0..many Collaborations; Collaboration 1 ── 0..many Events
Set 1 ── 0..many Events / Collaborations
Event / Collaboration ── 0..many MediaAssets

HomepageContent ── references Set / Event / selected Artists / MediaAssets
```

## 10. One Set entry: automatic data flow

1. **Create/plan one Set.** The editor enters a title, selects/creates Artist record(s), and chooses the next weekly slot. The system suggests Thursday at 18:00 IST and a format based on the confirmed cycle anchor.
2. **Attach facts and approved media.** Confirm genres, optional description, primary artwork, platform variants, and real event/collaboration relations. Check rights and credits on MediaAsset records.
3. **Publish externally.** The editor creates platform artwork and publishes on YouTube/SoundCloud through existing workflows. The website stores the relevant asset references and canonical URLs; it does not publish there in V1.
4. **Confirm release.** After both external releases are available and links work, enter URLs and actual publication time, preview, and mark the Set published.
5. **Derive site views.** The Set appears in Radio/Archive, each linked artist’s set list, and its monthly schedule. Format drives audio/video presentation. Latest/upcoming and archive filters refresh automatically.
6. **Refresh Home without duplication.** Latest Set and Upcoming Set are derived. Upcoming Event comes from approved Event records. Featured broadcast/artists/photos remain editorial references, changed only as desired.
7. **Correct the source once.** Update canonical record; all views read the change. Keep audit history. No manual copies on separate pages.

```text
One Set + linked Artist + approved Media + verified platform URLs
        ├── Archive card + session page
        ├── Artist page set list(s)
        ├── Monthly schedule entry
        ├── Artist / genre / date filters
        ├── Latest or Upcoming Set homepage module
        └── Audio/video badge + available YouTube/SoundCloud actions
```

## 11. Never duplicate, derive automatically, retain editorial control

### Never duplicate

- Artist name, bio, external links, and portrait metadata on every Set.
- Set title, date/time, format, artwork, and URLs as separately editable copies on Archive, Artist, Schedule, and Home.
- Monthly schedule artist/date/time rows outside Set records.
- Schedule-derived format on the monthly social record as a second source; social graphic is an output/reference asset.
- Asset creator, rights, source filename, and credit in each page’s free text.
- Event/Collaboration names across pages; use relationships.
- Global timezone, release weekday/time, and alternation rule on each Set.

### Derive automatically

- Month key and schedule rows from `scheduled_release_at`.
- Next slot from weekly cadence; format from cycle anchor/slot after policy is confirmed.
- Archive listing, artist-to-set lists, counts, and artist/genre/date facets.
- Latest published Set, upcoming Set, next Event, default Home links.
- Audio/video badge and available play actions from `format` and verified URLs.
- Stable IDs, timestamps, file dimensions/size/type, responsive derivatives, canonical page paths, and default metadata.
- Artist appearances from Event links and collaboration content from explicit relations.

### Keep under human editorial control

- Artist display names, profile approval, bios, genres, links, pronouns/location if shared, and representation images.
- Set title/description, set-number assignment, artist credits, platform URLs, release confirmation, visibility, and format/date overrides.
- Whether a Set/Event/Collaboration relationship is real and appropriate to show.
- Rights, credits, consent, alt text, captions, focal points, and web-use approval.
- Featured broadcast wording, artists, photography, temporary announcements, and Home order.
- Event changes/cancellations, venue/access details, and partner-approved collaboration copy.

## 12. V1 fields to defer

Do not add these to the required V1 authoring form:

- Track-by-track tracklists, timestamps, and automated music recognition.
- Performer role taxonomy beyond linked artist(s), unless inventory proves it necessary.
- Artist appearance timeline, location map, network graph, or directory facets beyond name/set relationships.
- Audience/play counts, reach metrics, analytics score, popularity ranking, recommendations.
- Accounts, favorites, comments, subscriptions, submissions, ticketing, merch, newsletter, CRM.
- Auto-posting to YouTube, SoundCloud, Instagram; automatic social-art generation/export.
- Multiple station channels, continuous live-stream object, live now/next schedule, or persistent player until an actual live service/operator is confirmed.
- Separate Series entity until recurring named series are validated; at most use an optional label if needed.
- First-party audio/video hosting/transcoding/downloads before rights, storage, bandwidth, support are decided.
- Per-set SEO overrides, detailed workflow assignment queues, and localization variants before languages/needs are known.

## 13. Example Set record from available references

The September schedule reference visibly lists `DAKU`, `03.9.26`, and `18:00 IST`. This is a realistic planned-slot example. It does **not** establish a set number, title, format, external release URLs, individual artwork, or actual publication. The example is therefore incomplete and not publish-ready; unknowns are explicit.

```yaml
id: [generated by CMS; not assigned]
set_number: unknown
title: unknown
artist_ids:
  - unknown # artist record must be created/verified with display_name DAKU
description: unknown
scheduled_release_at: 2026-09-03T18:00:00+05:30
published_at: unknown
format: unknown
format_override_reason: not_applicable
format_cycle_slot: unknown
genre_tags: unknown
youtube_url: unknown
soundcloud_url: unknown
primary_artwork_id: unknown
media_asset_ids: unknown # no individual DAKU set artwork was verified in this reference
duration_seconds: unknown
event_ids: unknown
collaboration_ids: unknown
workflow_status: unknown # the schedule alone does not prove release status
archive_visibility: unknown
slug: not_assigned
created_at: generated_on_record_creation
updated_at: generated_on_record_update
```

`DAKU` and the planned local slot are supported by `docs/references/Sept2026-06.jpg`. The schedule itself prints `18:00 IST`; the `+05:30` offset is its standard timezone representation. All other unknowns remain unresolved. Verify platform releases and canonical metadata before adding a real record.

## 14. Decisions required before implementation

1. Confirm the first verified format-cycle anchor and what happens when a slot is skipped, delayed, or cancelled.
2. Confirm whether every released Set must have both working YouTube and SoundCloud URLs before website status becomes published (this proposal assumes yes, from the supplied workflow).
3. Decide whether public archive artwork blocks publication or is only required for featured placement; rights clearance is mandatory for any image used.
4. Approve a controlled genre vocabulary or start with free text and defer filtering until labels are normalized.
5. Decide whether to track Instagram schedule post status in optional `MonthlySchedulePublication` or leave that workflow outside the CMS.
6. Confirm title and public set-number conventions; do not infer title from artist or numbering.
7. Confirm homepage feature labels and fallback policy when no upcoming set/event or selected artist/photo exists.
8. Choose storage/CMS only after one real-set trial, export/backup, account ownership, and cost review. No vendor is selected here.

## 15. Recommended next step after schema approval

Run a no-code workflow prototype with one verified Set and its Artist, platform artwork/links, plus one schedule month and one event/collaboration. Enter the proposed fields in a trial structured editor/CMS and check that archive, artist, schedule, and Home outputs work without repeated fields. Revise from that walkthrough. Only after the editor flow, rights gates, format anchor, and storage choice are approved should implementation start with the data model/adapter—not the website pages.

## 16. Reference files reviewed

- `docs/ndcr-content-architecture.md`
- `docs/ndcr-discovery.md`
- `docs/ndcr-design-direction.md`
- `docs/references/DEDHSAAL.pdf`
- All 20 image files in `docs/references/`, including `Sept2026-02.jpg`, `Sept2026-03.jpg`, `Sept2026-06.jpg`, and the four platform-specific artist artwork files.
