import { AboutNavigation } from "@/components/about-navigation";
import { PageShell } from "@/components/page-shell";

export const metadata = { title: "What?", description: "What New Delhi Community Radio is and what it documents." };

export default function WhatPage() {
  return <PageShell eyebrow="About / What" title="What?">
    <AboutNavigation current="/about/what" />
    <div className="about-content">
      <p>Besides building a stream for local acts to consistently push their sound, NDCR is also an archive of global music talent that has left a mark on the country through their tours, shows and more. We are an open platform that is driven purely by boundary pushing music and creators with penchant to make their listeners think. NDCR is building a new palette for listeners of today. Those who are conscious of their taste and are looking to explore further.</p>
      <p>NDCR is an archive of audio histories and a documentation of sonic futures. We are a community-driven radio station that handpicks the choicest of emerging and established Indian and global talent in the realm of music. Stationed in New Delhi, our sole aim is to push the boundaries of what the art of listening means to the audience of today. This community is a dialogue starter and a means of spotlighting talent that is shaping the Indian music culture today.</p>
    </div>
  </PageShell>;
}
