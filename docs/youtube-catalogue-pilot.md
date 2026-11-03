# YouTube Catalogue Pilot Report

**Extraction time:** `2026-10-22T16:40:54.839586+00:00`  
**Source:** YouTube Data API v3  
**Channel:** New Delhi Community Radio (`UCu_UsD1my3yWkvOJi8MR7HA`)  
**Uploads playlist:** `UUu_UsD1my3yWkvOJi8MR7HA`  
**Raw catalogue:** `C:/PROJECTS/NDCR/data/raw/youtube-catalogue.json`  

## Extraction summary

- Upload playlist items retrieved: **127**
- Video detail records returned: **127**
- Likely numbered releases (number in title): **88**
- Formal numbered titles with a parsed release date: **79**
- Upload descriptions with artist profile links parsed: **77**
- Number candidates found only in descriptions: **0**
- Unclassified uploads: **38**
- Ambiguous-number uploads: **1**

The JSON preserves the requested API responses under `raw_api`. The `records` and `analysis` sections are derived inspection aids; they do not alter or replace the source values.

**Reprocessing note:** Derived fields were rebuilt from the saved official API response at `2026-10-26T14:46:08.755700+00:00`. No fresh YouTube API request was made.

## Detected release numbers

`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`, `13`, `14`, `15`, `16`, `17`, `18`, `19`, `20`, `21`, `22`, `23`, `24`, `25`, `26`, `27`, `28`, `29`, `30`, `31`, `32`, `33`, `34`, `35`, `36`, `37`, `38`, `39`, `40`, `41`, `42`, `43`, `44`, `45`, `46`, `47`, `48`, `49`, `50`, `51`, `52`, `53`, `54`, `55`, `56`, `57`, `58`, `59`, `60`, `61`, `62`, `63`, `64`, `65`, `66`, `67`, `68`, `69`, `71`, `72`, `73`, `74`, `75`, `76`, `77`, `78`, `79`, `80`, `81`, `82`, `83`

## Numbers appearing missing between observed endpoints

`70`

**Warning:** A numbering gap is a review flag, not proof of a missing release. No records are inferred or created.

## Duplicate or suspicious records

- Duplicate detected number(s): `22`, `28`, `30`, `32`, `34`, `35`, `67`

