import type { ReactNode } from "react";

type EditorialSectionProps = {
  id: string;
  index: string;
  label: string;
  title: string;
  accent?: "green" | "cyan" | "pink" | "yellow";
  className?: string;
  children: ReactNode;
};

export function EditorialSection({
  id,
  index,
  label,
  title,
  accent = "green",
  className = "",
  children,
}: EditorialSectionProps) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className={`editorial-section accent-${accent} ${className}`}
      id={id}
    >
      <div className="editorial-section-heading">
        <p className="section-index"><span>{index}</span><span>{label}</span></p>
        <h2 id={`${id}-title`}>{title}</h2>
      </div>
      <div className="editorial-section-content">{children}</div>
    </section>
  );
}
