#!/usr/bin/env python3
"""Read-only export of a YouTube channel uploads playlist via YouTube Data API v3.

Requires YOUTUBE_API_KEY. The API key is never written to output or printed.
Raw API responses are preserved alongside separate, non-authoritative analysis.
"""

from __future__ import annotations

import argparse
import datetime as dt
import calendar
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
from pathlib import Path
from typing import Any


API_BASE = "https://www.googleapis.com/youtube/v3"
CHANNEL_HANDLE = "@NewDelhiCommunityRadio"
RELEASE_PATTERN = re.compile(r"\bNDCR\s*#\s*(\d{1,4})\b", re.IGNORECASE)
DATE_TIME_PATTERN = re.compile(
    r"\b(?:"
    r"20\d{2}[-/.]\d{1,2}[-/.]\d{1,2}|"
    r"\d{1,2}[-/.]\d{1,2}[-/.](?:20)?\d{2}|"
    r"(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|"
    r"Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|"
    r"Dec(?:ember)?)\s+\d{1,2}(?:,?\s+20\d{2})?|"
    r"(?:[01]?\d|2[0-3]):[0-5]\d(?:\s*(?:IST|UTC|GMT|[AP]M))?"
    r")\b",
    re.IGNORECASE,
)
GENRE_LABEL_PATTERN = re.compile(r"(?im)^\s*(?:genres?|style)\s*[:\-]\s*([^\r\n]+)")
TITLE_PLACEHOLDER_PATTERN = re.compile(
    r"(?i)^\s*(?:deleted video|private video|untitled|no title|test video)\s*$"
)
TITLE_RELEASE_PATTERN = re.compile(
    r"^(?P<prefix>NDCR|CR)\s*#\s*(?P<number>\d{1,4})\s*:?\s*(?P<body>.*)$", re.I
)
MONTHS = {name.lower(): index for index, name in enumerate(calendar.month_name) if name}
MONTHS.update({name.lower(): index for index, name in enumerate(calendar.month_abbr) if name})
SOCIAL_LABELS = {
    "instagram": "Instagram", "soundcloud": "SoundCloud", "youtube": "YouTube",
    "facebook": "Facebook", "twitter": "X", "x": "X", "bandcamp": "Bandcamp",
    "website": "Website", "web": "Website", "resident advisor": "Resident Advisor",
    "ra": "Resident Advisor", "spotify": "Spotify", "mixcloud": "Mixcloud",
}
MAX_RESULTS = 50
MAX_RETRIES = 5


class ApiError(RuntimeError):
    """Sanitized API failure; deliberately excludes request URLs and API keys."""


def api_get(resource: str, params: dict[str, Any], api_key: str) -> dict[str, Any]:
    query = dict(params)
    query["key"] = api_key
    request = urllib.request.Request(
        f"{API_BASE}/{resource}?{urllib.parse.urlencode(query)}",
        headers={"Accept": "application/json", "User-Agent": "NDCR-catalogue-pilot/1.0"},
        method="GET",
    )

    for attempt in range(MAX_RETRIES):
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                payload = json.loads(response.read().decode("utf-8"))
            if not isinstance(payload, dict):
                raise ApiError("YouTube API returned an unexpected JSON shape.")
            return payload
        except urllib.error.HTTPError as exc:
            # Never print exc, exc.url, or the request URL: the API key is a query parameter.
            status = exc.code
            message = ""
            try:
                body = json.loads(exc.read().decode("utf-8"))
                message = str(body.get("error", {}).get("message", ""))
            except Exception:
                pass
            if status in (429, 500, 502, 503, 504) and attempt + 1 < MAX_RETRIES:
                retry_after = exc.headers.get("Retry-After")
                try:
                    delay = min(float(retry_after), 60) if retry_after else 2**attempt
                except ValueError:
                    delay = 2**attempt
                time.sleep(delay)
                continue
            suffix = f": {message}" if message else ""
            raise ApiError(f"YouTube API request failed (HTTP {status}){suffix}") from None
        except (urllib.error.URLError, TimeoutError) as exc:
            if attempt + 1 < MAX_RETRIES:
                time.sleep(2**attempt)
                continue
            # Keep low-level exception text out of logs, as it can contain request details.
            raise ApiError(f"Could not reach the YouTube API after {MAX_RETRIES} attempts.") from None
        except json.JSONDecodeError:
            raise ApiError("YouTube API returned invalid JSON.") from None

    raise ApiError("YouTube API request failed after retries.")