| Playlist position | Video ID | Title as returned | Number candidate(s) | Flag(s) |
|---:|---|---|---|---|
| 31 | `zx8ahHvjukI` | NDCR #067: BINDAS \| Afro Desi, Baile, UK Funky, UKG & Global Bass \| 9 July 2026 | 67 | numbered_release_detected_in_title, duplicate_release_number, possible_genre_information, possible_date_time_information |
| 32 | `50DfXDHKaQ0` | NDCR #066 : Q Radio (Big M B2B Vansh) \| House, Minimal, Deep House \| July 2, 2026 | 66, 67 | numbered_release_detected_in_title, multiple_release_numbers_in_record, duplicate_release_number, suspicious_title, possible_genre_information, possible_date_time_information |
| 63 | `wxBiAlOR0lg` | Kairavi’s NDCR #035 set flows with playful, sexy, rhythm-driven grooves 💫💃 | 35 | numbered_release_detected_in_title, duplicate_release_number |
| 64 | `QwQ2jOyKq3A` | Unnayanaa blends Afrobeat, house & Carnatic rhythm in NDCR #034 🌍✨ | 34 | numbered_release_detected_in_title, duplicate_release_number |
| 65 | `4i_z9yJw3S0` | Antariksh Daddy brings genre-fluid house, techno & jungle to NDCR #032 ⚡🔊 | 32 | numbered_release_detected_in_title, duplicate_release_number |
| 66 | `-vCJKUt5DJo` | Antariksh Daddy marks Antariksh Records’ 7th anniversary with an NDCR #032 set 🔥🎛️ | 32 | numbered_release_detected_in_title, duplicate_release_number |
| 67 | `jl6uxZ7wh4A` | NDCR #035: Kairavi \| House, Dub, Techno, Global Grooves \| November 6, 2025 | 35 | numbered_release_detected_in_title, duplicate_release_number, possible_genre_information, possible_date_time_information |
| 68 | `Vvtqvw165OI` | NDCR #034: Unnayanaa \| Afrobeat, House, Jazz, Broken Beat, Carnatic Fusion \| October 30, 2025 | 34 | numbered_release_detected_in_title, duplicate_release_number, possible_genre_information, possible_date_time_information |
| 70 | `zxWFrSURuf0` | NDCR #032 – Antariksh Daddy \| Jungle, Breakbeat, Breakcore \| October 16, 2025 | 32 | numbered_release_detected_in_title, duplicate_release_number, possible_genre_information, possible_date_time_information |
| 72 | `Y7Tg3QqHGUI` | Su Real brings Bolly Baile, Afro Desi & Indo House flips to NDCR #030 🔥🎶 | 30 | numbered_release_detected_in_title, duplicate_release_number |
| 73 | `AqI_CboznWk` | NDCR #030: Su Real \| Bolly Baile, Afro Desi, Panjabi Garage, Indo House \| September 30, 2025 | 30 | numbered_release_detected_in_title, duplicate_release_number, possible_genre_information, possible_date_time_information |
| 74 | `ZmLKs6JfQc4` | Sid Praja blends house, techno, IDM & electro in NDCR #028 🌌⚡ | 28 | numbered_release_detected_in_title, duplicate_release_number |
| 76 | `83DfkSxYPLY` | NDCR #028: SID PRAJA \| House, Dance, Techno, Trance, Rominimal \| September 23, 2025 | 28 | numbered_release_detected_in_title, duplicate_release_number, possible_genre_information, possible_date_time_information |
| 85 | `nWeAzUf1Qy4` | Journey into minimal, progressive & cosmic house with Vridian on NDCR #022 🌀🎛🌌 | 22 | numbered_release_detected_in_title, duplicate_release_number |
| 86 | `tKSzxcHq3uI` | NDCR #022: VRIDIAN \| Minimal / Deep Tech, Progressive House, Cosmic House \| September 2, 2025 | 22 | numbered_release_detected_in_title, duplicate_release_number, possible_genre_information, possible_date_time_information |

## Uploads not confidently classified

