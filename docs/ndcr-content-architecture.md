# NDCR Content Architecture and Publishing System (V1)

**Status:** Proposed architecture for approval; no website or CMS implementation started  
**Date:** 22 October 2026  
**Purpose:** Define one maintainable content source for NDCR’s website so a weekly set is entered once and all relevant site views update automatically.

## 1. Product and operating assumptions

The working product is a cultural platform, music archive, and community home. It is not a database-first archive and it should not assume a continuous linear stream.

The following publishing facts are **confirmed by the owner in the request**:

- Exactly one new set is released every Thursday at 18:00 India Standard Time (IST).
- Set formats alternate weekly: video, audio, video, audio, and so on.
- Each set is released on YouTube and SoundCloud.
- A monthly schedule is prepared about a day before the month begins and currently published on Instagram.
- Social artwork is prepared in platform formats: Instagram Story 9:16, Instagram feed 4:5, SoundCloud 1:1, and YouTube 16:9 for audio sets. Video sets have related video artwork/assets.
- The current content person is one person, so weekly website upkeep must not require editing multiple pages by hand.

The local deck and visual examples provide supporting references, but the operating facts above come from this owner confirmation. The deck’s `80+` set count and previously stated metrics should still be reconciled against platform inventories before becoming public website claims.

## 2. Design goals for the publishing system

1. **One canonical record per set.** Enter a set once; the archive, artist pages, monthly release schedule, and latest/upcoming modules read that record.
2. **Manual editorial control where it adds value.** A person chooses selected photography and featured artists. Mechanical lists and date relationships are derived.
3. **No website-side social posting in V1.** YouTube, SoundCloud, and Instagram remain separate publishing workflows. The website links to/embed approved media after each platform publish.
4. **Plan ahead without pretending a planned set is published.** A schedule can show planned metadata, while public set pages and listening links stay hidden until the record is released and playable.
5. **Represent exceptions explicitly.** A postponed set, a skipped Thursday, or a format-order change must not silently corrupt every later format. An explicit override should have a reason and editor.
6. **Keep operations feasible for one content editor.** Use picklists, required-field checks, automatic relationships, reusable artist records, and previews. Avoid duplicate entry across five different pages or social channels.

## 3. V1 content model

Field names below are conceptual labels, not a prescribed database schema. “Required” means required for the relevant record to be valid/publishable; some planning records can be incomplete while in draft.

### 3.1 Set / Session

One NDCR mix, performance, or recorded session. This is the central publishing record.

| Field | Requirement | Entry / derivation |
|---|---|---|
| Stable ID | Required; immutable unique identifier | Generated automatically. Do not use the artist name or display title as an ID. |
| Set number / public code | Required for a numbered NDCR set if that numbering is confirmed | Manually confirm from NDCR’s sequence; do not assume every upload gets a number or invent missing numbers. |
| Title | Required | Manually entered/approved; preserve NDCR’s chosen spelling/capitalization. |
| Artist(s) | Required; one or more linked Artist records | Select existing Artist record or create one. Allow multiple artists for B2B/collaborative sessions. |
| Scheduled release date/time | Required for a planned weekly release | Automatically suggested as a Thursday 18:00 Asia/Kolkata slot; editor confirms/edits only for an exception. Store unambiguously with timezone. |
| Actual published date/time | Required when published | Enter or reliably import/confirm after platform release. Do not overwrite planned date. |
| Format | Required | Auto-derived from the alternating sequence using the agreed anchor; editor can explicitly override with reason. Controlled values: `video` or `audio`. |
| Publication status | Required | Controlled workflow: `draft → scheduled → published`; optional `postponed`/`cancelled`/`withdrawn`. Public visibility derives from status. |
| Genre(s) | Recommended for archive filtering | Manually selected from an NDCR-approved vocabulary; multiple allowed. Do not auto-infer from artist names or external platforms. |
| Summary / description | Optional, recommended | Manually supplied/artist-approved. Keep copy distinct from text burned into social artwork. |
| Series / programme | Optional | Linked controlled record only if NDCR identifies recurring series. Do not create a series field to imply a format not in use. |
| Featured artwork | Required for polished public set display | Link an approved media asset and its intended web crop or a suitable approved source image. |
| YouTube URL | Required for the platform release; may be empty before release | Manually add/confirm after upload. Use exact canonical URL. |
| SoundCloud URL | Required for the platform release; may be empty before release | Manually add/confirm after upload. Use exact canonical URL. |
| Duration | Optional | Manually enter or import/verify. |
| Tracklist / timestamps | Optional | Only include when provided and cleared; not a publication blocker. |
| Captions / transcript | Optional per session, recommended for speech | Link approved captions/transcript when available. |
| Related event(s) / collaboration(s) | Optional | Link existing records; never infer a relationship from a matching date. |
| Search slug / canonical page URL | Required when published on site | Generated from stable ID/title, with collision check; remain stable if title changes. |
| SEO/social summary and share image | Optional; sensible default can be derived | Generate from approved title, artist, and approved image; editor can review or override. |
| Record owner / last reviewed | Required for workflow | Current content editor and timestamp can be system-recorded. |