def fetch_channel(api_key: str) -> dict[str, Any]:
    response = api_get(
        "channels",
        {"part": "snippet,contentDetails", "forHandle": CHANNEL_HANDLE},
        api_key,
    )
    items = response.get("items", [])
    if not items:
        raise ApiError(f"No channel was returned for handle {CHANNEL_HANDLE}.")
    if len(items) != 1:
        raise ApiError(f"Expected one channel for {CHANNEL_HANDLE}; API returned {len(items)}.")
    return response


def fetch_upload_pages(playlist_id: str, api_key: str) -> list[dict[str, Any]]:
    pages: list[dict[str, Any]] = []
    page_token: str | None = None
    while True:
        params: dict[str, Any] = {
            "part": "snippet,contentDetails",
            "playlistId": playlist_id,
            "maxResults": MAX_RESULTS,
        }
        if page_token:
            params["pageToken"] = page_token
        page = api_get("playlistItems", params, api_key)
        pages.append(page)
        page_token = page.get("nextPageToken")
        if not page_token:
            break
    return pages


def fetch_video_batches(video_ids: list[str], api_key: str) -> list[dict[str, Any]]:
    batches: list[dict[str, Any]] = []
    for start in range(0, len(video_ids), 50):
        chunk = video_ids[start : start + 50]
        batches.append(
            api_get(
                "videos",
                {
                    "part": "snippet,contentDetails,status,liveStreamingDetails,statistics",
                    "id": ",".join(chunk),
                },
                api_key,
            )
        )
    return batches


def get_video_id(item: dict[str, Any]) -> str | None:
    details = item.get("contentDetails", {})
    snippet = item.get("snippet", {})
    resource = snippet.get("resourceId", {})
    return details.get("videoId") or resource.get("videoId")


def candidate_strings(text: str) -> list[str]:
    return [match.group(0) for match in DATE_TIME_PATTERN.finditer(text)]


def parse_title_release(title: str) -> dict[str, Any]:
    match = TITLE_RELEASE_PATTERN.match(title.strip())
    if not match:
        return {"release_number_text": None, "artist_credit": None, "genres": [], "release_date": None, "release_date_text": None, "title_prefix": None}
    number_text = match.group("number")
    body = match.group("body").strip().lstrip(" :|—–-").strip()
    parts = re.split(r"\s+\|\s+", body)
    artist = parts[0].strip() if parts else None
    genre_text = parts[1].strip() if len(parts) > 1 else ""
    date_text = parts[2].strip() if len(parts) > 2 else ""
    release_date = None
    parsed_date_text = None
    date_patterns = [
        r"^(?P<month>[A-Za-z]+)\s+(?P<day>\d{1,2})(?:st|nd|rd|th)?\s*,?\s*(?P<year>20\d{2})",
        r"^(?P<day>\d{1,2})(?:st|nd|rd|th)?\s+(?P<month>[A-Za-z]+)\s+(?P<year>20\d{2})",
    ]
    for pattern in date_patterns:
        date_match = re.match(pattern, date_text, re.I)
        if date_match:
            parsed_date_text = date_match.group(0).strip()
            month = MONTHS.get(date_match.group("month").lower())
            day, year = int(date_match.group("day")), int(date_match.group("year"))
            try:
                release_date = dt.date(year, month, day).isoformat() if month else None
            except ValueError:
                pass
            break
    return {
        "release_number_text": number_text,
        "artist_credit": artist or None,
        "genres": [item.strip() for item in re.split(r",\s*", genre_text) if item.strip()],
        "release_date": release_date,
        "release_date_text": parsed_date_text or (date_text or None),
        "title_prefix": match.group("prefix"),
    }


