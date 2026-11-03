"use client";

import Image from "next/image";
import Link from "next/link";

export function NDCRBrandLink() {
  return (
    <Link className="wordmark-lockup" href="/" aria-label="NDCR home">
      <span className="wordmark-image-wrap">
        <Image className="wordmark-logo wordmark-logo-default" src="/media/logos/ndcr-mark.png" alt="" width={4500} height={4083} sizes="(max-width: 700px) 3.6rem, 4.7rem" priority />
        <Image className="wordmark-logo wordmark-logo-hover" src="/media/logos/ndcr-logo-hover.png" alt="" width={4500} height={4082} sizes="(max-width: 700px) 3.6rem, 4.7rem" />
      </span>
    </Link>
  );
}