**Automatically derived:** archive card and detail page; audio/video label and icon; artist-page relationship; month grouping; chronological latest/upcoming status; monthly schedule inclusion; social/site links and playback buttons; site search facets; homepage latest/upcoming candidates; default page title and share metadata.

**Manually entered/confirmed:** content truth (artist(s), title, genre, summary), artwork and rights, platform URLs, actual published state/time, and any exception to cadence/format. Set publication on YouTube/SoundCloud remains outside the website system.

**Playback behavior:** The set page should expose the available approved YouTube and/or SoundCloud player/link. It must not assume all sets have both formats/files available at all times. No autoplay. The website should describe a video set vs audio set from the format field, not from the presence of an arbitrary media URL.

### 3.2 Artist

One person or artist identity participating in one or more sets. Create a reusable record once and link it to future sets.

| Field | Requirement | Entry / derivation |
|---|---|---|
| Stable ID | Required | Generated automatically. |
| Display name | Required | Manually entered using the artist’s approved name and casing. |
| Page status | Required | Draft/approved/hidden. An artist record can exist for set attribution without a public profile page. |
| Short bio / intro | Optional | Artist-approved text only. |
| Portrait / profile artwork | Optional | Link approved Media asset; preserve credit and usage terms. |
| External links | Optional, repeatable | Manually provide label + URL (e.g. artist-chosen platforms); validate URL, do not scrape. |
| Genre/style description | Optional | Artist/editor supplied; avoid forced taxonomies or unsupported claims. |
| Photography / appearances | Optional | Links to approved Media and Event records; only where the relationship is verified. |
| Pronouns, location, languages | Optional and sensitive/contextual | Publish only when the artist chooses to share and approves. |
| Related sets | Derived | Automatically list published sets linked to the artist, newest first. |

**Automatically derived:** artist page (when approved), set count, linked published set list, and archive filter link. Do not manually re-enter set links on an artist page.

### 3.3 Monthly Schedule

The monthly schedule is a **derived view**, not a second set of manually maintained set records. It groups all planned/published Set records whose scheduled release date falls within that calendar month.

| Field | Requirement | Entry / derivation |
|---|---|---|
| Month key (YYYY-MM) | Required | Derived from scheduled release date in Asia/Kolkata. |
| Display label | Required | Generated (e.g. month + year); spelling/localization can be configured once. |
| Set entries | Derived | All scheduled, published, or explicitly postponed Sets for the month, ordered by release date. Cancelled/withdrawn entries follow a decided display rule. |
| Publication state | Required if a standalone monthly page is published | Derived from schedule state; avoid a manually copied version. |
| Artwork / social schedule graphic | Optional | Existing Instagram monthly artwork is a separate asset; it can be linked to the month. Do not require this image for the website schedule. |

**Automatically derived:** Thursday slots, date/time, artist display name, format, and links from Set records. If the visual schedule is generated on the site, render the data at request/build time. The site may show the monthly schedule without requiring a separate monthly content entry.

**Important scope distinction:** V1 generates the website schedule. It does not generate/publish Instagram graphics or schedule Instagram posts. A later export template could reuse the same data, but it must be a separate approved workflow.

### 3.4 Event

One NDCR event or documented gathering. Past documentation remains browsable; an upcoming listing requires reliable current information.

| Field | Requirement | Entry / derivation |
|---|---|---|
| Stable ID | Required | Generated automatically. |
| Event name | Required | Manually approved. |
| Status | Required | Draft / upcoming / past / cancelled. Past can be derived from end date, but editorial status can preserve cancellations. |
| Start/end date and local time | Required for a public listing | Manually confirm with timezone/location; do not infer from flyer alone if details are unclear. |
| Venue / location | Required for an upcoming public listing | Manually entered with approved public detail; privacy-sensitive location can be omitted until approved. |
| Description | Optional | Manually supplied and approved. |
| Artists | Optional, repeatable linked Artist records | Manually relate artists confirmed for the event. |
| Collaborations | Optional, repeatable linked Collaboration records | Manually relate confirmed partners. |
| Flyer | Recommended | Link approved original flyer Media asset; transcribe essential event details as accessible text. |
| Event photography / video | Optional, repeatable | Link approved documentation assets with photographer/creator credits and consent. |
| RSVP/ticket/external event URL | Optional, repeatable | Manually add and confirm link/status. |
| Access information | Optional, strongly recommended when available | Manually provide approved venue accessibility and entry info. |

