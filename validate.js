#!/usr/bin/env node
// Pre-push sanity checks. Run with: node validate.js
// Catches structural breakage that Sharyn would otherwise only find by
// refreshing her phone. Does NOT validate visual quality — that's still
// her call.

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = __dirname;
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const exists = (p) => fs.existsSync(path.join(root, p));

const errors = [];
const warnings = [];
const passes = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const ok = (m) => passes.push(m);

const htmlFiles = ["index.html", "about.html", "commissions.html"];

// ---- 1. main.js parses as valid JavaScript ----
try {
  execSync("node --check main.js", { stdio: "pipe", cwd: root });
  ok("main.js parses as valid JavaScript");
} catch (e) {
  const msg = e.stderr ? e.stderr.toString().trim().split("\n")[0] : e.message;
  fail("main.js has a syntax error: " + msg);
}

// ---- 2. Extract PIECES from main.js ----
let PIECES = null;
try {
  const m = read("main.js").match(/var\s+PIECES\s*=\s*(\[[\s\S]*?\]);/);
  if (!m) fail("Could not find PIECES array in main.js");
  else {
    PIECES = new Function('"use strict"; return (' + m[1] + ");")();
    ok(`PIECES array parsed: ${PIECES.length} entries`);
  }
} catch (e) {
  fail("Failed to parse PIECES: " + e.message);
}

// ---- 3. Every PIECES image exists on disk ----
if (PIECES) {
  let missing = 0;
  PIECES.forEach((p) => {
    if (!p.src || !exists(p.src)) {
      fail(`Missing gallery image: ${p.src} (piece id ${p.id})`);
      missing++;
    }
  });
  if (!missing) ok("All gallery image files exist");
}

// ---- 4. PIECES counts match filter <sup> counts ----
if (PIECES) {
  const html = read("index.html");
  const re = /data-filter="(\w+)"[^>]*>[^<]*<sup>\s*(\d+)\s*<\/sup>/g;
  const found = [...html.matchAll(re)].map(([, cat, n]) => [cat, parseInt(n, 10)]);
  const expected = {
    all: PIECES.length,
    garden: PIECES.filter((p) => p.cat === "garden").length,
    home: PIECES.filter((p) => p.cat === "home").length,
    totems: PIECES.filter((p) => p.cat === "totems").length,
  };
  if (found.length !== 4) {
    fail(`Expected 4 filter buttons in index.html, found ${found.length}`);
  } else {
    let mismatches = 0;
    found.forEach(([cat, n]) => {
      if (expected[cat] !== n) {
        fail(`Filter "${cat}" shows ${n} but PIECES has ${expected[cat]}`);
        mismatches++;
      }
    });
    if (!mismatches) ok("Filter counts match PIECES");
  }
}

// ---- 5. Internal <img> and <a href> point to existing files ----
let brokenLinks = 0;
htmlFiles.forEach((file) => {
  const html = read(file);
  const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  imgs.forEach((src) => {
    if (/^(https?:|data:|\/\/)/.test(src)) return;
    if (!exists(src)) {
      fail(`${file}: <img src="${src}"> file does not exist`);
      brokenLinks++;
    }
  });
  const links = [...html.matchAll(/<a[^>]+href="([^"]+)"/g)].map((m) => m[1]);
  links.forEach((href) => {
    if (/^(https?:|mailto:|tel:|#)/.test(href)) return;
    const target = href.split("#")[0].split("?")[0];
    if (target && !exists(target)) {
      fail(`${file}: <a href="${href}"> target does not exist`);
      brokenLinks++;
    }
  });
});
if (!brokenLinks) ok("All internal images and links resolve");

// ---- 6. Favicon link tags resolve ----
htmlFiles.forEach((file) => {
  const html = read(file);
  const fav = html.match(/<link[^>]+rel="icon"[^>]+href="([^"]+)"/);
  if (fav && !/^(https?:|data:|\/\/)/.test(fav[1]) && !exists(fav[1])) {
    fail(`${file}: favicon ${fav[1]} does not exist`);
  }
});

// ---- 7. <meta name="viewport"> present on every page (mobile critical) ----
let missingViewport = 0;
htmlFiles.forEach((file) => {
  if (!/<meta\s+name="viewport"/i.test(read(file))) {
    fail(`${file}: missing <meta name="viewport"> — mobile layout will break`);
    missingViewport++;
  }
});
if (!missingViewport) ok("All pages have viewport meta tag (mobile-safe)");

// ---- 8. No duplicate id attributes within a file ----
let dupeIds = 0;
htmlFiles.forEach((file) => {
  const ids = [...read(file).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set();
  ids.forEach((id) => {
    if (seen.has(id)) {
      fail(`${file}: duplicate id="${id}"`);
      dupeIds++;
    }
    seen.add(id);
  });
});
if (!dupeIds) ok("No duplicate IDs within any page");

// ---- 9. HTML tag balance (basic well-formedness) ----
const voidElements = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
  "meta", "param", "source", "track", "wbr", "!doctype",
]);
let balanceIssues = 0;
htmlFiles.forEach((file) => {
  const cleaned = read(file).replace(/<!--[\s\S]*?-->/g, "").replace(/<script[\s\S]*?<\/script>/g, "");
  const opens = {};
  const closes = {};
  [...cleaned.matchAll(/<(\w+|!doctype)\b[^/>]*?>/gi)].forEach((m) => {
    const tag = m[1].toLowerCase();
    if (!voidElements.has(tag)) opens[tag] = (opens[tag] || 0) + 1;
  });
  [...cleaned.matchAll(/<\/(\w+)\s*>/g)].forEach((m) => {
    const tag = m[1].toLowerCase();
    closes[tag] = (closes[tag] || 0) + 1;
  });
  Object.keys(opens).forEach((tag) => {
    if (opens[tag] !== (closes[tag] || 0)) {
      fail(`${file}: <${tag}> tag count off — ${opens[tag]} opens vs ${closes[tag] || 0} closes`);
      balanceIssues++;
    }
  });
});
if (!balanceIssues) ok("HTML tag balance looks correct");

