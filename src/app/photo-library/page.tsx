import { PageShell } from "@/components/page-shell";
import Image from "next/image";
import { ekSaalPhotos } from "@/content/photo-library";

export const metadata = {
  title: "Photo Library",
  description: "Photography from the NDCR media library.",
};

export default function PhotoLibraryPage() {
  return <PageShell eyebrow="Photography" title="Photo library">
    <p className="page-intro">Selected photography from the local NDCR image collection.</p>
    <section className="photo-library-section" aria-labelledby="ek-saal-heading">
      <h2 className="photo-library-heading" id="ek-saal-heading">Ek Saal</h2>
      <div className="photo-library-grid">
        {ekSaalPhotos.map((photo) => <figure className="photo-library-item" key={photo.src}>
          <Image src={photo.src} alt={photo.alt} width={1600} height={1100} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
          <figcaption>Ek Saal · New Delhi</figcaption>
        </figure>)}
      </div>
    </section>
  </PageShell>;
}