**Automatically derived:** upcoming vs past display (subject to cancellation/manual status); event cards; related artist/collaboration links; homepage upcoming event candidate. No ticketing or RSVP workflow is assumed.

### 3.5 Collaboration

One reciprocal or co-presented relationship between NDCR and another collective, station, platform, or organization. Keep it separate where the relationship spans more than one event or set; for a one-off credit, a linked event may be sufficient.

| Field | Requirement | Entry / derivation |
|---|---|---|
| Stable ID | Required | Generated automatically. |
| Display name / partner name(s) | Required | Use partner-approved naming. |
| Relationship summary | Required for a public collaboration story | Manually approved by NDCR and, where appropriate, partner. |
| Status / date range | Required | Manually confirm active/past; avoid implying an ongoing partnership after one event. |
| Partner links | Optional, repeatable | Partner-approved URLs. |
| Related events, sets, artists | Optional, repeatable | Explicit links to content records. |
| Artwork / documentation | Optional | Approved Media assets and credits. |

**Automatically derived:** collaboration page/section when approved, and related event/set/artist connections. A list of partners should not be inferred from an old flyer or deck without current approval.

### 3.6 Media / Asset

Reusable record of an artwork, photograph, video thumbnail, logo, or document that has source and rights information. Files should not be repeatedly uploaded for each page.

| Field | Requirement | Entry / derivation |
|---|---|---|
| Stable ID | Required | Generated automatically. |
| File or external URL | Required | Upload/link the approved source. Do not assume the Drive library is available locally. |
| Asset type | Required | Controlled values such as artwork, portrait, event flyer, event photo, logo, video thumbnail, schedule graphic, document. |
| Source/original filename | Required | Record on import. |
| Creator / photographer / designer | Required if known; otherwise mark unknown | Manually record, do not guess. |
| Usage permission / rights status | Required before public use | Record owner, permitted uses, and any expiry/restriction; unknown means not publishable. |
| Alt text / caption / credit line | Required as relevant | Manually write/accessibility review; decorative images can be marked decorative with reason. |
| Associated entity links | Required for contextual assets | Link to Set, Artist, Event, Collaboration, or site identity. |
| Crop/aspect variants | Optional, repeatable | Link actual platform-specific artwork variants, not just a ratio guess. |
| Dimensions/format/size | Derived | Extract on upload/import. |
| Web derivatives | Derived after rights approval | Generate responsive/compressed versions where the chosen platform supports it. Keep original intact. |
| Focal point / crop guidance | Optional | Manual for faces/text-sensitive flyers; controls responsive crop. |

**Known platform artwork ratios from owner:** Instagram Story 9:16; Instagram post 4:5; SoundCloud 1:1; YouTube 16:9 for audio sets; video sets have relevant video art/assets. These are source/publishing variants, not an assertion that a website should show all variants. For web cards, use an approved, purpose-fit crop/derivative and keep text-essential flyers legible.

### 3.7 Homepage / Current Content

The homepage is a set of editorial modules that pull from the canonical records. It is not a place to retype set, event, or artist details.

| Module / field | Required behavior | Entry / derivation |
|---|---|---|
| Current / featured broadcast | Select a Set or approved live stream record. Display an explicit `Live`, `Featured`, or `Latest` state. | Manually select a featured item when editorially desired; if none, fall back to latest published set. Never infer `Live` from a scheduled release. |
| Latest set | Latest published Set by actual publication timestamp (fallback scheduled time only if policy allows) | Automatically derived. |
| Upcoming set | Earliest future scheduled Set that is public/approved and not cancelled/withdrawn | Automatically derived. |
| Upcoming event | Earliest upcoming approved Event | Automatically derived; hide module if none exists. |
| Selected photography | One or more manually selected approved Media assets, optionally linked to an Event/Artist | Manual editorial selection. |
| Featured artists | One or more manually selected approved Artist records | Manual editorial selection; profile/set details auto-populate. |
| Module order / visibility | Configurable defaults; only change when editorial need arises | Set once as page configuration; no weekly editing required. |
| Optional intro/announcement | Approved short-lived copy with start/end/expiry | Manual and optional; hide after expiry. |