def normalize_profile_url(label: str, value: str) -> str | None:
    value = value.strip().rstrip(".,;)")
    if not value:
        return None
    if value.startswith("http://") or value.startswith("https://"):
        return value
    if value.startswith("www."):
        return "https://" + value
    if label == "Instagram":
        username = value.lstrip("@/").split("/")[0]
        return f"https://www.instagram.com/{username}" if username else None
    if label == "SoundCloud":
        path = value.lstrip("/")
        return f"https://soundcloud.com/{path}" if path else None
    return None


def parse_artist_description_links(description: str) -> list[dict[str, str]]:
    """Read labeled links under artist headings, excluding the NDCR account block."""
    lines = description.splitlines()
    artist_section = False
    artist_name: str | None = None
    parsed: list[dict[str, str]] = []
    for line in lines:
        stripped = line.strip()
        label_match = re.match(r"^([A-Za-z][A-Za-z ]{1,30})\s*:\s*(.+?)\s*$", stripped)
        if label_match:
            raw_label, value = label_match.groups()
            label_key = raw_label.strip().lower()
            if label_key not in SOCIAL_LABELS:
                continue
            label = SOCIAL_LABELS[label_key]
            if label_key == "instagram" and ("newdelhicommunityradio" in value.lower() or value.lower().strip("/@ ") == "newdelhicommunityradio"):
                artist_section = False
                artist_name = None
                continue
            if not artist_section:
                continue
            url = normalize_profile_url(label, value)
            if url:
                parsed.append({"artist_name": artist_name or "", "label": label, "url": url})
            continue
        # A non-empty line after the NDCR account block begins an artist heading.
        if stripped and stripped.lower() in {"ndcr", "new delhi community radio"}:
            artist_section = False
            artist_name = None
        elif stripped and not re.match(r"^#", stripped) and not stripped.lower().startswith("http"):
            # Artist headings are followed by labeled fields; descriptive paragraphs are ignored
            # by only accepting a heading when the next lines contain a recognized label.
            next_lines = "\n".join(lines[lines.index(line) + 1:lines.index(line) + 4]) if line in lines else ""
            if re.search(r"(?im)^\s*(?:Instagram|SoundCloud|Website|YouTube|Bandcamp|Spotify|Mixcloud)\s*:", next_lines):
                artist_section = True
                artist_name = stripped
    return parsed