| Playlist position | Video ID | Title as returned | Classification | Flag(s) |
|---:|---|---|---|---|
| 7 | `jkWb4u20foc` | Kampai turns the NDCR booth into his own playground🥂 #NDCR | unclassified_upload | no_release_number_detected |
| 9 | `vlXpPrDlqOk` | Citizen Kale digging deep and keeping the wheels in motion at NDCR. 🥬 #NDCR #house | unclassified_upload | no_release_number_detected |
| 10 | `HesdRznFlcs` | BB Nabi steps into the NDCR booth and lets the rhythm take over🔊 #NDCR | unclassified_upload | no_release_number_detected |
| 11 | `ozavGgbP1cc` | Deep in the mix with Mowgli, where the grooves do the talking🌿 #NDCR | unclassified_upload | no_release_number_detected |
| 12 | `hho_HRhqLVc` | Sour OG behind the deck and no shortage of energy🎥 #NDCR | unclassified_upload | no_release_number_detected |
| 13 | `vKZRo04HZ0k` | Q Radio tuning into something a little left of centre📻 #NDCR | unclassified_upload | no_release_number_detected |
| 14 | `AGgS0DvRwkE` | Sublime Sound takes things somewhere atmospheric, unexpected, and beautiful🌌 #NDCR #liveact | unclassified_upload | no_release_number_detected |
| 15 | `Cpc376hZyIM` | Aesh locked in, moving through sounds with precision and instinct🌀 #NDCR #discohouse | unclassified_upload | no_release_number_detected |
| 17 | `q-GDFHxSxF4` | Anderson1000 b2b VON RIU brings the bounce, the bass, and everything in between💥 #NDCR #leftfield | unclassified_upload | no_release_number_detected |
| 18 | `QUa__tOKQbI` | no rush, just good records and Mr. Disco Kid at work💿 #NDCR #disco #vinyl | unclassified_upload | no_release_number_detected |
| 19 | `f8qON6q3K8I` | NASH brings the kind of energy that’s hard to keep still to🔥 #NDCR #arfrohouse | unclassified_upload | no_release_number_detected |
| 20 | `OPJ9bRnRXDg` | SICKFLIP bending genres and expectations in one take⚡ #NDCR #sickflip | unclassified_upload | no_release_number_detected |
| 21 | `VvMH5MVuFcI` | MC Soopy serving selections with a little extra flavour🍨 #NDCR #housemusic | unclassified_upload | no_release_number_detected |
| 22 | `buKayidZn7M` | Sgamo finds the sweet spot between deep cuts and dancefloor pressure🫧 #NDCR #bailefunk | unclassified_upload | no_release_number_detected |
| 23 | `C9o8bXJCwnY` | Kizzi comes through with selections that hit exactly where they need to 🎯 #NDCR #desiedits | unclassified_upload | no_release_number_detected |
| 28 | `jTKSmlVOXnY` | CR #070: GLM B2B The Untitled One \| Drum & Bass, UK Garage & 140 \| 30 July 2026 | unclassified_upload | no_release_number_detected, possible_date_time_information |
| 32 | `50DfXDHKaQ0` | NDCR #066 : Q Radio (Big M B2B Vansh) \| House, Minimal, Deep House \| July 2, 2026 | ambiguous_number_candidates | numbered_release_detected_in_title, multiple_release_numbers_in_record, duplicate_release_number, suspicious_title, possible_genre_information, possible_date_time_information |
| 78 | `xMlqMHDEpnI` | Blending folk, Afro House & electronica, Tech Panda x Kenzani reshape Indian sounds 🌏 #FusionBeats | unclassified_upload | no_release_number_detected |
| 79 | `KhELOaphRCU` | Spotlighting queer + Global South voices, Despierte reshapes underground bass culture 🌍 #bassboosted | unclassified_upload | no_release_number_detected |
| 81 | `agRgZH1VfnM` | Colombian-born, UK-forged— Despierte drives club energy with UKG, breaks, dub & bass 🔊 #underground | unclassified_upload | no_release_number_detected |
| 88 | `J0UiQuW_1LE` | Breaking genre lines, building energy — Gauriwho’s sets are a journey you don’t want to miss!🎶 | unclassified_upload | no_release_number_detected |
| 89 | `O_YjI0Ynbz8` | Gauriwho on deck, bouncing between house, garage, & grooves that make it impossible to stand still💃 | unclassified_upload | no_release_number_detected |
| 90 | `cjDlXQH3rMU` | Hamza in the Mix 🔥 NDCR's All-Vinyl Special streaming exclusively on YouTube & Soundcloud! | unclassified_upload | no_release_number_detected |
| 93 | `8IN_3dXUPVY` | New Delhi’s Hamza brings a vinyl-only house set to NDCR—disco, soulful grooves & club-ready vibes 🌍💿 | unclassified_upload | no_release_number_detected |
| 95 | `JzsLtSd8q0s` | A fearless sound architect, Zokhuma blends cinematic tension with club power — hypnotic, immersive. | unclassified_upload | no_release_number_detected |
| 97 | `FG8WORcf0tg` | Real Talk Mid-Set 🎤 BYTZ & Film on Delhi’s Energy #DelhiScene #UndergroundMusic #DJSet | unclassified_upload | no_release_number_detected |
| 98 | `_J0TjRDnvAM` | Straight Energy from the Decks 💥 #LiveRecording #DelhiUnderground #PureVibes #NewDelhiScene | unclassified_upload | no_release_number_detected |
| 100 | `6C5syOgKaxA` | B2B Magic: BYTZ & Film Live at NDCR’s First IRL Recording 🎥#B2BSet #CommunityRadio #ElectronicMusic | unclassified_upload | no_release_number_detected |
| 102 | `uLVBcgmeyhk` | NDCR x DNCR \| 📍STRANGR DELHI Takeover Highlights #housemusic #collab | unclassified_upload | no_release_number_detected |
| 104 | `BZGu5UjJbbw` | What was that drop?! #bass #dnb #jungle #indianunderground #newdelhicommunityradio | unclassified_upload | no_release_number_detected |
| 105 | `tmwdog_iBUg` | Kicking off July with Delhi’s BASS DUO: UKato • Norbu 🔥🎧Set is LIVE now! | unclassified_upload | no_release_number_detected |
| 109 | `fwFIOdr5MZU` | Curing midweek blues with this banger @DJMoCityTV set. Tune in for all-things #ukg #afro #bass 📻 | unclassified_upload | no_release_number_detected |
| 110 | `ckHAIjq3aAk` | @krunklive bossman Rafiki with his eclectic mix of #house #breaks #techno and #acid. tune in! 📻 | unclassified_upload | no_release_number_detected |
| 112 | `8KhXe1M3gF8` | One for your weekend listening sesh! Aayna's #electronica #ukg #bass set is now up on YouTube! 📻 | unclassified_upload | no_release_number_detected |
| 113 | `eors401-JHI` | Aayna's hard-hitting #ukg #electronica #bass set is now up on YouTube. Tune in! 📻 | unclassified_upload | no_release_number_detected |
| 116 | `vWAL8gmoDlM` | @boxoutfm bossman DJ MoCity brings in the heat with his #bass #dancehall and #clubmusic sounds 📻 | unclassified_upload | no_release_number_detected |
| 118 | `QJAGj9KsHyI` | PRAV's genre-defying set blends #hiphop #RnB #futurebeats and everything in-between. tune in! 📻 | unclassified_upload | no_release_number_detected |
| 119 | `f3Zmtwyp-Ac` | Tune in to Sheral x Bombie's high-octane #ukbass & #leftfield mix out now on our channel 📻 | unclassified_upload | no_release_number_detected |
| 120 | `yAYimPE2buQ` | Kalbaisakhi’s high-energy #ukgarage & #breakbeat set is now streaming on our channel 📻 | unclassified_upload | no_release_number_detected |