The homepage should feel editorial and alive without requiring the owner to update several pages every Thursday. The set records drive date-sensitive content; selected photography and featured artists are an occasional editorial choice, not a weekly obligation.

## 4. Entity relationships

```text
Programming settings
  └── define recurring Thursday 18:00 IST slots and alternating format sequence

Artist 1 ── 0..many Sets
Set 1 ── 1..many Artists (supports B2B/collaborative sessions)
Set 1 ── 1 scheduled slot / 1 derived Month
Month 1 ── 0..many Sets (Monthly Schedule is a grouped view, not duplicated records)
Set 1 ── 0..many Media assets (artwork, thumbnail, video artwork)
Artist 1 ── 0..many Media assets (portrait, photography)

Event 1 ── 0..many Artists
Artist 1 ── 0..many Events
Event 1 ── 0..many Media assets (flyer, documentation)

Collaboration 1 ── 1..many partner identities
Collaboration ── 0..many Events / Sets / Artists / Media assets

Homepage modules ── reference Set / Event / Artist / Media records
```

**Set-to-artist:** allow one or more artists rather than enforcing one artist per set; the examples include joint appearances. A join/link table may be used internally if the chosen CMS needs it.

**Set-to-month:** each set belongs to one scheduled release month, derived from its scheduled time in `Asia/Kolkata`. A set’s actual publication date can be separately stored when delayed.

**Event-to-artists/collaborations:** many-to-many relationships, since an event can feature many artists and partners, and a contributor can appear at multiple events.

**Homepage-to-content:** store references to records, not duplicate titles, dates, artwork, or URLs. Derived modules resolve current data each time the site is published/rendered.

## 5. Thursday cadence and format alternation

Represent the weekly cadence in a single `Programming Settings` record or equivalent configuration:

```text
timezone: Asia/Kolkata
release weekday: Thursday
release local time: 18:00
cadence: weekly
format cycle: VIDEO → AUDIO → repeat
cycle anchor: first confirmed slot and its format
```

The schedule generator creates Thursday slot suggestions. For each slot, format is derived from its chronological position relative to the **explicitly recorded cycle anchor**. The rule should not guess an anchor from a calendar week number or set number unless NDCR confirms the relation. The first confirmed anchor is Video, per the supplied sequence; the anchor date must be selected from NDCR’s verified publishing history before calculation is enabled.

An editor may override an individual slot’s format or move/cancel a date. Require a short exception reason and retain the original planned value in history. If a Thursday is skipped or postponed, define whether the next released set takes the next format in the sequence or preserves the planned slot’s format. That policy needs NDCR approval; the system must not silently shift the cycle.

For planning the next month, generate future Thursday slots in local time and let the editor attach the artist/set record. A monthly schedule is then generated from those records. The Thursday 18:00 time should display as `18:00 IST` (or a user-approved equivalent) and the stored timestamp should preserve timezone semantics.

## 6. One-set-entry automation / data flow

1. **Plan:** The content editor creates a Set draft, selecting/creating the Artist record(s). The system suggests the next Thursday 18:00 Asia/Kolkata slot and format based on the confirmed cycle anchor.
2. **Prepare:** The editor adds/links approved artwork and platform artwork variants, genres, approved summary, and intended external links when available. Required-field validation warns about missing items. The record remains draft/scheduled; no public published state is implied.
3. **Publish elsewhere:** The editor publishes the audio/video on YouTube and SoundCloud through their existing workflows, then pastes and checks each canonical URL. Website automation does not upload or publish to those services in V1.
4. **Release:** At the release time (or when the editor confirms both platform releases), the Set status becomes published. Prefer an explicit publication confirmation for V1 rather than a background timer that could expose broken links.
5. **Derive:** The published Set automatically appears in the archive, the linked artist page(s), the monthly schedule, and search/filter results. Format determines audio/video badges and playback presentation; available URLs determine which external play/listen actions appear.
6. **Refresh homepage:** Latest Set updates from published records; Upcoming Set is the nearest approved future set; upcoming event is selected from approved future Event records. Featured broadcast/artist/photo modules use editorial references or safe fallbacks.
7. **Generate page metadata:** Set/artist/event page titles, canonical URLs, social preview defaults, and structured relationships derive from the records. An editor can override concise descriptions or share artwork where needed.
8. **Handle correction:** If a date, title, URL, or asset changes, update the source record once. All views resolve the update; the CMS keeps an edit history. Withdrawn content is removed from public listings while its internal record can remain for audit.

