import Image from "next/image";
import Link from "next/link";
import eventRecords from "../../data/catalogue/ndcr-events.json";
import { BurstMark } from "@/components/burst-mark";
import { EditorialSection } from "@/components/editorial-section";
import { getFeaturedRelease, getLatestRelease, getArtistForRelease, getRadioQueue, getReleaseHref, getReleaseLabel, getArchiveReleases } from "@/content/catalogue";
import type { NDCRCatalogEvent } from "@/content/release-schema";
import { NDCRRadio } from "@/components/ndcr-radio";
import { HeroLogoTrigger } from "@/components/hero-logo-trigger";
import { selectedHomePhotos } from "@/content/photo-library";
import { TransmissionField } from "@/components/transmission-field";
import { MobileArchiveStack } from "@/components/mobile-archive-stack";

function prettyDate(value: string | null) {
  if (!value) return null;
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

export default function HomePage() {
  const latest = getLatestRelease();
  const featured = getFeaturedRelease();
  const latestArtist = latest ? getArtistForRelease(latest) : undefined;
  const featuredArtist = featured ? getArtistForRelease(featured) : undefined;
  const archiveStack = getArchiveReleases()
    .filter((release) => release.releaseDate && release.verificationStatus !== "needs_review")
    .sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? "") || Number(b.slug) - Number(a.slug))
    .slice(3, 9)
    .map((release) => ({
      slug: release.slug,
      label: release.setNumber.startsWith("CR #") ? release.setNumber : `#${release.setNumber}`,
      artistCredit: release.artistCredit,
      releaseDate: release.releaseDate,
      genres: release.genres,
      youtubeThumbnail: release.youtubeThumbnail,
    }));
  const radioQueue = getRadioQueue().map(({ slug, setNumber, title, artistCredit, genres, youtubeVideoId }) => ({ slug, setNumber, title, artistCredit, genres, youtubeVideoId }));
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const upcoming = (eventRecords as NDCRCatalogEvent[])
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  return <main className="home-page">
    <TransmissionField />
    <section aria-labelledby="home-title" className="home-hero">
      <div className="hero-composition">
        <div className="hero-copy">
          <h1 className="hero-title" id="home-title"><span>New Delhi</span><span>Community</span><span className="hero-title-last">Radio<span className="hero-period">.</span></span></h1>
          <div className="hero-bottomline"><p>Sets, artists, and gatherings from New Delhi Community Radio.</p><Link className="hero-cta" href="/radio"><span>Enter the archive</span><span aria-hidden="true">↘</span></Link></div>
        </div>
        <div className="hero-graphic"><HeroLogoTrigger /></div>
      </div>
    </section>

    <div className="home-sections">
      <EditorialSection accent="cyan" className="home-current-section" id="latest-release" index="01" label="RADIO / LATEST" title="Latest mix">
        {latest ? <div className="current-release-slot">
          {latest.youtubeThumbnail ? <div className="slot-artwork" aria-hidden="true"><Image src={latest.youtubeThumbnail} alt="" fill sizes="(max-width: 700px) 4.5rem, 12vw" unoptimized /></div> : <div className="slot-symbol" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <span key={i} />)}</div>}
          <div className="slot-copy"><p className="slot-status"><span className="status-square" /> {prettyDate(latest.releaseDate)}</p><p className="slot-description">{getReleaseLabel(latest)} · {latestArtist?.name ?? latest.artistCredit}</p>
            {latest.genres.length ? <p className="latest-genres">{latest.genres.join(" / ")}</p> : null}
            <Link className="text-link" href={getReleaseHref(latest)}>Open the set <span aria-hidden="true">↗</span></Link>
          </div>
        </div> : <p>Explore the NDCR set archive.</p>}
        <NDCRRadio queue={radioQueue} />
      </EditorialSection>

      <EditorialSection accent="pink" className="home-event-section" id="upcoming-event" index="03" label="EVENTS / UPCOMING" title="Gather together">
        {upcoming ? <div className="home-event-feature">
          <div className="home-event-copy">
            <p className="slot-status"><span className="status-square" /> {prettyDate(upcoming.date)} · {upcoming.timeText}</p>
            <h3>{upcoming.title}<span>{upcoming.subtitle}</span></h3>
            <p className="event-location">{upcoming.venue} · {upcoming.city}</p>
            <div className="event-actions">
              {upcoming.rsvpUrl ? <a className="button-link event-rsvp" href={upcoming.rsvpUrl} target="_blank" rel="noopener noreferrer">RSVP <span aria-hidden="true">↗</span></a> : null}
              <Link className="text-link" href="/events">Event details <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <Link className="home-event-poster" href="/events" aria-label="View Dedh Saal event details">
            <Image src={upcoming.flyer} alt="NDCR Presents Dedh Saal — Diwali Special event poster" width={4500} height={5625} sizes="(max-width: 700px) 80vw, 34vw" />
          </Link>
        </div> : <Link className="text-link" href="/events">Explore NDCR events <span aria-hidden="true">↗</span></Link>}
      </EditorialSection>

      {featured ? <EditorialSection accent="green" className="home-sample-section" id="featured-release" index="04" label="RADIO / SELECTED" title="From the archive">
        <article className="release-feature">
          <Link className="release-feature-art" href={getReleaseHref(featured)} aria-label={`Open ${getReleaseLabel(featured)} by ${featuredArtist?.name ?? featured.artistCredit}`}>
            {featured.youtubeThumbnail ? <Image src={featured.youtubeThumbnail} alt="" fill sizes="(max-width: 700px) 100vw, 35vw" unoptimized /> : <BurstMark className="feature-burst" />}
            <span className="feature-art-index">NDCR</span><span className="feature-art-number">{featured.slug}</span><span className="feature-art-foot">THE SET ARCHIVE</span>
          </Link>
          <div className="release-feature-copy">
            <p className="feature-release-number">{getReleaseLabel(featured)}</p><h3>{featuredArtist?.name ?? featured.artistCredit}</h3>
            {featured.genres.length ? <p className="feature-genres">{featured.genres.join(" / ")}</p> : null}
            {prettyDate(featured.releaseDate) ? <p className="feature-note">{prettyDate(featured.releaseDate)}</p> : null}
            <Link className="text-link" href={getReleaseHref(featured)}>Open the set <span aria-hidden="true">↗</span></Link>
          </div>
        </article>
        <MobileArchiveStack cards={archiveStack} />
      </EditorialSection> : null}

      <EditorialSection accent="cyan" className="home-photography-section" id="archive-image" index="05" label="RADIO / IMAGE" title="A frame from a set">
        <div className="event-photo-essay">
          {selectedHomePhotos.map((photo, index) => <figure className={`event-photo event-photo-${index + 1}`} key={photo.src}>
            <Image src={photo.src} alt={photo.alt} width={6000} height={4000} sizes="(max-width: 700px) 90vw, (max-width: 1000px) 45vw, 30vw" />
            <figcaption>Ek Saal · New Delhi</figcaption>
          </figure>)}
        </div>
      </EditorialSection>
    </div>
  </main>;
}
