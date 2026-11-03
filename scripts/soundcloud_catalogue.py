#!/usr/bin/env python3
"""Read-only export of a public SoundCloud user's tracks via the official API.

Requires SOUNDCLOUD_CLIENT_ID and SOUNDCLOUD_CLIENT_SECRET. Raw API responses
are preserved; release-number analysis is kept in separate derived fields.
No media is downloaded and no cross-platform matches are made.
"""

from __future__ import annotations

import argparse
import base64
import datetime as dt
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


API_BASE = "https://api.soundcloud.com"
TOKEN_URL = "https://secure.soundcloud.com/oauth/token"
PROFILE_URL = "https://soundcloud.com/new-delhi-community-radio"
RELEASE_PATTERN = re.compile(r"\bNDCR\s*#\s*(\d{1,4})\b", re.IGNORECASE)
DATE_PATTERN = re.compile(
    r"\b(?:20\d{2}[-/.]\d{1,2}[-/.]\d{1,2}|"
    r"\d{1,2}[-/.]\d{1,2}[-/.](?:20)?\d{2}|"
    r"(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|"
    r"Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|"
    r"Dec(?:ember)?)\s+\d{1,2}(?:,?\s+20\d{2})?)\b",
    re.IGNORECASE,
)
GENERIC_TITLE_PATTERN = re.compile(r"(?i)^\s*(?:untitled|no title|track \d+|unknown)\s*$")
MAX_RETRIES = 5
DEFAULT_JSON = Path("data/raw/soundcloud-catalogue.json")
DEFAULT_REPORT = Path("docs/soundcloud-catalogue-pilot.md")


class ApiError(RuntimeError):
    """Sanitized API failure that does not expose credentials or tokens."""


def request_json(
    url: str,
    *,
    method: str = "GET",
    headers: dict[str, str] | None = None,
    body: bytes | None = None,
) -> dict[str, Any]:
    request = urllib.request.Request(
        url,
        data=body,
        headers={"Accept": "application/json; charset=utf-8", "User-Agent": "NDCR-catalogue-pilot/1.0", **(headers or {})},
        method=method,
    )
    for attempt in range(MAX_RETRIES):
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                payload = json.loads(response.read().decode("utf-8"))
            if not isinstance(payload, dict):
                raise ApiError("SoundCloud API returned an unexpected JSON shape.")
            return payload
        except urllib.error.HTTPError as exc:
            status = exc.code
            if status in (429, 500, 502, 503, 504) and attempt + 1 < MAX_RETRIES:
                retry_after = exc.headers.get("Retry-After")
                try:
                    delay = min(float(retry_after), 60) if retry_after else 2**attempt
                except ValueError:
                    delay = 2**attempt
                time.sleep(delay)
                continue
            # Do not print exception text, response bodies, or credential-bearing URLs.
            raise ApiError(f"SoundCloud API request failed (HTTP {status}).") from None
        except (urllib.error.URLError, TimeoutError):
            if attempt + 1 < MAX_RETRIES:
                time.sleep(2**attempt)
                continue
            raise ApiError(f"Could not reach the SoundCloud API after {MAX_RETRIES} attempts.") from None
        except json.JSONDecodeError:
            raise ApiError("SoundCloud API returned invalid JSON.") from None
    raise ApiError("SoundCloud API request failed after retries.")