def analyse_record(
    item: dict[str, Any], video: dict[str, Any] | None, duplicate_numbers: set[int]
) -> dict[str, Any]:
    item_snippet = item.get("snippet", {})
    video_snippet = (video or {}).get("snippet", {})

    # Exact API strings are copied without cleanup. Provenance distinguishes video vs playlist item.
    title = video_snippet.get("title")
    title_source = "videos.list.snippet.title" if title is not None else None
    if title is None:
        title = item_snippet.get("title")
        title_source = "playlistItems.list.snippet.title" if title is not None else None

    description = video_snippet.get("description")
    description_source = "videos.list.snippet.description" if description is not None else None
    if description is None:
        description = item_snippet.get("description")
        description_source = (
            "playlistItems.list.snippet.description" if description is not None else None
        )

    video_id = get_video_id(item)
    title_text = title if isinstance(title, str) else ""
    description_text = description if isinstance(description, str) else ""
    title_matches = list(RELEASE_PATTERN.finditer(title_text))
    description_matches = list(RELEASE_PATTERN.finditer(description_text))
    title_numbers = [int(match.group(1)) for match in title_matches]
    description_numbers = [int(match.group(1)) for match in description_matches]
    all_numbers = sorted(set(title_numbers + description_numbers))
    title_number_matches = [match.group(1) for match in title_matches]
    parsed_title = parse_title_release(title_text)
    artist_links = parse_artist_description_links(description_text)

    flags: list[str] = []
    if title_numbers:
        flags.append("numbered_release_detected_in_title")
    elif description_numbers:
        flags.append("release_number_detected_in_description_only")
    else:
        flags.append("no_release_number_detected")
    if len(all_numbers) > 1:
        flags.append("multiple_release_numbers_in_record")
    if any(number in duplicate_numbers for number in all_numbers):
        flags.append("duplicate_release_number")

    suspicious_reasons: list[str] = []
    if not title_text:
        suspicious_reasons.append("title_missing")
    elif TITLE_PLACEHOLDER_PATTERN.match(title_text):
        suspicious_reasons.append("placeholder_or_unavailable_title")
    if description_numbers and not title_numbers:
        suspicious_reasons.append("number_appears_only_in_description")
    if len(all_numbers) > 1:
        suspicious_reasons.append("multiple_distinct_number_candidates")
    if suspicious_reasons:
        flags.append("suspicious_title")

    possible_artist_name = None
    if len(title_number_matches) == 1:
        match = RELEASE_PATTERN.search(title_text)
        assert match is not None
        suffix = title_text[match.end() :].strip(" \t:|—–-–•")
        if suffix:
            possible_artist_name = suffix

    genre_clues: list[str] = []
    for match in GENRE_LABEL_PATTERN.finditer(description_text):
        genre_clues.append(match.group(0))
    # Genre terms embedded in YouTube titles are only candidates; preserve the entire title as evidence.
    title_after_number = ""
    if len(title_number_matches) == 1:
        match = RELEASE_PATTERN.search(title_text)
        if match:
            title_after_number = title_text[match.end() :]
    if re.search(r"[|•()]|\b(?:house|techno|electronic|ambient|disco|bass|jazz|experimental)\b", title_after_number, re.I):
        genre_clues.append(title_after_number)
    if genre_clues:
        flags.append("possible_genre_information")

    possible_date_time = candidate_strings(f"{title_text}\n{description_text}")
    live_details = (video or {}).get("liveStreamingDetails", {})
    statistics = (video or {}).get("statistics", {})
    youtube_scheduled_start = live_details.get("scheduledStartTime")
    if youtube_scheduled_start:
        possible_date_time.append(f"YouTube liveStreamingDetails.scheduledStartTime: {youtube_scheduled_start}")
    if possible_date_time:
        flags.append("possible_date_time_information")

    if video is None:
        flags.append("video_details_not_returned")

    position = item_snippet.get("position")
    published_at = video_snippet.get("publishedAt")
    thumbnails = video_snippet.get("thumbnails")
    if thumbnails is None:
        thumbnails = item_snippet.get("thumbnails")

    return {
        "youtube_video_id": video_id,
        "youtube_url": f"https://www.youtube.com/watch?v={video_id}" if video_id else None,
        "title": title,
        "title_source": title_source,
        "description": description,
        "description_source": description_source,
        "thumbnail_urls": thumbnails,
        "channel_id": video_snippet.get("channelId") or item_snippet.get("channelId"),
        "channel_title": video_snippet.get("channelTitle") or item_snippet.get("channelTitle"),
        "youtube_published_at": published_at,
        "youtube_live_scheduled_start_time": youtube_scheduled_start,
        "youtube_view_count": statistics.get("viewCount"),
        "playlist_item_added_at": item_snippet.get("publishedAt"),
        "playlist_position": position,
        "official_ndcr_release_datetime": None,
        "release_number_candidates": [
            {"number": number,
             "observed_number_texts": sorted({
                 match.group(1)
                 for match in title_matches + description_matches
                 if int(match.group(1)) == number
             }),
             "source_fields": [
                 field for field, values in (("title", title_numbers), ("description", description_numbers))
                 if number in values
             ]}
            for number in all_numbers
        ],
        "possible_artist_name": possible_artist_name,
        "parsed_release_title": parsed_title,
        "artist_profile_links": artist_links,
        "possible_genre_information": genre_clues,
        "possible_date_time_information": possible_date_time,
        "suspicious_title_reasons": suspicious_reasons,
        "flags": flags,
        "classification": (
            "numbered_release"
            if title_numbers and len(all_numbers) == 1
            else "number_candidate_in_description"
            if description_numbers and not title_numbers and len(all_numbers) == 1
            else "ambiguous_number_candidates"
            if all_numbers
            else "unclassified_upload"
        ),
    }


