# NDCR Design Direction

**Status:** Evidence-led direction for review; not a visual design or implementation  
**Updated:** 22 October 2026  
**Primary source:** NDCR’s supplied `docs/references/DEDHSAAL.pdf` and all 20 artwork/photo/schedule files in `docs/references/`.

## Design intent

Translate NDCR’s existing graphic language into a flexible digital cultural platform. The website should feel like a current, editorial home for music, artists, visual culture, events, and community. Use the references as evidence of an existing identity, then develop a website system from their recurring principles. Do not paste flyers into page layouts or reproduce one campaign artwork as the whole site.

The owner’s stated direction—black-first, professional, editorial, monochrome photography, controlled bright accents, distinctive graphic language, negative space, experimental layouts, sophisticated motion, underground music/culture, minimal but expressive—aligns with the local references.

## What the supplied references actually show

All 20 local image files were inspected. The earlier portrait/event artwork and photographic collage are joined by three monthly schedule designs and four platform-specific versions of an artist artwork (Story 9:16, Instagram 4:5, SoundCloud 1:1, YouTube 16:9). Across these pieces, recurring visual features include:

- **Black as a dominant field**, paired with bright white typography and large areas of open black space.
- **A narrow, tall NDCR wordmark** and a more decorative “New Delhi Community Radio” illustrated lockup in the event collage. This suggests more than one existing logo treatment; approved master files and usage rules are still needed.
- **High-contrast monochrome portraits and candid performance/community photography**, often large and tightly cropped.
- **A jagged, hand-drawn burst/lightning frame** or spiked outline around images, shifting between electric colors such as magenta, cyan/blue, green, yellow, and red/lavender. Accent changes across artist/session pieces rather than appearing as a single stable palette.
- **Bold condensed, all-caps display text**, sometimes set vertically, contrasted with thin geometric sans-serif biography text and compact event/date details.
- **A recurring eye/sun/lotus-like emblem** in some artworks; treat it as an existing graphic motif, not permission to reinterpret it as a religious or cultural symbol.
- **Campaign artwork with a separate visual register:** DEDHSAAL and anniversary/event flyers use dense, hand-drawn, colorful, folk-pop/poster-like illustration, Devanagari display lettering, vivid borders, and busy event information. These have campaign specificity and coexist with the cleaner black/monochrome artist cards.
- **Small utility details** such as date/time in IST, series/artist names, waveform ornament, and dotted side rails on long text layouts.

The DEDHSAAL deck itself uses black slides, white condensed headings, a pale cyan/blue text accent, small waveform marks, and a spiked NDCR badge. It intersperses dense colorful flyers and documentary event photographs. The deck’s product storytelling places broadcasts, sets, artists, community, offline events, and collaborations together.

## Proposed design principles

### 1. Black-first, with deliberate contrast

Use a near-black/black canvas as the default, with warm or neutral light text chosen for clear legibility. Preserve generous negative space. Avoid making every surface a black card; contrast can come from large unframed photography, editorial text fields, and occasional light/paper sections when artwork calls for them. No color tokens should be locked until sampled from approved originals and checked for contrast.

### 2. Monochrome people photography; color used as signal

Treat black-and-white portraits and event documentation as important content, not background filler. Use bright color in selected frames, graphic marks, metadata, and calls to action, with restraint. The local references show a rotating set of accents; a design system could define a controlled accent set and choose accents by content/campaign, not paint the whole UI in a permanent rainbow.

### 3. Typography with a clear role system

Explore a distinctive, condensed display face for short headlines and artist/event titles, paired with a highly readable text face for long copy, controls, filters, and metadata. Test NDCR’s supplied wordmark separately from text typography. Avoid using the thin geometric bio-card face at small sizes; the reference’s display style should be adapted for screen readability, not copied at its original scale or orientation.

### 4. Reuse the graphic grammar, not fixed flyer layouts

The spiked outline, sound-wave detail, vertical naming, and emblem are candidates for a small set of adaptable digital motifs. Make each motif useful for grouping, focus, or navigation. Do not place jagged outlines around every image, force vertical text on mobile, or overuse ornamental frames. Keep campaign flyers intact as credited event artwork, with responsive crops/zoom or a detail view where appropriate.