def get_access_token(client_id: str, client_secret: str) -> str:
    basic = base64.b64encode(f"{client_id}:{client_secret}".encode("utf-8")).decode("ascii")
    payload = request_json(
        TOKEN_URL,
        method="POST",
        headers={
            "Authorization": f"Basic {basic}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body=urllib.parse.urlencode({"grant_type": "client_credentials"}).encode("ascii"),
    )
    token = payload.get("access_token")
    if not isinstance(token, str) or not token:
        raise ApiError("SoundCloud token response did not contain an access token.")
    return token


def api_get(url: str, access_token: str) -> dict[str, Any]:
    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme != "https" or parsed.netloc.lower() != "api.soundcloud.com":
        raise ApiError("Refusing to follow a SoundCloud pagination link outside the official API host.")
    return request_json(url, headers={"Authorization": f"OAuth {access_token}"})


def resolve_profile(access_token: str) -> dict[str, Any]:
    resolve_url = f"{API_BASE}/resolve?{urllib.parse.urlencode({'url': PROFILE_URL})}"
    user = api_get(resolve_url, access_token)
    if not user.get("urn") and not user.get("id"):
        raise ApiError("Resolved profile response has no user identifier (URN or ID).")
    return user


def fetch_track_pages(user: dict[str, Any], access_token: str) -> list[dict[str, Any]]:
    user_identifier = user.get("urn") or user.get("id")
    encoded_identifier = urllib.parse.quote(str(user_identifier), safe="")
    params = urllib.parse.urlencode({"linked_partitioning": "true", "limit": 200})
    next_url: str | None = f"{API_BASE}/users/{encoded_identifier}/tracks?{params}"
    pages: list[dict[str, Any]] = []
    seen: set[str] = set()
    while next_url:
        if next_url in seen:
            raise ApiError("SoundCloud pagination repeated a next_href; stopping to avoid a loop.")
        seen.add(next_url)
        page = api_get(next_url, access_token)
        collection = page.get("collection")
        if not isinstance(collection, list):
            raise ApiError("SoundCloud track collection response has no collection array.")
        pages.append(page)
        next_href = page.get("next_href")
        if next_href is not None and not isinstance(next_href, str):
            raise ApiError("SoundCloud returned an invalid next_href value.")
        next_url = next_href
    return pages


def analyze_track(track: dict[str, Any]) -> dict[str, Any]:
    title = track.get("title") if isinstance(track.get("title"), str) else ""
    description = track.get("description") if isinstance(track.get("description"), str) else ""
    title_numbers = [int(value) for value in RELEASE_PATTERN.findall(title)]
    description_numbers = [int(value) for value in RELEASE_PATTERN.findall(description)]
    flags: list[str] = []
    if title_numbers:
        flags.append("numbered_release_detected_in_title")
    else:
        flags.append("no_release_number_detected_in_title")
    if description_numbers:
        flags.append("number_candidate_in_description")
    if track.get("metadata_artist"):
        flags.append("possible_artist_information")
    if track.get("genre") or track.get("tag_list"):
        flags.append("possible_genre_information")
    date_candidates = sorted(set(DATE_PATTERN.findall(f"{title}\n{description}")))
    if date_candidates:
        flags.append("possible_date_information")
    title_distinct = sorted(set(title_numbers))
    suspicious_reasons: list[str] = []
    if not title.strip() or GENERIC_TITLE_PATTERN.match(title):
        suspicious_reasons.append("empty_or_generic_title")
    if len(title_distinct) > 1:
        suspicious_reasons.append("multiple_release_numbers_in_title")
    if len(set(description_numbers)) > 1:
        suspicious_reasons.append("multiple_release_numbers_in_description")
    if suspicious_reasons:
        flags.append("suspicious_or_ambiguous_title")
    return {
        "release_number_candidates": title_distinct,
        "description_release_number_candidates": sorted(set(description_numbers)),
        "possible_artist_information": track.get("metadata_artist"),
        "possible_genre_information": {
            "genre": track.get("genre"),
            "tag_list": track.get("tag_list"),
        },
        "possible_date_information": date_candidates,
        "suspicious_title_reasons": suspicious_reasons,
        "flags": flags,
    }


def flatten_tracks(pages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for page_index, page in enumerate(pages):
        for item_index, track in enumerate(page["collection"]):
            if not isinstance(track, dict):
                continue
            analysis = analyze_track(track)
            records.append(
                {
                    "raw": track,
                    "catalogue_position": len(records),
                    "page_index": page_index,
                    "item_index_in_page": item_index,
                    **analysis,
                }
            )
    title_counts: defaultdict[int, int] = defaultdict(int)
    for record in records:
        for number in record["release_number_candidates"]:
            title_counts[number] += 1
    for record in records:
        duplicated = [n for n in record["release_number_candidates"] if title_counts[n] > 1]
        if duplicated:
            record["duplicate_release_numbers"] = duplicated
            record["flags"].append("duplicate_release_number_candidate")
        else:
            record["duplicate_release_numbers"] = []
        if len(record["release_number_candidates"]) == 1 and not record["suspicious_title_reasons"]:
            record["classification"] = "numbered_release_candidate"
        elif record["release_number_candidates"]:
            record["classification"] = "ambiguous_number_candidates"
        else:
            record["classification"] = "unclassified_track"
    return records


def make_catalogue(
    *,
    status: str,
    pages: list[dict[str, Any]] | None = None,
    user: dict[str, Any] | None = None,
    error: str | None = None,
) -> dict[str, Any]:
    pages = pages or []
    records = flatten_tracks(pages)
    numbers = sorted({n for record in records for n in record["release_number_candidates"]})
    duplicate_numbers = sorted(
        n
        for n in numbers
        if sum(n in record["release_number_candidates"] for record in records) > 1
    )
    classifications = [record["classification"] for record in records]
    analysis: dict[str, Any] = {
        "track_count": len(records),
        "numbered_release_candidate_count": classifications.count("numbered_release_candidate"),
        "ambiguous_track_count": classifications.count("ambiguous_number_candidates"),
        "unclassified_track_count": classifications.count("unclassified_track"),
        "detected_release_numbers": numbers,
        "duplicate_release_numbers": duplicate_numbers,
        "possible_numbering_gaps_between_detected_endpoints": [
            n for n in range(numbers[0], numbers[-1] + 1) if n not in numbers
        ] if numbers else [],
    }
    result: dict[str, Any] = {
        "metadata": {
            "extractor": "scripts/soundcloud_catalogue.py",
            "extractor_version": "1.0.0",
            "extracted_at_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
            "source": "SoundCloud official API v2",
            "target_profile_url": PROFILE_URL,
            "extraction_status": status,
            "raw_api_values_preserved": True,
            "official_ndcr_release_time_source": "not_established_by_this_API_export",
        },
        "raw_api": {
            "resolved_user": user,
            "track_pages": pages,
        },
        "records": records,
        "analysis": analysis,
    }
    if error:
        result["metadata"]["error"] = error
    return result


def markdown_report(catalogue: dict[str, Any]) -> str:
    meta = catalogue["metadata"]
    analysis = catalogue["analysis"]
    status = meta["extraction_status"]
    nums = analysis["detected_release_numbers"]
    if nums:
        number_range = f"#{nums[0]:03d}–#{nums[-1]:03d} (observed endpoints; gaps listed in JSON)"
    else:
        number_range = "UNKNOWN — no authenticated catalogue was retrieved"
    duplicate_text = ", ".join(f"#{n:03d}" for n in analysis["duplicate_release_numbers"]) or "None detected (or not assessable before extraction)."
    gaps = ", ".join(f"#{n:03d}" for n in analysis["possible_numbering_gaps_between_detected_endpoints"]) or "None detected (or not assessable before extraction)."
    lines = [
        "# SoundCloud Catalogue Pilot Report",
        "",
        f"**Extraction time (UTC):** `{meta['extracted_at_utc']}`  ",
        "**Source:** SoundCloud official API v2  ",
        f"**Target profile:** [{PROFILE_URL}]({PROFILE_URL})  ",
        f"**Status:** `{status}`  ",
        "**Raw catalogue:** `data/raw/soundcloud-catalogue.json`",
        "",
        "## Extraction summary",
        "",
        f"- Tracks retrieved: **{analysis['track_count']}**",
        f"- Likely numbered release candidates: **{analysis['numbered_release_candidate_count']}**",
        f"- Detected title-number range: **{number_range}**",
        f"- Tracks with duplicate candidate numbers: **{analysis['ambiguous_track_count']} ambiguous tracks**; numbers: {duplicate_text}",
        f"- Unclassified tracks: **{analysis['unclassified_track_count']}**",
        f"- Possible numbering gaps: {gaps}",
        "",
        "Derived candidates and flags are separate from each exact `raw_api` track object. No SoundCloud track is matched to a YouTube item or canonical NDCR release by this extractor.",
        "",
        "## Access and limitations",
        "",
        "The official API requires a registered SoundCloud application and OAuth Client Credentials for public-resource access. SoundCloud’s current registration guide requires an Artist Pro subscription to create or retrieve app credentials. The environment used for this run did not provide `SOUNDCLOUD_CLIENT_ID` or `SOUNDCLOUD_CLIENT_SECRET`.",
        "",
        "No password, private session, hidden client ID, unofficial endpoint, or page scraping was used. No media was downloaded. Public API results will not include private/account-only tracks; those would require owner-authorized OAuth and are outside this public catalogue pilot.",
        "",
        "## Metadata and timestamp handling",
        "",
        "Each returned track is preserved as received under `raw_api.track_pages[].collection[]` and again as `records[].raw`. Derived fields capture title release-number candidates, description-number candidates, possible artist/genre/date information, duplicate-number flags, ambiguity, and classification. Track order reflects API pagination order at extraction time.",
        "",
        "SoundCloud `created_at` and other platform timestamps remain source metadata only. `official_ndcr_release_datetime` is not inferred or populated from them.",
        "",
        "## Run when authorized app credentials are available",
        "",
        "1. Register or retrieve an application through SoundCloud’s official developer flow. The registering account must have Artist Pro. Keep the client secret private.",
        "2. Set `SOUNDCLOUD_CLIENT_ID` and `SOUNDCLOUD_CLIENT_SECRET` in the shell environment.",
        "3. From the project root run:",
        "",
        "   ```powershell",
        "   $env:SOUNDCLOUD_CLIENT_ID = '…'",
        "   $env:SOUNDCLOUD_CLIENT_SECRET = '…'",
        "   python scripts/soundcloud_catalogue.py --overwrite",
        "   ```",
        "",
        "The script resolves the supplied public profile, follows official API `next_href` links until exhausted, and writes outputs only after a complete successful extraction. `--overwrite` is required to replace existing output files. Credentials and access tokens are never stored in the catalogue or printed by the extractor.",
        "",
        "## Official documentation reviewed",
        "",
        "- [SoundCloud API Guide](https://developers.soundcloud.com/docs/api/guide) — Client Credentials for public resources, OAuth token endpoint, authorization header, and pagination.",
        "- [Get a SoundCloud API key](https://developers.soundcloud.com/docs/api/register-app) — Artist Pro requirement and official app registration / credential retrieval.",
        "- [SoundCloud API Explorer](https://developers.soundcloud.com/docs/api/explorer/) — current API resource reference.",
        "- [Pagination updates](https://developers.soundcloud.com/blog/pagination-updates-on-our-api/) — follow `next_href` for user track collections.",
        "",
    ]
    if meta.get("error"):
        lines.extend(["## Extraction error", "", meta["error"], ""])
    return "\n".join(lines)


def write_outputs(catalogue: dict[str, Any], json_path: Path, report_path: Path, overwrite: bool) -> None:
    if not overwrite and (json_path.exists() or report_path.exists()):
        raise ApiError("An output file already exists; pass --overwrite to replace it.")
    json_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.parent.mkdir(parents=True, exist_ok=True)
    # Build both complete payloads before writing. A successful API extraction is
    # never replaced with partial page data.
    json_text = json.dumps(catalogue, ensure_ascii=False, indent=2) + "\n"
    report_text = markdown_report(catalogue)
    json_path.write_text(json_text, encoding="utf-8")
    report_path.write_text(report_text, encoding="utf-8")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_JSON, help=f"JSON output path (default: {DEFAULT_JSON})")
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT, help=f"Markdown report path (default: {DEFAULT_REPORT})")
    parser.add_argument("--overwrite", action="store_true", help="allow replacing the specified output files")
    args = parser.parse_args(argv)

    client_id = os.environ.get("SOUNDCLOUD_CLIENT_ID")
    client_secret = os.environ.get("SOUNDCLOUD_CLIENT_SECRET")
    if not client_id or not client_secret:
        catalogue = make_catalogue(status="not_run_credentials_missing")
        write_outputs(catalogue, args.output, args.report, args.overwrite)
        print("SoundCloud extraction not run: set SOUNDCLOUD_CLIENT_ID and SOUNDCLOUD_CLIENT_SECRET.", file=sys.stderr)
        return 2

    try:
        token = get_access_token(client_id, client_secret)
        user = resolve_profile(token)
        pages = fetch_track_pages(user, token)
        catalogue = make_catalogue(status="complete", pages=pages, user=user)
        write_outputs(catalogue, args.output, args.report, args.overwrite)
    except ApiError as exc:
        print(str(exc), file=sys.stderr)
        return 1
    print(
        f"Retrieved {catalogue['analysis']['track_count']} SoundCloud tracks; "
        f"wrote {args.output} and {args.report}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
