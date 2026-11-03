/** Public catalogue values and internal-only research fields share one canonical record. */
export type ArtistLink = { artist_name?: string; label: string; url: string };

export type Artist = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  externalLinks: { label: string; url: string }[];
  releaseSlugs: string[];
};

export type YouTubeCandidate = {
  videoId: string;
  url: string;
  title: string;
  description: string;
  playlistPosition: number;
};

export type Release = {
  id: string;
  slug: string;
  setNumber: string;
  title: string;
  artistId: string | null;
  artistIds: string[];
  artistCredit: string;
  releaseDate: string | null;
  releaseDateText: string | null;
  releaseTime: string | null;
  releaseTimezone: string | null;
  genres: string[];
  /** Exact YouTube description when available. */
  description: string | null;
  youtubeUrl: string;
  youtubeVideoId: string;
  youtubeThumbnail: string | null;
  youtubePlatformPublishedAt: string | null;
  /** Public YouTube view count as returned by the API; never a canonical release fact. */
  youtubeViewCount?: string | null;
  youtubeDuration: string | null;
  soundcloudUrl: string | null;
  artistLinks: ArtistLink[];
  eventIds: string[];
  collaborationIds: string[];
  status: "released";
  featured: boolean;
  verificationStatus: "verified" | "partially_verified" | "needs_review";
  reviewFlags: string[];
  youtubeCandidates: YouTubeCandidate[];
};

/** Minimal view model passed to the browser-only continuous radio player. */
export type RadioQueueItem = Pick<Release, "slug" | "setNumber" | "title" | "artistCredit" | "genres" | "youtubeVideoId">;

export type NDCRCatalogEvent = {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  timeText?: string;
  venue: string;
  city: string;
  flyer: string;
  rsvpUrl?: string;
  source: string;
};
