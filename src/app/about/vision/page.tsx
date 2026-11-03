import { AboutNavigation } from "@/components/about-navigation";
import { PageShell } from "@/components/page-shell";

export const metadata = { title: "Vision", description: "NDCR’s vision for local talent, third spaces, and sonic exploration." };

export default function VisionPage() {
  return <PageShell eyebrow="About / Vision" title="Vision">
    <AboutNavigation current="/about/vision" />
    <div className="about-content">
      <p>At NDCR, we are constantly looking to break new ground on existing music frontiers by spotlighting local talent. We intend to create an even playing field for local talent to showcase, perform and access their audience. We believe that this is an era for third spaces. Something between the online and the offline, a space where the two converge. NDCR is one such alternate space where music, art and exploration can co-exist.</p>
      <p>NDCR is cultivating a culture of curiosity, deep listening, and sonic exploration. Rooted in local soundscapes, we aim to document and share India’s evolving sonic identity with the world. Genre-fluid and unrestricted by borders or language, NDCR is a democratic space for curious listeners. We challenge hyper-curated algorithms and automated discovery, instead offering a platform where artists create and audiences explore organically.</p>
    </div>
  </PageShell>;
}