### 5. Editorial composition over template grids

Let Home lead with a featured broadcast/session, then move through latest set, upcoming event, selected photography, and featured artists as a paced editorial sequence. Mix image scales and alignments; use whitespace and clear hierarchy to make experimentation feel intentional. Keep archive filters available on the archive page, not as the dominant homepage structure.

### 6. Preserve campaign differences

Artist/session cards can use the black, monochrome-photo, accent-frame language. Events may retain their original, sometimes richly illustrated flyer identity. The website should contain and contextualize those artifacts, not homogenize every flyer into a new NDCR template. Use consistent site typography, spacing, metadata, and accessible controls to hold varied source art together.

### 7. Motion should express sound and reveal context

Motion can support page transitions, reveal selected editorial content, or subtly animate a graphic pulse/outline. It should feel deliberate, short, and tied to content. Do not animate audio controls so they obscure status; avoid autoplaying sound/video, constant visualizers, scroll-jacking, or motion that makes text hard to read. Provide reduced-motion behavior, keyboard access, and a static fallback. Exact animation language should be prototyped after layout direction is agreed.

### 8. Mobile is a first-class composition

Design vertical crops and alternate placements for portrait artworks, event flyers, and wide photos instead of shrinking desktop posters. Keep titles, dates, playback controls, event status, and filter controls readable and touch-operable. Avoid sticky players or navigation that cover images/content; only introduce a persistent player if a live/continuous stream is confirmed.

## How the direction maps to the product

- **Home:** a current editorial selection with a strong visual lead and breathing room. Use the featured/current broadcast module only with truthful live/featured status. Balance its energy with latest set, upcoming event, selected photography, and featured artists.
- **Radio / Archive:** a useful but visually quiet discovery layer. Filter controls support artist, genre, and date; artwork, photography, artist identity, and format remain prominent. Use album-art-like cards where the sources support them, but do not force all sessions into uniform database tiles.
- **Artist pages:** let approved portrait/artwork lead; show the artist’s NDCR sets and external links. Photography/appearances are optional and need verified relationships and rights.
- **Events:** retain individual flyers as cultural artifacts and pair them with event photos/documentation and the approved program. Past events should remain legible as history; upcoming status must be accurate and expire automatically/editorially.
- **About:** typography and spacing should support a strong story. Present the evolution from radio into community and collaborations using the deck as a starting source, after NDCR validates language and claims.

## Design system hypotheses to test

These are not final specifications:

- **Base surfaces:** black/near-black and a restrained light surface for occasional contrast; derive exact values from original brand assets and accessibility testing.
- **Accent palette:** sample the existing electric cyan/blue, magenta/pink, green, yellow, and occasional red/lavender from the image assets. Determine if these are all active brand accents or per-artist campaign choices. Use one or two accents at a time in interface chrome.
- **Typography:** condensed display + readable text family; test legibility at mobile sizes and with Devanagari support if required. Exact typefaces, licenses, weights, and language coverage are unknown.
- **Image treatment:** configurable crop/aspect ratios by content type; monochrome editorial photography; original color artwork preserved. Never apply a destructive monochrome filter to source work without permission.
- **Graphic motifs:** spiked frames, waveform, dotted rhythm/rail, NDCR marks; define safe area, frequency, scaling, and behavior with/without imagery.
- **Layout:** grid-based but compositionally varied; generous gutters; strong alignment; short metadata clusters; portrait and landscape content supported.
- **Motion:** restrained transitions and subtle motif movement; exact timing and easing not chosen. Reduced motion is mandatory.

## Accessibility and content protection

- Maintain readable contrast against black and accent colors. Some bright hues are suitable as borders/graphics but may fail for small text.
- Keep display headlines, vertical labels, and custom logos from replacing semantic page titles and accessible names.
- Provide meaningful text alternatives for event flyers and artwork. Do not assume a poster’s small embedded copy is readable by assistive technology; transcribe essential event details as HTML.
- Caption and credit photography when known; respect image consent and photographer/artist terms.
- Respect reduced motion, keyboard operation, focus visibility, zoom/reflow, captions/transcripts, and no autoplay.
- Preserve the artwork’s context and exact text where possible. Do not crop an artist’s face, event information, or partner marks in ways that change the source’s meaning.

