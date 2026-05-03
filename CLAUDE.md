# Pot Lady Studios

Portfolio site for Sharyn Kohen's hand-built ceramics practice. Multi-page
static site (index / about / commissions), zero build step.

## Design system

- **Palette** (see :root in styles.css): bone #efede5 ground, ink #1b2320 text,
  stone #6e685c secondary, cobalt #265c6b accent, celadon #88a593.
- **Type:** Cormorant (display serif) + Archivo (UI sans), Google Fonts CDN.
- **Voice:** down-to-earth, first-person. Avoid gallery-speak ("The Collection",
  "curated", etc.) — owner explicitly flagged this.
- **Logo:** images/logo.png (nav + favicon). Footer is text-only because the
  PNG boxes on the dark background.

## Structure

    index.html        home: hero / process / gallery (with lightbox) / footer
    about.html        about: profile image + bio
    commissions.html  commissions: intro copy + inquiry form
    styles.css        all styles, CSS custom properties at :root
    main.js           index.html only — PIECES data + gallery render, filter, lightbox
    images/           logo.png, profile.jpg, garden/, home/, totems/
    netlify.toml      publish = "."

Each page has its own inline `<script>` for nav-scroll state and `.reveal`
animations. main.js is loaded only on index.html (it errors if `gallery-grid`
isn't in the DOM). commissions.html has its own inline mailto submit handler.

## Adding a piece to the gallery

1. Drop the image in images/garden|home|totems/
2. Append { id, cat, src } to the PIECES array in main.js
3. Bump the <sup> count on the matching filter button in index.html

## Commission form

Lives on commissions.html. Builds a mailto:sharyn.kohen@gmail.com link from
form fields (handler is inline at the bottom of commissions.html). To switch
to Netlify Forms instead: add data-netlify="true" and a hidden form-name
input to the <form>, then delete the inline JS submit handler.

## Deploy

Linked to Netlify project pot-lady-studios-qifrf. From repo root:

    netlify deploy --prod --dir .

The .netlify/ state folder is gitignored — run "netlify link" on a fresh clone.