def build_catalogue(channel_response: dict[str, Any], playlist_pages: list[dict[str, Any]], batches: list[dict[str, Any]]) -> dict[str, Any]:
    uploads = [item for page in playlist_pages for item in page.get("items", [])]
    channel = channel_response["items"][0]
    playlist_id = channel["contentDetails"]["relatedPlaylists"]["uploads"]
    video_map: dict[str, dict[str, Any]] = {}
    for batch in batches:
        for video in batch.get("items", []):
            video_map[video["id"]] = video

    preliminary_numbers: dict[int, list[int]] = defaultdict(list)
    number_lists: list[list[int]] = []
    for index, item in enumerate(uploads):
        video = video_map.get(get_video_id(item) or "")
        snippet = (video or {}).get("snippet", {})
        item_snippet = item.get("snippet", {})
        title = snippet.get("title", item_snippet.get("title", ""))
        description = snippet.get("description", item_snippet.get("description", ""))
        found = sorted(
            set(int(m.group(1)) for m in RELEASE_PATTERN.finditer(title or ""))
            | set(int(m.group(1)) for m in RELEASE_PATTERN.finditer(description or ""))
        )
        number_lists.append(found)
        for number in found:
            preliminary_numbers[number].append(index)
    duplicates = {number for number, indexes in preliminary_numbers.items() if len(indexes) > 1}

    records = []
    for item in uploads:
        video_id = get_video_id(item)
        records.append(analyse_record(item, video_map.get(video_id or ""), duplicates))

    detected_numbers = sorted(preliminary_numbers)
    gaps = []
    if detected_numbers:
        gaps = [number for number in range(detected_numbers[0], detected_numbers[-1] + 1) if number not in preliminary_numbers]

    channel_snippet = channel.get("snippet", {})
    return {
        "metadata": {
            "extractor": "scripts/youtube_catalogue.py",
            "extractor_version": "1.2.0",
            "extracted_at_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
            "source": "YouTube Data API v3",
            "channel_handle_requested": CHANNEL_HANDLE,
            "channel_id": channel.get("id"),
            "channel_title": channel_snippet.get("title"),
            "uploads_playlist_id": playlist_id,
            "uploads_playlist_pagination_complete": True,
            "playlist_item_count": len(uploads),
            "video_details_returned_count": len(video_map),
            "raw_api_values_preserved": True,
            "official_ndcr_release_time_source": "not_established_by_this_API_export",
        },
        "raw_api": {
            "channel_response": channel_response,
            "uploads_playlist_pages": playlist_pages,
            "video_detail_batches": batches,
        },
        "records": records,
        "analysis": {
            "numbered_release_video_count": sum(
                1 for record in records if record["classification"] == "numbered_release"
            ),
            "number_candidate_in_description_count": sum(
                1 for record in records if record["classification"] == "number_candidate_in_description"
            ),
            "unclassified_upload_count": sum(
                1 for record in records if record["classification"] == "unclassified_upload"
            ),
            "ambiguous_upload_count": sum(
                1 for record in records if record["classification"] == "ambiguous_number_candidates"
            ),
            "detected_release_numbers": detected_numbers,
            "duplicate_release_numbers": sorted(duplicates),
            "suspicious_gaps_between_detected_min_max": gaps,
            "gap_warning": "A numbering gap is a review flag, not proof of a missing release. No records are inferred or created.",
        },
    }


