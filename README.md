# Pot Lady Studios

Portfolio website for **Pot Lady Studios** — handmade ceramics by Sharyn Kohen,
born from vintage finds and garden landscapes.

**Live:** https://potladystudios.com

## Stack

Plain static HTML/CSS/JS. No framework, no build step, no dependencies.

## Local preview

Open index.html directly in a browser, or serve the directory:

    python3 -m http.server

## Deploy

Deployed via **GitHub Pages**, serving the `main` branch directly at the
custom domain in `CNAME` (potladystudios.com). There is no deploy command —
anything that lands on `main` publishes automatically.

## Maintenance

Most changes are authored by Sharyn through Claude Code Remote (cloud
sessions). GitHub Pages auto-publishes `main`, so changes go live a
minute or two after they land on `main`.

See **CLAUDE.md** for the full collaboration workflow, design system,
and how to add or remove gallery pieces.
