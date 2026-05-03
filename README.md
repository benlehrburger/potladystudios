# Pot Lady Studios

Portfolio website for **Pot Lady Studios** — handmade ceramics by Sharyn Kohen,
born from vintage finds and garden landscapes.

**Live:** https://potladystudios.netlify.app

## Stack

Plain static HTML/CSS/JS. No framework, no build step, no dependencies.

## Local preview

Open index.html directly in a browser, or serve the directory:

    python3 -m http.server

## Deploy

    netlify deploy --prod --dir .

## Maintenance

Most changes are authored by Sharyn through Claude Code Remote (cloud
sessions). The deploy pipeline auto-publishes `main`, so changes go live a
minute or two after they land on `main`.

See **CLAUDE.md** for the full collaboration workflow, design system,
and how to add or remove gallery pieces.
