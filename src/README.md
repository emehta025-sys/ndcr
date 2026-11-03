# Application source

The project foundation is Next.js, TypeScript, and the App Router.

- `app/` contains layouts, route pages, and global styles.
- `components/` contains shared presentation components.
- `content/` contains the canonical Release/Artist types and shared data accessors.

Canonical release and artist records are stored in `../data/catalogue/`. Release data belongs in the shared content layer. Route pages should look it up and derive their views rather than duplicating release fields.