def md_list(values: list[Any]) -> str:
    return ", ".join(f"`{value}`" for value in values) if values else "None detected."


def make_report(catalogue: dict[str, Any], output_path: Path) -> str:
    meta = catalogue["metadata"]
    analysis = catalogue["analysis"]
    records = catalogue["records"]
    duplicates = set(analysis["duplicate_release_numbers"])
    suspicious = [
        record for record in records
        if record["suspicious_title_reasons"] or "duplicate_release_number" in record["flags"]
    ]
    unclassified = [record for record in records if record["classification"] != "numbered_release"]
    lines = [
        "# YouTube Catalogue Pilot Report",
        "",
        f"**Extraction time:** `{meta['extracted_at_utc']}`  ",
        f"**Source:** YouTube Data API v3  ",
        f"**Channel:** {meta.get('channel_title') or 'UNKNOWN'} (`{meta.get('channel_id') or 'UNKNOWN'}`)  ",
        f"**Uploads playlist:** `{meta.get('uploads_playlist_id') or 'UNKNOWN'}`  ",
        f"**Raw catalogue:** `{output_path.as_posix()}`  ",
        "",
        "## Extraction summary",
        "",
        f"- Upload playlist items retrieved: **{meta['playlist_item_count']}**",
        f"- Video detail records returned: **{meta['video_details_returned_count']}**",
        f"- Video records with public view counts: **{sum(1 for record in records if record.get('youtube_view_count') is not None)}**",
        f"- Likely numbered releases (number in title): **{analysis['numbered_release_video_count']}**",
        f"- Formal numbered titles with a parsed release date: **{sum(1 for record in records if record.get('parsed_release_title', {}).get('release_date'))}**",
        f"- Upload descriptions with artist profile links parsed: **{sum(1 for record in records if record.get('artist_profile_links'))}**",
        f"- Number candidates found only in descriptions: **{analysis['number_candidate_in_description_count']}**",
        f"- Unclassified uploads: **{analysis['unclassified_upload_count']}**",
        f"- Ambiguous-number uploads: **{analysis['ambiguous_upload_count']}**",
        "",
        "The JSON preserves the requested API responses under `raw_api`. The `records` and `analysis` sections are derived inspection aids; they do not alter or replace the source values.",
        "",
        *( [f"**Reprocessing note:** Derived fields were rebuilt from the saved official API response at `{meta['derived_records_reprocessed_at_utc']}`. No fresh YouTube API request was made." ] if meta.get("derived_records_reprocessed_at_utc") else [] ),
        "",
        "## Detected release numbers",
        "",
        md_list(analysis["detected_release_numbers"]),
        "",
        "## Numbers appearing missing between observed endpoints",
        "",
        md_list(analysis["suspicious_gaps_between_detected_min_max"]),
        "",
        f"**Warning:** {analysis['gap_warning']}",
        "",
        "## Duplicate or suspicious records",
        "",
        f"- Duplicate detected number(s): {md_list(analysis['duplicate_release_numbers'])}",
    ]
    if suspicious:
        lines += ["", "| Playlist position | Video ID | Title as returned | Number candidate(s) | Flag(s) |", "|---:|---|---|---|---|"]
        for record in suspicious:
            title = (record.get("title") or "UNKNOWN").replace("|", "\\|").replace("\n", " ")
            nums = ", ".join(str(item["number"]) for item in record["release_number_candidates"]) or "—"
            flags = ", ".join(record["flags"])
            lines.append(
                f"| {record.get('playlist_position', 'UNKNOWN')} | `{record.get('youtube_video_id') or 'UNKNOWN'}` | {title} | {nums} | {flags} |"
            )
    else:
        lines += ["", "No duplicate-number or suspicious-title flags were produced by the current heuristics."]
    lines += ["", "## Uploads not confidently classified", ""]
    if unclassified:
        lines += ["| Playlist position | Video ID | Title as returned | Classification | Flag(s) |", "|---:|---|---|---|---|"]
        for record in unclassified:
            title = (record.get("title") or "UNKNOWN").replace("|", "\\|").replace("\n", " ")
            lines.append(
                f"| {record.get('playlist_position', 'UNKNOWN')} | `{record.get('youtube_video_id') or 'UNKNOWN'}` | {title} | {record['classification']} | {', '.join(record['flags'])} |"
            )
    else:
        lines.append("No unclassified uploads.")
    lines += [
        "",
        "## API and interpretation limitations",
        "",
        "- `snippet.publishedAt` is recorded as YouTube’s platform publication timestamp only. It is **not** used as the official NDCR post/premiere date/time.",
        "- This public API read cannot establish NDCR’s official release schedule unless that information is explicitly available from an NDCR source. `official_ndcr_release_datetime` remains null in every derived record.",
        "- The API returns public channel uploads visible to the requesting public-data call. Private/unlisted items and owner-only metadata may require channel-owner OAuth and are not assumed present.",
        "- Live broadcast schedule/start fields, when returned, describe YouTube broadcast metadata; they do not independently confirm NDCR’s canonical release time.",
        "- Thumbnail URLs are references only. No thumbnail, video, or audio bytes are downloaded.",
        "- Release number, artist, genre, and date/time detectors are candidate flags only. No title is changed and no missing release is inferred.",
        "",
        "## Still needed from other sources or human review",
        "",
        "- **SoundCloud:** track URL, exact title/description, its own genre/tags/artwork, track/account metadata, and whether each numbered YouTube release has a matching SoundCloud track.",
        "- **NDCR schedules/editorial source:** official post/premiere date, time, timezone, postponements, and the source used to confirm each date/time.",
        "- **Instagram:** schedule graphics/posts and any public announcements that corroborate official release timing or resolve title/artist corrections.",
        "- **Human review:** canonical artist identity, title/genre disagreements, numbering anomalies, duplicate or missing platform counterparts, artwork suitability/rights, and any ambiguous uploads.",
        "",
        "## Re-run instructions",
        "",
        "Set `YOUTUBE_API_KEY` in the environment and run `python scripts/youtube_catalogue.py --overwrite` from the project root. `--overwrite` is required to replace either output file. The script never prints or stores the key.",
        "",
        "No SoundCloud request, media download, website/CMS operation, or canonical release-record creation is performed by this pilot.",
        "",
    ]
    return "\n".join(lines)


