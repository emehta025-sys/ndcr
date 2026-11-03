# NDCR Discovery: Product, Content, and Information Architecture

**Status:** Working discovery brief; validate current operations and content with NDCR  
**Updated:** 22 October 2026  
**Scope:** Product understanding, intended audiences, proposed information architecture, content model, and evidence gaps. Visual analysis is in [ndcr-design-direction.md](ndcr-design-direction.md).

## Evidence and confidence

- **Reference deck:** The 12-page `docs/references/DEDHSAAL.pdf` is an NDCR-provided source and has been reviewed visually, page by page. Its claims below are attributed to the deck; they have not been independently audited or confirmed current.
- **Artwork references:** All 20 image files in `docs/references/` have been visually reviewed, including monthly schedule layouts and platform-specific artwork examples. They provide direct evidence of NDCR’s artwork and publishing formats, not a full production asset inventory.
- **Official SoundCloud:** Public profile and session pages were inspected. The profile identifies New Delhi Community Radio / NDCR and shows numbered sets and other uploads. A single page’s artist copy and genre tag are visible. The profile extraction is not a complete content inventory. [Official profile](https://soundcloud.com/new-delhi-community-radio) · [Example session](https://soundcloud.com/new-delhi-community-radio/khxdeej-master)
- **Official Instagram and YouTube:** The user-provided channels are recorded below, but direct current-feed inspection was not available through the research browser. A YouTube search index contains a channel description; treat it as a hint pending direct confirmation. [Instagram](https://www.instagram.com/newdelhicommunityradio) · [YouTube](https://www.youtube.com/@NewDelhiCommunityRadio)
- **Independent reporting:** The 2025 Homegrown article gives useful context about events and cross-border relationships, but is time-bound and secondary. [Homegrown profile](https://homegrown.co.in/homegrown-creators/new-delhi-community-radio-is-building-a-radical-cross-cultural-south-asian-sound-network)

## Updated understanding of the product

The working product is a **cultural platform, music archive, and community home**. Radio and recorded sets are central, but the website should also connect listeners to artists, events, photography, collaborations, and NDCR’s evolving story. The archive must be easy to explore without making the whole site feel like a database. The homepage should feel editorial, alive, and current.

### What the NDCR deck says

The DEDHSAAL deck presents NDCR as “a platform for sound without borders,” an independent platform spotlighting India’s emerging sonic culture and connecting artists and communities in India. It describes a shift “from radio to community,” with physical takeovers, collaborations, and city-wide events alongside online broadcasts.

The deck states:

- 80+ sets and a weekly Thursday release, alternating audio and video.
- More than 100 artists featured, six sold-out events, 1.5 years building community, 6M+ Instagram impressions, and 3,000+ people reached through offline events.
- A DEDHSAAL / Diwali Special event planned for 6 November at Basant Lok Market, with 20+ artists, five venues, and collaborations named in the deck.
- A 1-year anniversary celebration at Basant Lok Market described with three sold-out venues and 1,300 attendees.
- Collaborations described with Da Nang Community Radio (DNCR), House Cats, Planet Kale, THF Radio (Berlin), and Q Radio.

These are **deck-attributed claims and plans**. The measurement periods, calculation methods, current status, permissions, and whether the event has since happened need confirmation. Do not use these numbers or event details as live website copy without owner validation. Artist names visible in deck artwork are examples of existing materials, not automatically an approved featured roster.

### What other accessible evidence says

The official SoundCloud profile identifies NDCR and New Delhi, and provides a visible archive of numbered `NDCR #...` sets and other uploads. An example set page includes a descriptive artist bio and genre metadata. This supports a session-led archive model, although it does not verify the complete catalogue or the exact current count.

The official YouTube channel is indexed as describing NDCR as an artist-led platform sharing experimental music, DJ sets, and underground sounds from India and beyond. The channel itself could not be inspected directly, so this description, current upload mix, and cadence should be checked with NDCR.

Homegrown’s July 2025 report describes alternating weekly audio/video drops, artist-led interviews, events, open decks, and collaboration with Da Nang Community Radio. This broadly aligns with the deck’s direction but is still a dated secondary account.

**Working synthesis:** NDCR has an established and growing body of sessions, artist-facing material, event documentation, and collaboration stories. The digital home should bring those strands together as a living cultural record. Whether NDCR currently runs a continuous live stream or fixed on-air schedule remains unknown; “current / featured broadcast” should be represented as a live broadcast only when operations verify that status.

## Who the website is for

The following are **working audience hypotheses**, not researched demographic facts:

1. **Listeners and cultural explorers** who want to find a current or featured set, discover artists, and follow NDCR’s programme and events.
2. **Artists, DJs, selectors, collectives, and collaborators** who need their work, contribution, relationships, and external links represented accurately.
3. **Delhi/NCR community and event-goers** who want to understand what NDCR does offline and how to take part.
4. **Wider Indian and international listeners/partners** discovering Delhi-linked work and NDCR’s collaborations.

Research still needs to establish which audience is primary, what people come to the current channels for, and what action matters most to NDCR.

## Current working information architecture

This structure reflects the owner’s current direction and can evolve after content inventory. Labels and exact route depth are not locked.

```text
HOME
├── Current / Featured Broadcast
├── Latest Set
├── Upcoming Event
├── Selected Photography
└── Featured Artists

RADIO / ARCHIVE
├── 80+ NDCR sets (deck states 80+; count to reconcile with live catalogues)
├── Filter by artist / genre / date
└── Session detail: artwork + playback; audio or video depending on session

ARTISTS
└── Artist detail
    ├── Artist-approved profile
    ├── Their NDCR sets
    ├── External links
    └── Potential photography / appearances

EVENTS
├── Upcoming events
├── Past events
└── Event detail
    ├── Flyer
    ├── Event photography / documentation
    ├── Artists / programme
    └── Collaborators

ABOUT
├── NDCR story
├── Evolution from radio into community
├── Collaborations
└── Community
```

### Home as an editorial front door

Home should provide a small number of strong, rotating or curated entry points, not a database dashboard or a grid of every recent item. Current/featured broadcast, latest set, upcoming event, selected photography, and featured artists are the owner’s proposed modules. Editorial selection needs an owner and a sustainable update process.

If there is no live broadcast at a given time, the module should clearly say “featured” or “latest” rather than imply live/on-air status. A live label, timer, schedule, or sticky live player depends on confirming a real stream and operator.

### Archive as editorial listening experience

The archive should hold the complete session collection and permit useful filtering by artist, genre, and date as proposed. Richness can come from artwork, photography, short approved context, and a clear audio/video control. Use curated starting points and selected sets to help exploration so that the archive remains human and editorial rather than a filter-heavy catalog.

The 80+ count comes from the deck and needs an inventory across SoundCloud, YouTube, and any source files. Avoid assuming every set has both video and audio, artwork, tracklist, full rights, or matching metadata.

## Draft content model

This is a content planning aid, not a technical schema decision.

| Content type | Relationship and minimum information to validate | Optional only when supplied/cleared |
|---|---|---|
| **Broadcast / featured slot** | Live vs featured state; title; current status; linked session or stream; display window and owner | Schedule, stream provider, now/next data, host, track info |
| **Set / session** | Stable title or NDCR number; artist(s); date; audio/video availability; playable source; artwork; publication state | Series, description, genre tags, duration, tracklist/timestamps, captions/transcript, location |
| **Artist** | Preferred display name; approved page text; approved portrait/artwork; linked sets; external links | Pronouns, location, appearance history, selected photography, collaborator links |
| **Event** | Name; date/status; venue/location; current or past; approved flyer; event links | Accessibility/entry info, schedule, performers, photos/video, audience documentation |
| **Collaboration** | Named partners; what the collaboration was; linked event(s), session(s), and credits; each partner’s approval | Joint statement, reciprocal links, images, timeline |
| **Media asset** | Source file; creator/credit; usage permission; caption/alt text; crop/orientation; associated content | Release window, geographic/expiry restrictions, archival rights |

### Content relationship sketch

```text
Artist ── contributes to ── Set / session ── presented at ── Event
  │                            │                              │
  └── appears in ── Media asset└── uses ── Artwork             └── with ── Collaboration
```

Relationships should be explicit and support browsing. An artist can have many NDCR sets; an event may feature multiple artists and create photographs or sessions; a collaboration may connect partners, events, and sets. Actual cardinality and identity resolution need checking against the asset inventory.

## Priorities: now, later, and not yet

### Core product to plan for first implementation

- An editorial homepage with the five owner-defined content modules.
- The Radio / Archive with a complete, reviewed session inventory and artist / genre / date discovery.
- A session page that makes artwork, playable audio/video, artist credit, and context clear.
- Artist pages linking approved profile content, NDCR sets, external links, and selected images where available.
- Events with upcoming and past views, approved flyers, and event documentation.
- About content explaining NDCR’s own story, evolution into community, collaborations, and community.
- Responsive, accessible image-led browsing; keyboard-operable audio/video controls; no autoplay; descriptive metadata and image text; reliable links to official platforms.

### Later, if content and operations support it

- A persistent global player or live-now/next schedule, after a live stream and operating model are confirmed.
- More elaborate artist appearance timelines, collaboration maps, advanced filters, tracklists, timestamps, search, bilingual publishing, or curated listening paths after content quality and audience needs are known.
- Newsletter, artist submissions, accounts, saved sessions, comments, ticketing, commerce, and personalization only when NDCR has a user need, consent policy, and owner for the workflow.

### Do not build on current evidence

- A fake live radio stream, invented terrestrial frequency, schedule, or on-air indicator.
- A fixed artist roster, event calendar, statistics, biographies, genres, or collaborations inferred from visual materials alone.
- A complete custom media-hosting/transcoding backend before rights, budget, bandwidth, and operational ownership are decided.
- Social feed scraping or third-party embeds as the only canonical archive.
- A clone of another radio brand or a generic database interface that strips the art and community context from the archive.

## Reference platforms: patterns only

The five reference platforms remain useful for interaction patterns, not brand direction. Public-page inspection shows:

- **HÖR:** library, curated picks, artist/style discovery, calendar, and session pages with track-ID context; useful for linking artist, session, and programme. Its volume, membership gates, and visual language are not requirements.
- **NTS:** curated archive collections, schedule, residents, guests, series, and search; useful for giving a sizable archive multiple routes in. Its live channels and account features may be unnecessary.
- **The Lot Radio:** daily lineup, staff picks, searchable session archive, resident discovery, and a strong relationship to physical place; useful for editorial emphasis and the online/offline connection.
- **Rinse FM:** artist directory with filters, schedule, channels, search, and a deep artist/show relationship; useful if NDCR’s catalogue warrants a browsable artist index.
- **Deephouse.FM:** now/next schedule, show summaries, and persistent playback; useful only if NDCR confirms continuous live listening.

The principle for NDCR is to borrow information and interaction solutions that fit its own archive and editorial work, while taking visual direction from its actual artwork and photography.

## What we know / what remains unknown

### Content/assets confirmed in this workspace

- One reviewed 12-page NDCR DEDHSAAL deck, `docs/references/DEDHSAAL.pdf`.
- Twenty reviewed visual references: earlier portraits/event work (`April-01.jpg`, `AugArtworks-16.jpg`, `IMG_3831.JPG.jpeg`, the four `July2026Artworks-*.jpg` files, three `Mar26-*.jpg` files, and three `OctoberArtworks-*.jpg` files); monthly schedule references (`Sept2026-02.jpg`, `Sept2026-03.jpg`, `Sept2026-06.jpg`); and platform-specific layouts (`artist-story-9x16.jpg`, `artist-instagram-4x5.jpg`, `artist-soundcloud-1x1.jpg`, `artist-youtube-16x9.jpg`).
- Public SoundCloud catalogue and session metadata, but not a complete local audio library.
- Official Instagram and YouTube URLs, but no direct current-feed review or asset export in this task.
- The owner says a larger Google Drive asset library exists for later use. It is **not locally present or reviewed** and should not be assumed available for implementation.

### Unknowns to resolve

- The current live-stream/broadcast state and what “current / featured broadcast” means operationally.
- A verified 80+ session inventory, canonical source per session, format (audio/video), publication date, series, duration, rights, and working playback path.
- Which artist profiles, external URLs, bios, pronouns, photographs, appearances, and names are approved for website publication.
- Current upcoming event information, past event records, venues, flyers, photography, accessibility details, RSVP status, and who maintains them.
- Accuracy and dates for deck claims/numbers; approval to publish them.
- Collaboration status, partner naming/credits, reciprocal links, and consent.
- Full Google Drive inventory, folder structure, original files, duplicates, photographers/designers, licenses/consents, and approved crops.
- Primary audience and priority tasks, editorial owner, publishing workflow, languages, budget, hosting/domain, analytics/privacy constraints, and technical maintenance owner.

## Recommended next step before design or coding

Run a **content and operations audit** with NDCR owners using the 80+ session inventory as the backbone. For each set, record canonical URL/file, artist, date/number, format, artwork, description, genre(s), duration, tracklist/captions, rights, and artist approval. In parallel, inventory Drive flyers, photography, logos, and artwork with creator, permissions, dates, event/artist/session relation, and usable crops. Confirm live broadcast and event operations, validate deck claims, and speak to representative listeners/artists/community members. Then freeze a first-launch content set and agree the content model and navigation before visual design.

The Google Drive library can be connected or exported in a later step if the owner provides access; do not claim completeness from the local references alone.

## Source links

- NDCR supplied reference deck: `docs/references/DEDHSAAL.pdf` (local source, reviewed)
- NDCR local artwork and publishing-format references: `docs/references/` (20 image files, reviewed)
- [NDCR SoundCloud](https://soundcloud.com/new-delhi-community-radio) and [example session](https://soundcloud.com/new-delhi-community-radio/khxdeej-master)
- [NDCR Instagram](https://www.instagram.com/newdelhicommunityradio)
- [NDCR YouTube](https://www.youtube.com/@NewDelhiCommunityRadio)
- [Homegrown report, 17 July 2025](https://homegrown.co.in/homegrown-creators/new-delhi-community-radio-is-building-a-radical-cross-cultural-south-asian-sound-network)
- [HÖR](https://hoer.live/), [NTS](https://www.nts.live/radio), [The Lot Radio](https://www.thelotradio.com/), [Rinse FM](https://www.rinse.fm/schedule), [Deephouse.FM](https://deephouse.fm/)
