# NDCR YouTube Catalogue Reconciliation

**Status:** Read-only reconciliation of the completed YouTube pilot; no canonical release records changed  
**Sources reviewed:** `data/raw/youtube-catalogue.json`, `docs/youtube-catalogue-pilot.md`, `docs/ndcr-release-inventory.md`  
**Catalogue extraction:** 22 October 2026, 16:40:54 UTC

## Executive finding

The extractor’s **88 likely numbered releases are 88 YouTube upload records classified by a title pattern, not 88 distinct NDCR sets**. The raw metadata supports a plausible explanation for the difference from NDCR’s owner-confirmed 83-set total:

- Six numbered groups (#022, #028, #030, #032, #034, #035) each contain one full-length set upload plus one or more short 26–30 second promotional videos that repeat the set number. These add **seven extra uploads** to a video count without adding seven releases.
- The #066 Q Radio video has `NDCR #066` in its title but also says “premiere the full recording as NDCR #067” in its description. The extractor classifies it as ambiguous and does not include it in the 88.
- A full-length upload titled `CR #070: GLM B2B The Untitled One ...` is in the uploads playlist but is missed by the extractor’s strict `NDCR #` pattern.
- The description-only `#067` on the Q Radio/#066 item creates an apparent duplicate for #067. The separate #067 BINDAS upload is a different artist and release date; this looks like a title/description conflict, not a duplicate set upload.

Thus, **88 - 7 likely promo uploads + #066 as a title-level candidate + #070 as a non-standard-prefix candidate = 83 candidate release numbers**. This arithmetic is a useful explanation of the mismatch, not an editorial reconciliation or proof that every one of the 83 matches the canonical release ledger. Preserve NDCR’s confirmed total of 83 and retain all source numbering pending human review.

## 1. Scope, source limitations, and the inventory gap

The YouTube API returned 127 uploads and video-detail records. The pilot classifies 88 as `numbered_release`, 38 as `unclassified_upload`, and one (#066) as `ambiguous_number_candidates`. The 88 count does not de-duplicate upload records that refer to one release. The raw JSON retains the full API response and should remain the audit source for exact fields.

`docs/ndcr-release-inventory.md` confirms that NDCR has 83 numbered sets, but it is a **catalogue model, not a populated 83-row inventory**. It contains three illustrative records: #009 Aayna, #018 Hamza Rahimtula, and #019 KHXDEEJ. It cannot support a complete set-by-set difference between YouTube and all 83 canonical inventory records. These three examples are all represented by explicit YouTube titles and matching artist strings.

`publishedAt` below is reproduced as YouTube’s platform timestamp in UTC. It is not the official NDCR post/premiere date or time. The API extract contains no established canonical NDCR release timestamp; none is inferred in this report.

## 2. Grouping overview

### Singleton and exceptional groups

The extractor’s exact `NDCR #<digits>` title pattern finds one clear title-number group for each number in these ranges:

`#001–#021`, `#023–#027`, `#029`, `#031`, `#033`, `#036–#065`, `#068–#069`, and `#071–#083`.

These are YouTube-side candidates only. The inventory document does not contain rows with which to match most of them. Among these, #009, #018, and #019 match the three illustrative inventory records by number and artist. The duplicated/ambiguous groups are detailed below. The API’s detected sequence skips #070 because the relevant title begins `CR #070`, not `NDCR #070`; the video itself is present and discussed in §4. Do not interpret a numbering gap as evidence that a release is missing.

### Numbers with more than one upload candidate

The extractor groups these numbers as having multiple candidate uploads: **#022, #028, #030, #032, #034, #035, and #067**. The first six groups have short promotional videos plus one full-length set video. The #067 group is a description-text collision involving the #066 Q Radio video and the #067 BINDAS video; it is not evidence that those are duplicate uploads of one release.

## 3. Multiple-upload groups

The descriptions are summarized below; exact source descriptions and all metadata remain in `data/raw/youtube-catalogue.json`. Durations are YouTube `contentDetails.duration` values. No media was downloaded or inspected. Short-video classification is based on duration, title, and available descriptions, so “promo” is a strong candidate, not a verified viewing judgment.

### #022 — Vridian

| Video ID | Exact YouTube title | URL | `publishedAt` (UTC) | Description summary | Assessment |
|---|---|---|---|---|---|
| `nWeAzUf1Qy4` · 28 sec | `Journey into minimal, progressive & cosmic house with Vridian on NDCR #022 🌀🎛🌌` | [Watch](https://www.youtube.com/watch?v=nWeAzUf1Qy4) | `2025-09-03T10:30:36Z` | Description contains NDCR Instagram/SoundCloud and Vridian Instagram links, with no full-set editorial description. | Likely short promotional excerpt for #022. |
| `tKSzxcHq3uI` · 52m 7s | `NDCR #022: VRIDIAN | Minimal / Deep Tech, Progressive House, Cosmic House | September 2, 2025` | [Watch](https://www.youtube.com/watch?v=tKSzxcHq3uI) | Long artist/set description; explicitly identifies NDCR #022 and Vridian and includes NDCR and artist links. | Full-length release candidate. Same set number and artist as the 28-second upload; `publishedAt` differs by about a day, consistent with separate promo/full uploads. Not evidence of two distinct sets. |

### #028 — Sid Praja

| Video ID | Exact YouTube title | URL | `publishedAt` (UTC) | Description summary | Assessment |
|---|---|---|---|---|---|
| `ZmLKs6JfQc4` · 28 sec | `Sid Praja blends house, techno, IDM & electro in NDCR #028 🌌⚡` | [Watch](https://www.youtube.com/watch?v=ZmLKs6JfQc4) | `2025-09-30T09:15:56Z` | Description contains NDCR Instagram/SoundCloud links only. | Likely short promotional excerpt for #028. |
| `83DfkSxYPLY` · 1h 4m 4s | `NDCR #028: SID PRAJA | House, Dance, Techno, Trance, Rominimal | September 23, 2025` | [Watch](https://www.youtube.com/watch?v=83DfkSxYPLY) | Long artist biography and set context; credits Sid Praja and lists genre wording. | Full-length release candidate. Same artist/number with a substantially longer description and duration. Likely one release plus promo. |

### #030 — Su Real

| Video ID | Exact YouTube title | URL | `publishedAt` (UTC) | Description summary | Assessment |
|---|---|---|---|---|---|
| `Y7Tg3QqHGUI` · 30 sec | `Su Real brings Bolly Baile, Afro Desi & Indo House flips to NDCR #030 🔥🎶` | [Watch](https://www.youtube.com/watch?v=Y7Tg3QqHGUI) | `2025-10-01T11:30:34Z` | Description contains NDCR and Su Real social/platform links, without full set prose. | Likely short promotional excerpt for #030. |
| `AqI_CboznWk` · 1h 1m 47s | `NDCR #030: Su Real | Bolly Baile, Afro Desi, Panjabi Garage, Indo House | September 30, 2025` | [Watch](https://www.youtube.com/watch?v=AqI_CboznWk) | Detailed set description about Su Real’s mix and NDCR, followed by NDCR/artist links. | Full-length release candidate. Same artist and number; the short upload is not a second full set. |

### #032 — Antariksh Daddy

| Video ID | Exact YouTube title | URL | `publishedAt` (UTC) | Description summary | Assessment |
|---|---|---|---|---|---|
| `4i_z9yJw3S0` · 30 sec | `Antariksh Daddy brings genre-fluid house, techno & jungle to NDCR #032 ⚡🔊` | [Watch](https://www.youtube.com/watch?v=4i_z9yJw3S0) | `2025-11-12T08:30:03Z` | Description contains NDCR Instagram/SoundCloud links only. | Likely short promotional excerpt for #032. |
| `-vCJKUt5DJo` · 30 sec | `Antariksh Daddy marks Antariksh Records’ 7th anniversary with an NDCR #032 set 🔥🎛️` | [Watch](https://www.youtube.com/watch?v=-vCJKUt5DJo) | `2025-11-11T11:51:10Z` | Description contains NDCR Instagram/SoundCloud links only. | Likely a second, separately edited promotional excerpt or angle for #032; not a full set based on duration. |
| `zxWFrSURuf0` · 57m 22s | `NDCR #032 – Antariksh Daddy | Jungle, Breakbeat, Breakcore | October 16, 2025` | [Watch](https://www.youtube.com/watch?v=zxWFrSURuf0) | Long artist/set copy mentions Antariksh Records’ anniversary, styles, and NDCR/SoundCloud links. | Full-length release candidate. The anniversary wording is shared with one promo, supporting a common release association. These three uploads should not become three Release records. |

### #034 — Unnayanaa

| Video ID | Exact YouTube title | URL | `publishedAt` (UTC) | Description summary | Assessment |
|---|---|---|---|---|---|
| `QwQ2jOyKq3A` · 26 sec | `Unnayanaa blends Afrobeat, house & Carnatic rhythm in NDCR #034 🌍✨` | [Watch](https://www.youtube.com/watch?v=QwQ2jOyKq3A) | `2025-11-12T13:30:23Z` | Description contains NDCR Instagram/SoundCloud links only. | Likely short promotional excerpt for #034. |
| `Vvtqvw165OI` · 1h 33m 1s | `NDCR #034: Unnayanaa | Afrobeat, House, Jazz, Broken Beat, Carnatic Fusion | October 30, 2025` | [Watch](https://www.youtube.com/watch?v=Vvtqvw165OI) | Long artist biography/set description; references Unnayanaa’s sound and releases, plus NDCR. | Full-length release candidate. Same artist and number; likely one release plus promo. |

### #035 — Kairavi

| Video ID | Exact YouTube title | URL | `publishedAt` (UTC) | Description summary | Assessment |
|---|---|---|---|---|---|
| `wxBiAlOR0lg` · 26 sec | `Kairavi’s NDCR #035 set flows with playful, sexy, rhythm-driven grooves 💫💃` | [Watch](https://www.youtube.com/watch?v=wxBiAlOR0lg) | `2025-11-13T09:01:38Z` | Description contains NDCR Instagram/SoundCloud links only. | Likely short promotional excerpt for #035. |
| `jl6uxZ7wh4A` · 1h 5m 24s | `NDCR #035: Kairavi | House, Dub, Techno, Global Grooves | November 6, 2025` | [Watch](https://www.youtube.com/watch?v=jl6uxZ7wh4A) | Long artist/set description with Kairavi biography and NDCR links. | Full-length release candidate. Same artist and number; likely one release plus promo. |

### #067 — BINDAS title vs Q Radio description

| Video ID | Exact YouTube title | URL | `publishedAt` (UTC) | Duration / description summary | Assessment |
|---|---|---|---|---|---|
| `zx8ahHvjukI` | `NDCR #067: BINDAS | Afro Desi, Baile, UK Funky, UKG & Global Bass | 9 July 2026` | [Watch](https://www.youtube.com/watch?v=zx8ahHvjukI) | `2026-07-09T12:30:06Z`; 1h 3m 39s. Long description introduces Bindas and her Global South/diasporic club selections. | Clear title-level #067 release candidate for BINDAS. |
| `50DfXDHKaQ0` | `NDCR #066 : Q Radio (Big M B2B Vansh) | House, Minimal, Deep House | July 2, 2026` | [Watch](https://www.youtube.com/watch?v=50DfXDHKaQ0) | `2026-07-02T12:30:06Z`; 1h 4m 1s. Description identifies Q Radio, Big M and Vansh, says it was recorded at EK SAAL on 3 April 2026, but later says it will premiere as **NDCR #067**. | The video title identifies #066; the description contains a conflicting #067. Its artist and date differ from BINDAS #067, so these are not the same set. The description’s #067 is a likely metadata/numbering error, but only NDCR can confirm. |

The `#067` duplicate flag is therefore not evidence of duplicate BINDAS uploads. It is a cross-field collision: one BINDAS title and one Q Radio description. The #066 title is a distinct candidate in its own right, but its `#067` description reference must be reviewed before the inventory is reconciled.

## 4. Special case: #070 is present but missed by the detector

The pilot report lists this upload as unclassified because the number parser requires `NDCR #`:

| Video ID | Exact title | URL | `publishedAt` (UTC) | Details |
|---|---|---|---|---|
| `jTKSmlVOXnY` | `CR #070: GLM B2B The Untitled One | Drum & Bass, UK Garage & 140 | 30 July 2026` | [Watch](https://www.youtube.com/watch?v=jTKSmlVOXnY) | `2026-07-30T12:30:06Z`; 1h 5m 5s. Long description introduces GLM and The Untitled One and describes their B2B set; NDCR and artist links appear at the end. |

This is a plausible numbered NDCR full-length set whose title has a shortened `CR` prefix, not a title pattern the extractor counted. It is a **false negative of the strict detector**, not a confirmed missing upload. It still needs number confirmation because the exact NDCR prefix is absent and the current inventory document has no #070 row.

## 5. Likely false positives and suspicious detections

### Upload-count false positives: promotional uploads counted as releases

The 26–30 second videos in groups #022, #028, #030, #032, #034, and #035 contain genuine references to the corresponding numbered sets. They are likely promos/teasers, not unrelated numbers. The number detector’s problem is treating each such upload as an additional Release. There are **seven** such extra short videos: one each for #022, #028, #030, #034, and #035, and two for #032.

### Number-reference false positive: #067 in the Q Radio/#066 description

`50DfXDHKaQ0` has `#066` in its title and `#067` in its description. The exact phrase in the description says it will premiere as `NDCR #067`. A distinct BINDAS upload is titled `NDCR #067` and dated one week later. The #067 association on the Q Radio record is therefore a likely false duplicate-number detection (or a genuine published numbering conflict). Do not silently discard or correct it.

### No confirmed unrelated title-number false positives

For the other repeated title numbers, artist names and long-video titles align between teaser and full-length candidate. Their number mentions appear to refer to the same NDCR set, even though they are distinct uploads. No other title-based number was found that clearly denotes a non-NDCR numbered set. The `CR #070` title is a likely NDCR release candidate, not a confirmed false positive.

## 6. Comparison with the known 83-release catalogue

### YouTube number candidates not represented as complete inventory records

The only individually described Release examples in `docs/ndcr-release-inventory.md` are #009, #018, and #019. All three are confidently found on YouTube:

| Inventory example | YouTube video | Match basis |
|---|---|---|
| #009 — Aayna | [`eyS5yFogzFY`](https://www.youtube.com/watch?v=eyS5yFogzFY) | Exact set number and artist in title: `NDCR #009: Aayna`. |
| #018 — Hamza Rahimtula | [`-0qcL1aan1I`](https://www.youtube.com/watch?v=-0qcL1aan1I) | Exact set number and artist in title: `NDCR #018 : Hamza Rahimtula (Vinyl Only)`. |
| #019 — KHXDEEJ | [`WtfsKLLGIKM`](https://www.youtube.com/watch?v=WtfsKLLGIKM) | Exact set number and artist in title: `NDCR #019: KHXDEEJ`. |

The raw YouTube candidate numbers not represented by an individual example row in the current document are `#001–#008`, `#010–#017`, and `#020–#083` (with #070 found only through the non-standard `CR #070` title, and the numbered collisions described above). This is a **documentation coverage gap**, not evidence that these sets are absent from NDCR’s confirmed catalogue. The current file does not contain the 83 actual inventory rows, so it is impossible to label these as present or absent from that catalogue.

### Inventory numbers not confidently found on YouTube

- **Among the only three explicitly exemplified inventory records (#009, #018, #019): none are missing.** Each has a matching YouTube title/artist candidate.
- **For the remaining 80 confirmed releases: UNKNOWN.** The inventory document does not enumerate their actual set numbers, so a complete inventory-to-YouTube anti-join cannot be performed from the specified sources.
- **#070:** a plausible full-length YouTube upload exists (`jTKSmlVOXnY`), but the title says `CR #070`; it is not a confident exact-prefix match. This number is not “not found”; it is “found under a non-standard title requiring confirmation.”

The visible candidate pattern spans #001–#069, #071–#083 under the exact prefix detector and includes a likely #070 under `CR #070`. This pattern is consistent with 83 candidate identifiers, but it does **not** establish that numbering is continuous, that #083 is the catalogue endpoint, or that the upload-derived set is the canonical 83-record list. The owner-confirmed total of 83 remains authoritative.

## 7. The 38 uploads without a recognized release number

The pilot report lists all 38 with their playlist positions, IDs, exact titles, and flags. They should not be treated as missing numbered releases solely because the parser found no number. Broadly, the entries include short artist/promotional clips, artist spotlights, event/community footage, collaboration highlights, and older station/set announcements. Their title/description patterns do not consistently follow `NDCR #NNN`.

Notable review points:

- Position 28, `jTKSmlVOXnY`, is the likely #070 case discussed above.
- Positions 7 and 9–23 contain artist/booth captions without a set number; these may be promotional videos rather than canonical set uploads.
- Positions 78–95 include artist spotlights/promotional copy without release numbers.
- Positions 97–105 include event, community, collaboration, and station highlights; these should not be forced into the numbered Set entity without evidence.
- Positions 109–120 include short station/set announcements and artist-promotional uploads, some with titles suggesting a set but no set number.

All 38 require classification only if the objective is to explain every channel upload. They are not 38 proven missing sets.

## 8. What this pilot still cannot establish

- The canonical set-number list for the owner-confirmed 83 releases, because the existing inventory document contains examples rather than all rows.
- Whether the short clips in the six duplicate groups are official teasers, clips, or alternate presentations. Metadata strongly suggests that, but the video media was not inspected.
- Whether #066’s title or its description has the intended published number, and whether the #067 text is a copy/paste error or a historical numbering conflict.
- Whether `CR #070` is officially NDCR #070 or has another interpretation.
- Which YouTube item is the corresponding SoundCloud track, and whether any release is absent or named differently there.
- Official NDCR posting/premiere date and time. YouTube `publishedAt` remains a platform timestamp and must not populate canonical release timing.
- Website artwork rights, artist identity approvals, canonical artist spelling, and approved website descriptions.

## A. CONFIDENT MATCHES

These are the only cross-references that can be called confident matches to individually described records in the supplied release-inventory document:

- **#009 — Aayna:** YouTube video `eyS5yFogzFY`.
- **#018 — Hamza Rahimtula:** YouTube video `-0qcL1aan1I`.
- **#019 — KHXDEEJ:** YouTube video `WtfsKLLGIKM`.

Other unique `NDCR #NNN` uploads are strong YouTube-side release candidates, but cannot be declared matched to the canonical 83 without the actual 83-record inventory.

## B. NEEDS HUMAN REVIEW

1. **#022:** distinguish the 28-second promo from the 52-minute set upload; likely one set, two uploads.
2. **#028:** distinguish the 28-second promo from the 1-hour set upload; likely one set, two uploads.
3. **#030:** distinguish the 30-second promo from the 1-hour set upload; likely one set, two uploads.
4. **#032:** classify two 30-second promos versus the 57-minute set upload; likely one set, three uploads.
5. **#034:** distinguish the 26-second promo from the 1-hour-33-minute set upload; likely one set, two uploads.
6. **#035:** distinguish the 26-second promo from the 1-hour-5-minute set upload; likely one set, two uploads.
7. **#066 / #067 conflict:** Q Radio’s title says #066, its description says #067, and the distinct BINDAS release is titled #067.
8. **#070:** review the full-length `CR #070` upload and confirm its canonical published number.
9. **The 38 unclassified uploads:** triage as promo, event/community content, a numbered release, or another upload type; do not infer Set status.

The **nine numbered-release cases** above require human review. The 38 unclassified uploads are a separate channel-content triage set; #070 overlaps with that group.

## C. MISSING / NOT FOUND ON YOUTUBE

- **No explicitly exemplified inventory release is missing:** #009, #018, and #019 all have YouTube candidates.
- **No complete list of missing numbers can be produced from the current inventory document**, because its other 80 records and set numbers are not listed.
- **#070 is not absent from the channel:** a plausible full-length candidate is present under `CR #070`; it remains unconfirmed as an exact canonical match.
- The pilot’s parser-reported gap `#070` is therefore a detection gap, not evidence of a missing NDCR release. No number is renumbered or synthesized in this report.