// ---- 10. getElementById calls reference IDs that exist on the loading page ----
function getById(text) {
  return [...text.matchAll(/getElementById\(["']([^"']+)["']\)/g)].map((m) => m[1]);
}
function idsOf(html) {
  return new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
}
let missingIds = 0;
const indexHtmlFull = read("index.html");
const indexIds = idsOf(indexHtmlFull);
getById(read("main.js")).forEach((id) => {
  if (!indexIds.has(id)) {
    fail(`main.js: getElementById("${id}") but no matching id in index.html`);
    missingIds++;
  }
});
htmlFiles.forEach((file) => {
  const html = read(file);
  const ids = idsOf(html);
  const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  inlineScripts.forEach((s) => {
    getById(s).forEach((id) => {
      if (!ids.has(id)) {
        fail(`${file}: inline script calls getElementById("${id}") but no matching id`);
        missingIds++;
      }
    });
  });
});
if (!missingIds) ok("All getElementById calls match an actual id");

// ---- 11. Commission form attributes intact ----
const cf = read("commissions.html");
const formChecks = [
  ['data-netlify="true"', "Netlify Forms attribute"],
  ['name="commission-inquiry"', "form name"],
  ['enctype="multipart/form-data"', "multipart encoding (file uploads)"],
  ['name="form-name" value="commission-inquiry"', "hidden form-name input"],
  ['type="file"', "file input"],
  ["multiple", "multiple-files attribute on file input"],
];
let formIssues = 0;
formChecks.forEach(([needle, desc]) => {
  if (!cf.includes(needle)) {
    fail(`commissions.html: missing ${desc} — Netlify Forms will silently break`);
    formIssues++;
  }
});
if (!formIssues) ok("Commission form attributes intact");

// ---- 12. index.html loads Isotope + imagesLoaded before main.js ----
const orderedScripts = [...indexHtmlFull.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
const hasImg = orderedScripts.some((s) => s.includes("imagesloaded"));
const hasIso = orderedScripts.some((s) => s.includes("isotope"));
const mainIdx = orderedScripts.findIndex((s) => s.endsWith("main.js"));
const isoIdx = orderedScripts.findIndex((s) => s.includes("isotope"));
const imgIdx = orderedScripts.findIndex((s) => s.includes("imagesloaded"));
if (!hasImg) fail("index.html: imagesLoaded script tag missing");
if (!hasIso) fail("index.html: Isotope script tag missing");
if (mainIdx >= 0 && isoIdx >= 0 && imgIdx >= 0 && (isoIdx > mainIdx || imgIdx > mainIdx)) {
  fail("index.html: Isotope and imagesLoaded must load before main.js");
}
if (hasImg && hasIso && (mainIdx < 0 || (isoIdx < mainIdx && imgIdx < mainIdx))) {
  ok("Gallery library scripts load before main.js");
}

// ---- 13. Each gallery category in PIECES has a matching filter button ----
if (PIECES) {
  const cats = new Set(PIECES.map((p) => p.cat));
  cats.forEach((c) => {
    if (!new RegExp(`data-filter="${c}"`).test(indexHtmlFull)) {
      fail(`PIECES has category "${c}" but no matching filter button in index.html`);
    }
  });
}

// ---- 14. JS-manipulated classes have a matching CSS rule (warning only) ----
const cssText = read("styles.css");
const allJs = read("main.js") + htmlFiles.map((f) => read(f)).join("\n");
const classCalls = new Set(
  [...allJs.matchAll(/classList\.(?:add|toggle|remove)\(["']([^"'\s]+)["']/g)].map((m) => m[1])
);
classCalls.forEach((c) => {
  if (!cssText.includes("." + c)) {
    warn(`Class "${c}" is toggled by JS but has no matching .${c} rule in styles.css`);
  }
});
if (classCalls.size && warnings.length === 0) ok("All JS-toggled classes have matching CSS rules");

// ---- 15. Image weight sanity (warn if any image > 1MB) ----
function walkImages(dir) {
  const out = [];
  if (!exists(dir)) return out;
  fs.readdirSync(path.join(root, dir), { withFileTypes: true }).forEach((entry) => {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkImages(rel));
    else if (/\.(jpe?g|png|webp|gif|avif)$/i.test(entry.name)) out.push(rel);
  });
  return out;
}
const heavyImages = walkImages("images").filter(
  (img) => fs.statSync(path.join(root, img)).size > 1024 * 1024
);
heavyImages.forEach((img) => {
  const mb = (fs.statSync(path.join(root, img)).size / 1024 / 1024).toFixed(2);
  warn(`${img} is ${mb}MB — consider downscaling (sips -Z 1600 path --setProperty formatOptions 78 -o path)`);
});
if (!heavyImages.length) ok("All images under 1MB");

// ---- Output ----
console.log("");
passes.forEach((m) => console.log("  [ok]   " + m));
warnings.forEach((m) => console.log("  [warn] " + m));
errors.forEach((m) => console.log("  [fail] " + m));
console.log("");
const tally = `${passes.length} ok, ${warnings.length} warn, ${errors.length} fail`;
if (errors.length) {
  console.log(`${tally} — fix failures before pushing.`);
  process.exit(1);
} else if (warnings.length) {
  console.log(`${tally} — push allowed, but review warnings.`);
  process.exit(0);
} else {
  console.log(`${tally} — all checks passed.`);
  process.exit(0);
}
