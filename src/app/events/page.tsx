import Image from "next/image";
import eventRecords from "../../../data/catalogue/ndcr-events.json";
import type { NDCRCatalogEvent } from "@/content/release-schema";
import { PageShell } from "@/components/page-shell";

export const metadata = { title: "Events", description: "NDCR gatherings and event documentation." };

function EventListing({ events }: { events: NDCRCatalogEvent[] }) {
  return <div className="event-list">{events.map((event) => <article className="event-detail" key={event.id}>
    <div className="event-detail-copy">
      <p className="eyebrow"><time dateTime={event.date}>{new Date(`${event.date}T12:00:00`).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</time>{event.timeText ? ` · ${event.timeText}` : ""}</p>
      <h2>{event.title}</h2>
      {event.subtitle ? <p className="event-subtitle">{event.subtitle}</p> : null}
      <p>{event.venue} · {event.city}</p>
      {event.rsvpUrl ? <a className="button-link event-rsvp" href={event.rsvpUrl} target="_blank" rel="noopener noreferrer">RSVP <span aria-hidden="true">↗</span></a> : null}
    </div>
    <Image className="event-flyer" src={event.flyer} alt={`${event.title} event poster`} width={4500} height={5625} priority sizes="(max-width: 700px) 80vw, 34vw" />
  </article>)}</div>;
}

export default function EventsPage() {
  const events = eventRecords as NDCRCatalogEvent[];
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const upcoming = events.filter((event) => event.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter((event) => event.date < today).sort((a, b) => b.date.localeCompare(a.date));
  return <PageShell eyebrow="Events" title="Gatherings">
    <p className="page-intro">NDCR events, gatherings, and documentation.</p>
    <section aria-labelledby="upcoming-events-title">
      <h2 id="upcoming-events-title" className="section-heading">Upcoming</h2>
      {upcoming.length ? <EventListing events={upcoming} /> : null}
    </section>
    {past.length ? <section aria-labelledby="past-events-title"><h2 id="past-events-title" className="section-heading">Past events</h2><EventListing events={past} /></section> : null}
  </PageShell>;
}