```text
One Set record + linked Artist + approved Media + verified platform URLs
        ├── Archive card + session page
        ├── Artist page set list(s)
        ├── Monthly schedule entry
        ├── Artist / genre / date filters
        ├── Latest or Upcoming Set homepage module
        └── Correct audio/video badge + available YouTube/SoundCloud links
```

## 7. Recommended V1 storage approach

### Recommendation: a lightweight structured CMS with relational references and media

For a non-developer who is the sole content editor, the best-fit V1 is a small, hosted CMS that provides a friendly editor, structured content types, reusable references, media library, draft/published status, preview, and a simple webhook/API for the future website. Keep the site’s generated pages static or cached where practical. The editorial interface must let the owner add a Set without hand-editing files or re-entering information on the Artist, Archive, Schedule, and Home pages.

An exact CMS/vendor and hosting choice should be selected after reviewing budget, account ownership, export/backup, content volume, and the eventual framework. This is a workflow recommendation; it does not add a technology or dependency to the current repository.

### Options compared

| Option | Benefits | Tradeoffs for NDCR | V1 fit |
|---|---|---|---|
| **Structured local data files (JSON/YAML)** | Simple, portable, transparent, versionable; easy for developers to automate relationships and generate site views. | A content person edits raw structured files or relies on developer help; spelling/formatting errors can break data; uploads and previews need extra workflow; Git is not a friendly weekly editorial UI. | Good prototype/import format and fallback export, but not the best day-to-day editor for a solo non-developer. |
| **Markdown/content files** | Comfortable for long artist/event/about prose; readable in a text editor; works well with static generation and Git history. | Relational sets/artist links, multiple media variants, status validation, scheduled slots, and filter metadata become awkward across hundreds/thousands of records; still requires a friendly CMS layer for non-developer use. | Useful for prose if needed, not ideal as the sole normalized source for this structured system. |
| **Lightweight headless CMS** | Structured forms; relations and validation; media library; preview/draft states; reusable records; can generate archive, artist, and month views; editor can work without touching code. | Needs initial developer setup, vendor/account decision, ongoing subscription/hosting review, backup/export plan, and possibly small custom UI for the workflow. | **Recommended**, provided records are exportable and editorial flow is tested with a real weekly set before launch. |
| **Airtable / spreadsheet-style relational database** | Familiar grid/forms; easy bulk inventory/import; linked record types and views; approachable for one editor. | API limits/plans and attachment behavior need review; relationships and validation may be less expressive; a separate website sync/build integration is required; risk of operational dependence on one account/vendor. | Strong content audit tool and viable early CMS if it supports required references, status validation, uploads, preview, and stable export. Evaluate as the most approachable alternative. |
| **Notion-style workspace database** | Familiar document/workspace editing; good for notes and lightweight editorial planning. | Relational integrity, content validation, media delivery, publishing preview, query/sync behavior, and API coupling may be weaker than a purpose-built CMS for a production archive. | Better for internal research/editorial notes than the canonical production source unless a prototype proves the needed publishing workflow. |

### Practical selection criteria

Before choosing a vendor, trial the process with a real recent set and one event: create/edit artist, attach platform links and artwork, preview the page, generate archive/schedule/home outputs, withdraw/restore a record, export all content and media references, and verify no field had to be entered twice. Confirm the account and billing owner, accessible editor, backups, data export, media storage costs, API/build behavior, and simple migration path.

At 100s or 1000s of sets, a structured CMS with indexed fields and generated views scales more cleanly than manually maintained page files. The set records remain portable if stable IDs, normalized relationships, controlled values, and regular exports/backups are part of V1.

## 8. Manual responsibilities vs automatic responsibilities

### The content editor should still do manually

- Choose/confirm the artist(s), title, set number, genre(s), description, and approved representation.
- Prepare and publish platform-specific artwork and media through the existing YouTube/SoundCloud/Instagram workflows.
- Upload/link the approved web image/artwork and record creator, credits, permission, crop sensitivity, alt text, and other required asset details.
- Publish the actual session on YouTube and SoundCloud, then paste and verify the canonical URLs.
- Review planned release date/time and format suggestions; resolve exceptions, postponements, skipped weeks, or broken links.
- Approve publication status after the external release is actually available.
- Create/approve artist profile content and external links with the artist; no bios or links should be generated from scraping.
- Add confirmed event details and mark cancellation/changes; upload approved flyer/documentation and access notes.
- Approve collaboration story/partner naming and credits.
- Occasionally select featured artists and photography for Home; optionally choose a featured set/broadcast label.
- Review website preview before publishing, especially image crops, artist names, event dates, and audio/video playback.

