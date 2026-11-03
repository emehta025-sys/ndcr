# NDCR Website Project Rules

## Purpose

Build a professional website for New Delhi Community Radio (NDCR) through a deliberate sequence: research, architecture, visual direction, implementation, testing, and refinement. The project owner has approved a Next.js + TypeScript App Router foundation with local structured development content and no CMS. Do not treat scaffold names as approval to implement unapproved content or functionality.

## Source of truth and content integrity

- Do not invent or imply NDCR facts, mission statements, history, programmes, schedules, hosts, artists, events, audience figures, contact details, partnerships, or policies.
- Use only information supplied by NDCR or confirmed through sources the project owner approves. Keep source notes and review status with content during research.
- Clearly label any temporary editorial placeholders. Never publish placeholder copy, fabricated metadata, stock imagery presented as NDCR material, or unverified translations.
- Do not create a logo, visual identity, or brand claims without approved references and direction.
- Ask for evidence when a requested detail is missing; do not fill gaps with plausible-sounding copy.

## Product and visual principles

- Make the site feel like a credible cultural platform grounded in Delhi and India, informed by research and approved local context.
- Avoid generic SaaS templates, generic AI gradients, and futuristic “tech radio” styling.
- Establish visual direction with references and rationale before implementation. Do not assume a color palette, typography, imagery, or tone on NDCR’s behalf.
- Design mobile-first and support narrow screens, touch interaction, zoom, and reduced motion.
- Keep navigation and page structures understandable; do not add functionality without a documented user need and owner approval.

## Engineering principles

- Choose the framework, language, build system, and dependencies only after the architecture/research phase; keep this scaffold framework-neutral until then.
- Prefer semantic HTML, progressive enhancement, small client-side bundles, and server-rendered or statically rendered pages where suitable.
- Keep content, presentation, and behavior separate. Use reusable components only where they improve consistency and maintainability.
- Keep dependencies purposeful, current, and minimal. Record material choices and tradeoffs in `docs/`.
- Treat external media and embeds as optional enhancements; provide accessible fallbacks and avoid loading heavy third-party code by default.
- Never commit secrets, credentials, private personal data, or unlicensed media.

## Accessibility, performance, and discoverability

- Target WCAG 2.2 AA. Use semantic landmarks, logical heading order, keyboard-operable controls, visible focus, sufficient contrast, descriptive link names, captions/transcripts where relevant, and useful text alternatives.
- Respect reduced-motion preferences; avoid autoplaying audio or video. Make playback behavior and controls clear if audio is later approved.
- Optimize images and fonts, reserve layout space, lazy-load non-critical media, and measure real user experience. Set performance budgets after the stack and content needs are known.
- Provide meaningful titles, descriptions, canonical/robots behavior, social metadata, and structured data only when supported by verified content. Do not fabricate structured facts.

## Workflow and quality

- Work in the agreed sequence: research → architecture → visual direction → implementation → testing → refinement. Record decisions and open questions in `docs/`.
- Before implementation, review the repository and follow this file plus any more-specific `AGENTS.md` files.
- Make focused changes and explain their purpose. Do not add tests, dependencies, build tooling, or generated assets until the architecture and implementation phase calls for them.
- When implementation begins, verify the relevant build, accessibility, responsive behavior, performance, and SEO; report what was and was not checked.
- Keep the repository documentation accurate as decisions are made. Do not claim the site is production-ready until it has been implemented and reviewed.

## Current phase boundary

The project owner has approved the Next.js + TypeScript App Router foundation, local structured content for initial development, and the routes `/`, `/radio`, `/radio/[release]`, `/artists`, `/artists/[artist]`, `/events`, and `/about`. Initial route/data scaffolding is authorized. Only the three explicitly illustrative release examples (#009, #018, #019) may be used as development samples until the verified catalogue is complete. Do not represent those examples as the full catalogue, infer missing values, or treat development scaffolding as approval of final page design or functionality.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