def write_exclusive_or_replace(path: Path, contents: str, overwrite: bool) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and not overwrite:
        raise ApiError(f"Refusing to overwrite existing output: {path}. Use --overwrite explicitly.")
    temp_path = path.with_name(path.name + ".tmp")
    try:
        temp_path.write_text(contents, encoding="utf-8", newline="\n")
        temp_path.replace(path)
    finally:
        if temp_path.exists():
            temp_path.unlink()


def parse_args() -> argparse.Namespace:
    root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=root / "data" / "raw" / "youtube-catalogue.json",
        help="Raw catalogue JSON output path (default: data/raw/youtube-catalogue.json).",
    )
    parser.add_argument(
        "--report",
        type=Path,
        default=root / "docs" / "youtube-catalogue-pilot.md",
        help="Human-readable report path (default: docs/youtube-catalogue-pilot.md).",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Allow replacing both output files after a successful full extraction.",
    )
    parser.add_argument(
        "--reprocess-existing",
        action="store_true",
        help="Rebuild derived fields from saved raw official API responses without requesting YouTube.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.reprocess_existing:
        if args.output.resolve() == args.report.resolve():
            print("The JSON output and Markdown report paths must be different.", file=sys.stderr)
            return 2
        if not args.output.exists():
            print(f"Existing raw catalogue not found: {args.output}", file=sys.stderr)
            return 2
        if not args.overwrite and (args.output.exists() or args.report.exists()):
            print("Reprocessing updates the derived records/report; pass --overwrite explicitly.", file=sys.stderr)
            return 2
        try:
            previous = json.loads(args.output.read_text(encoding="utf-8"))
            raw_api = previous.get("raw_api", {})
            channel = raw_api.get("channel_response")
            pages = raw_api.get("uploads_playlist_pages")
            batches = raw_api.get("video_detail_batches")
            if not channel or pages is None or batches is None:
                raise ApiError("Saved catalogue does not contain complete raw official API responses.")
            catalogue = build_catalogue(channel, pages, batches)
            catalogue["metadata"]["extracted_at_utc"] = previous.get("metadata", {}).get("extracted_at_utc")
            catalogue["metadata"]["derived_records_reprocessed_at_utc"] = dt.datetime.now(dt.timezone.utc).isoformat()
            catalogue["metadata"]["api_refreshed"] = False
            json_text = json.dumps(catalogue, ensure_ascii=False, indent=2) + "\n"
            report_text = make_report(catalogue, args.output)
            write_exclusive_or_replace(args.output, json_text, True)
            write_exclusive_or_replace(args.report, report_text, True)
        except (ApiError, OSError, json.JSONDecodeError) as exc:
            print(str(exc), file=sys.stderr)
            return 1
        print(f"Reprocessed {len(catalogue['records'])} uploads from the saved official API export; no API request was made.")
        return 0

    api_key = os.environ.get("YOUTUBE_API_KEY", "").strip()
    if not api_key:
        print(
            "YOUTUBE_API_KEY is not set. No API request was made and no catalogue file was written.\n"
            "Set the environment variable, then run: python scripts/youtube_catalogue.py",
            file=sys.stderr,
        )
        return 2

    if args.output.resolve() == args.report.resolve():
        print("The JSON output and Markdown report paths must be different.", file=sys.stderr)
        return 2
    existing = [path for path in (args.output, args.report) if path.exists()]
    if existing and not args.overwrite:
        print(
            "Refusing to overwrite existing output(s): "
            + ", ".join(str(path) for path in existing)
            + ". Pass --overwrite explicitly.",
            file=sys.stderr,
        )
        return 2

    try:
        channel_response = fetch_channel(api_key)
        channel = channel_response["items"][0]
        playlist_id = channel.get("contentDetails", {}).get("relatedPlaylists", {}).get("uploads")
        if not playlist_id:
            raise ApiError("The channel resource did not return its uploads playlist ID.")
        playlist_pages = fetch_upload_pages(playlist_id, api_key)
        uploads = [item for page in playlist_pages for item in page.get("items", [])]
        video_ids = list(dict.fromkeys(video_id for item in uploads if (video_id := get_video_id(item))))
        batches = fetch_video_batches(video_ids, api_key)
        catalogue = build_catalogue(channel_response, playlist_pages, batches)
        json_text = json.dumps(catalogue, ensure_ascii=False, indent=2) + "\n"
        report_text = make_report(catalogue, args.output)
        # All reads complete before either output is replaced. Each individual file is replaced atomically.
        write_exclusive_or_replace(args.output, json_text, args.overwrite)
        write_exclusive_or_replace(args.report, report_text, args.overwrite)
    except (ApiError, OSError) as exc:
        print(str(exc), file=sys.stderr)
        return 1

    analysis = catalogue["analysis"]
    print(f"Retrieved {catalogue['metadata']['playlist_item_count']} uploads from the channel uploads playlist.")
    print(f"Detected {analysis['numbered_release_video_count']} likely numbered releases in titles.")
    print(f"Wrote raw catalogue: {args.output}")
    print(f"Wrote report: {args.report}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
