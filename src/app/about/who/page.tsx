import { AboutNavigation } from "@/components/about-navigation";
import { PageShell } from "@/components/page-shell";

export const metadata = { title: "Who?", description: "Who New Delhi Community Radio is." };

export default function WhoPage() {
  return <PageShell eyebrow="About / Who" title="Who?">
    <AboutNavigation current="/about/who" />
    <div className="about-content about-content-short">
      <p>New Delhi Community Radio is a platform that aims to showcase and document alternative music; one that transcends genres and melds cultures. Streaming from the heart of New Delhi, India, NDCR converges local and global artists defying borders and formats in their music making. Expect a stream of experimental, crafty and boundary-pushing sounds emerging from India and the global music landscape.</p>
    </div>
  </PageShell>;
}