## API and interpretation limitations

- `snippet.publishedAt` is recorded as YouTube’s platform publication timestamp only. It is **not** used as the official NDCR post/premiere date/time.
- This public API read cannot establish NDCR’s official release schedule unless that information is explicitly available from an NDCR source. `official_ndcr_release_datetime` remains null in every derived record.
- The API returns public channel uploads visible to the requesting public-data call. Private/unlisted items and owner-only metadata may require channel-owner OAuth and are not assumed present.
- Live broadcast schedule/start fields, when returned, describe YouTube broadcast metadata; they do not independently confirm NDCR’s canonical release time.
- Thumbnail URLs are references only. No thumbnail, video, or audio bytes are downloaded.
- Release number, artist, genre, and date/time detectors are candidate flags only. No title is changed and no missing release is inferred.

## Still needed from other sources or human review

- **SoundCloud:** track URL, exact title/description, its own genre/tags/artwork, track/account metadata, and whether each numbered YouTube release has a matching SoundCloud track.
- **NDCR schedules/editorial source:** official post/premiere date, time, timezone, postponements, and the source used to confirm each date/time.
- **Instagram:** schedule graphics/posts and any public announcements that corroborate official release timing or resolve title/artist corrections.
- **Human review:** canonical artist identity, title/genre disagreements, numbering anomalies, duplicate or missing platform counterparts, artwork suitability/rights, and any ambiguous uploads.

## Re-run instructions

Set `YOUTUBE_API_KEY` in the environment and run `python scripts/youtube_catalogue.py --overwrite` from the project root. `--overwrite` is required to replace either output file. The script never prints or stores the key.

No SoundCloud request, media download, website/CMS operation, or canonical release-record creation is performed by this pilot.