### The website/CMS should handle automatically

- Suggest the next Thursday at 18:00 IST and calculate the default alternating format from the confirmed anchor.
- Keep status, format, date, and required-field validation consistent.
- Derive the month and build the website monthly schedule from set records.
- Place each published set in the archive and linked artist page(s), once each.
- Build artist/genre/date filters and search facets from normalized metadata.
- Resolve the latest published set and next approved upcoming set without editing homepage copy.
- Surface the nearest upcoming event and transition past events according to a clear rule.
- Show correct audio/video treatment and only links/players that exist and have been verified.
- Generate stable pages, links, page titles, default social metadata, and responsive image derivatives.
- Apply approved changes consistently across all views and keep editor history/last-updated data.
- Hide drafts/cancelled/withdrawn content from public areas by status; provide a safe fallback when a homepage module has no valid item.

## 9. Risks and open decisions

1. **Alternation anchor and skipped releases:** Which actual Thursday/format anchors the current cycle? If a week is skipped or rescheduled, does format advance by intended weekly slot or actual release? Decide before automation.
2. **Future planning vs confirmation:** How far ahead should planned set records become visible as “Upcoming Set” or monthly schedule entries? Does the website display a monthly schedule page, a home strip, or both?
3. **What is “broadcast”:** The cadence confirms a weekly set release, not a continuous live stream. Should the Home label say featured set, weekly broadcast, or something else? Do not introduce live/on-air language without confirmation.
4. **Artist relation cardinality:** Support multiple artists per set; confirm whether there are credited hosts, guests, collectives, or pseudonyms needing separate roles.
5. **Genre vocabulary:** Confirm the allowed terms and who maintains them. Free text makes filters inconsistent; restrictive fixed tags may flatten artists’ descriptions.
6. **Artist pages:** Is every artist page public, or only those with approved material? What minimum profile content/permissions are needed?
7. **Platform content availability:** Are all sets available on both platforms, and are embeds permitted/reliable in all intended regions? What should the user see when one platform link is missing?
8. **Rights and identity:** Artwork, event photos, embedded video/audio, artist text, logos, and partner marks need documented permission and credits. The larger Google Drive library is not yet inventoried or available locally.
9. **Monthly schedule design workflow:** The current social schedule is manually prepared about one day before the month. Decide whether the CMS should show a draft schedule earlier, and whether a future export can produce Instagram aspect ratios without adding weekly work.
10. **Storage choice and ownership:** Confirm budget, account owner, subscription tolerance, backups/export frequency, editor access, vendor lock-in requirements, and who can maintain the site integration.
11. **Homepage curation cadence:** Decide how often selected photography, featured artists, and featured/current broadcast are refreshed. Keep manual homepage choices optional and bounded.
12. **Analytics and privacy:** Define useful measures and consent/privacy constraints before adding analytics or user accounts.

## 10. Exact next implementation step after approval

After this content architecture is approved, the next step is a **non-code content-model and workflow prototype**: choose one representative existing set, its artist, platform artwork/links, one month schedule, one event, and one collaboration; enter them in a trial of the recommended CMS option; then inspect whether the generated record relationships, homepage candidates, monthly schedule, and media workflow are clear for the sole content editor. Import or bulk-enter the full archive only after that trial passes and NDCR approves the publication/rights workflow.

The first code task after that prototype should be limited to defining the site’s content schema and read-only preview/data adapter against the approved CMS choice. It should not yet implement the full website UI. Confirm the format-cycle anchor/policy, live-vs-featured wording, asset permissions, and CMS choice before that implementation begins.

## 11. Reference basis

- Owner-provided publishing rules in the request accompanying this document.
- NDCR deck: `docs/references/DEDHSAAL.pdf` (used as supporting, not independently audited evidence).
- Existing and new artwork/schedule examples in `docs/references/`, including `Sept2026-02.jpg`, `Sept2026-03.jpg`, `Sept2026-06.jpg`, `artist-story-9x16.jpg`, `artist-instagram-4x5.jpg`, `artist-soundcloud-1x1.jpg`, and `artist-youtube-16x9.jpg`.
- Earlier discovery and visual direction: `docs/ndcr-discovery.md` and `docs/ndcr-design-direction.md`.
