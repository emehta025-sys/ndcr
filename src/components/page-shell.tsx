import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="page-shell">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="display-heading">{title}</h1>
      {children}
    </main>
  );
}

export function DevelopmentNotice({ children }: { children: ReactNode }) {
  return <p className="development-notice">{children}</p>;
}