## Asset inventory: local reference folder only

| Asset group | Files reviewed | What they demonstrate | What they do not establish |
|---|---|---|---|
| Event/session artwork | `April-01.jpg`, `AugArtworks-16.jpg`, `July2026Artworks-06.jpg`, `July2026Artworks-11.jpg`, `July2026Artworks-14.jpg`, `July2026Artworks-21.jpg`, `Mar26-07.jpg`, `Mar26-11.jpg`, `Mar26-27.jpg`, `OctoberArtworks-11.jpg`, `OctoberArtworks-16.jpg`, `OctoberArtworks-19.jpg` | Repeated black field, monochrome portraits, bold type, spiked outline, varying bright accents, session/date label, occasional artist bio. | Original vector/logo files, exact colors/fonts, source photo permissions, complete set coverage, approved crops or use terms. |
| Monthly release schedule | `Sept2026-02.jpg`, `Sept2026-03.jpg`, `Sept2026-06.jpg` | Black ground; eye/sun emblem and NDCR wordmark; dotted panel dividers; release dates and 18:00 IST; artist names with the display type system. This is a compact, date-led recurring schedule graphic. | Does not establish all-month schedule data or whether the website should reproduce the poster layout. |
| Platform-specific artist art | `artist-story-9x16.jpg`, `artist-instagram-4x5.jpg`, `artist-soundcloud-1x1.jpg`, `artist-youtube-16x9.jpg` | The same artist/session artwork adapts across vertical Story, portrait feed, square SoundCloud, and wide YouTube formats; the wide version prominently uses the set number. Confirms assets are intentionally platform-specific. | Does not imply a website should select a social crop unchanged or store multiple duplicated set records. |
| Photo/event collage | `IMG_3831.JPG.jpeg` | Existing NDCR illustrated lockup, color photography, event/crowd and DJ documentation, one composition combining people and brand identity. | Full event photo archive, names/consents, image provenance, permission for use as a page hero. |
| Product/event deck | `DEDHSAAL.pdf` (12 pages) | Positioning and narrative, current intended IA signals (radio + archive + artists + community + events + collaborations), cited metrics, campaign posters, artist/session montage, social channel/contact panel. | Audited metrics, current contact details, current event state, current complete content catalogue, website requirements as final decisions. |
| Larger Google Drive library | Owner-reported, not locally available or reviewed | Expected to include event photography, flyers, logos, artwork, and other material. | Inventory, file quality, rights, creator credits, dates, duplicates, and publication readiness are all unknown. |

## Decisions before visual design

1. Which supplied logo/lockup is primary, and are vector masters, clear-space rules, and permitted alternates available?
2. Are the rotating bright accents selected per artist/session/event, or part of a broader consistent palette? Which combinations are preferred?
3. Which typefaces are in active use and licensed for web? Are Devanagari and other scripts needed at launch?
4. How should event flyer art and the monochrome portrait series coexist on Home and detail pages?
5. What level of experimental composition and motion feels right to NDCR and the artists represented? Which contexts should stay calm and highly readable?
6. What content is cleared for launch, including artist portraits, photographer credit, public event photos, and third-party partner marks?
7. Which real live/featured state should the homepage communicate, and who updates it?
8. Who will select and refresh featured artists, latest set, broadcast, event, and photography modules?

## Recommended next step

Before mockups, inventory the full Google Drive library and the 80+ set collection, reconcile rights and credits, and select a representative but approved set of homepage/archive/artist/event examples. Then hold a short visual review with NDCR: confirm logo usage, typography, accent behavior, photo treatment, flyer treatment, and motion boundaries. Translate the agreed direction into a small set of low-fidelity page compositions and a token/motif study. No implementation should start until those examples and content relationships are known.
