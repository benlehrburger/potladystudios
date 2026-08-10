(function () {
  "use strict";

  var PIECES = [
    { id: 1,  cat: "home",   src: "images/home/IMG_4905.jpg", title: "Coil Built Bowl/Planter", note: "I originally made this to be a salad or pasta serving bowl but I think it makes a lovely orchid bowl too!" },
    { id: 2,  cat: "home",   src: "images/home/IMG_braided_bowl.jpg" },
    { id: 3,  cat: "home",   src: "images/home/IMG_4873.jpg" },
    { id: 4,  cat: "garden", src: "images/garden/IMG_flower_garden_collection.jpg", title: "Flower Assembly in the Garden", note: "Really enjoyed making these using various forms and patterns that I made. I think they look great as a grouping, but I also like them placed individually in pots — especially in the winter when flowers are spent; they give color and “life” to my otherwise dreary looking pots." },
    { id: 5,  cat: "garden", src: "images/garden/IMG_0199.jpg" },
    { id: 6,  cat: "garden", src: "images/garden/IMG_0212.jpg" },
    { id: 7,  cat: "garden", src: "images/garden/IMG_0065.jpg" },
    { id: 8,  cat: "garden", src: "images/garden/IMG_0216.jpg" },
    { id: 9,  cat: "garden", src: "images/garden/IMG_flower_coral_vessel.jpg" },
    { id: 10, cat: "garden", src: "images/garden/IMG_flower_pod_opening.jpg" },
    { id: 11, cat: "garden", src: "images/garden/IMG_flower_brown_bud.jpg" },
    { id: 12, cat: "garden", src: "images/garden/IMG_flower_green_star.jpg" },
    { id: 13, cat: "garden", src: "images/garden/IMG_flower_pumpkin_orange.jpg" },
    { id: 14, cat: "garden", src: "images/garden/IMG_flower_coral_top.jpg" },
    { id: 15, cat: "garden", src: "images/garden/IMG_flower_cream_bulb.jpg" },
    { id: 16, cat: "garden", src: "images/garden/IMG_flower_beaded_sphere.jpg" },
    { id: 17, cat: "garden", src: "images/garden/IMG_flower_cone_tower.jpg" },
    { id: 18, cat: "home",   src: "images/home/IMG_framed_ceramic_tiles.jpg", title: "Ceramic Tile Wall Art", note: "I really enjoyed experimenting with various shapes and sizes with these individual tiles I hand built and mounted. They look equally great hanging indoors or on a covered outdoor space. I also think they work in modern, MCM, or more vintage spaces (like mine!)." },
    { id: 19, cat: "home",   src: "images/home/IMG_tile_mosaic.jpeg", note: "This was a commission for an MCM tile wall art piece for a terrace in San Francisco overlooking Mission Bay. I shipped the tiles (and instructions) to the owner who assembled them onsite." },
    { id: 20, cat: "garden", extraCats: ["home"], src: "images/garden/IMG_face_masks_tree.jpg", caption: "Ceramic face masks on a tree", note: "For these Picasso inspired masks I experimented with underglaze in different saturations. They give color and interest to my front garden which is shady and attracts flower-eating deer. Of course these would look great indoors as well." },
    { id: 21, cat: "garden", extraCats: ["home"], src: "images/garden/IMG_face_masks_tree_2.jpg" },
    { id: 22, cat: "garden", extraCats: ["home"], src: "images/garden/IMG_face_masks_tree_3.jpg" },
    { id: 23, cat: "garden", extraCats: ["totems"], src: "images/totems/IMG_totem_planter_column.jpg", caption: "Red Clay Planter Totem", note: "I built this using a red clay and chose to keep the natural color and not to glaze it. I added the design using white underglaze and stencils. I keep this outside all winter and enjoy planting it with annuals in the spring." },
    { id: 24, cat: "home",   src: "images/home/IMG_6821.jpeg", caption: "Colorful Hug Mugs", note: "For these mugs I played with both color and texture using purchased and handmade pattern rollers and several glaze combinations. The pattern for each mug varies but I unified them by keeping the color palette consistent so they still look very much like a set." },
    { id: 25, cat: "home",   src: "images/home/IMG_6817.jpeg" },
    { id: 26, cat: "totems", src: "images/totems/IMG_silver_totem_tall.jpg", note: "This MCM inspired totem/tall sculpture was made in 4 large pieces and mounted on an acrylic base." },
    { id: 27, cat: "home",   src: "images/home/IMG_0221.jpg", caption: "Ceramic and Driftwood Bird", note: "I saw a tree branch while on a walk and it reminded me of a bird's head and neck so I made her a body out of clay!" },
    { id: 28, cat: "totems", src: "images/totems/IMG_silver_totem_short.jpg", caption: "MCM Tall Sculpture on Acrylic Base" },
    { id: 29, cat: "home",   src: "images/home/IMG_candlestick_pair_speckled.jpg", caption: "Pair of sculpted candlesticks" },
    { id: 30, cat: "home",   src: "images/home/IMG_candlesticks_white_pair.jpg" },
    { id: 31, cat: "totems", src: "images/totems/IMG_5467.jpg", caption: "Intricate Coil Built Totem Planter" },
    { id: 32, cat: "totems", src: "images/totems/IMG_5466.jpg" },
    { id: 33, cat: "garden", extraCats: ["totems"], src: "images/totems/IMG_ode_to_nala_rabbit.jpg", caption: "Ode to Nala", note: "This totem was custom made for a much loved bunny (Nala). It’s a nod to some of her favorite things and her regal demeanor. I love planning and making these personal and meaningful." },
    { id: 34, cat: "garden", extraCats: ["totems"], src: "images/totems/IMG_ode_to_nala_full.jpg" },
    { id: 35, cat: "garden", extraCats: ["totems"], src: "images/totems/IMG_ode_to_nala_house.jpg" },
    { id: 36, cat: "garden", src: "images/garden/IMG_dragonfly_succulent_pot.jpg" },
    { id: 37, cat: "garden", src: "images/garden/IMG_dragonfly_garden_bed.jpg" },
    { id: 38, cat: "garden", extraCats: ["home"], src: "images/garden/IMG_wall_pockets_trio.jpg" },
    { id: 39, cat: "garden", extraCats: ["home"], src: "images/garden/IMG_wall_pockets_tree.jpg" },
    { id: 40, cat: "garden", extraCats: ["home"], src: "images/garden/IMG_wall_pockets_tree_wide.jpg" }
  ];

  // Intrinsic thumbnail dimensions, so each grid cell reserves its space
  // before the image loads. This lets the gallery lay out and appear
  // immediately and lets off-screen thumbnails load lazily on scroll,
  // instead of blocking the whole grid on every image downloading.
  var DIMS = {
    "images/home/IMG_4905.jpg": [456, 640],
    "images/home/IMG_braided_bowl.jpg": [640, 480],
    "images/home/IMG_4873.jpg": [640, 335],
    "images/garden/IMG_0199.jpg": [555, 640],
    "images/garden/IMG_0212.jpg": [588, 640],
    "images/garden/IMG_0065.jpg": [640, 567],
    "images/garden/IMG_0216.jpg": [555, 640],
    "images/garden/IMG_flower_garden_collection.jpg": [640, 480],
    "images/garden/IMG_flower_coral_vessel.jpg": [555, 640],
    "images/garden/IMG_flower_pod_opening.jpg": [611, 640],
    "images/garden/IMG_flower_brown_bud.jpg": [526, 640],
    "images/garden/IMG_flower_green_star.jpg": [480, 640],
    "images/garden/IMG_flower_pumpkin_orange.jpg": [480, 640],
    "images/garden/IMG_flower_coral_top.jpg": [542, 640],
    "images/garden/IMG_flower_cream_bulb.jpg": [508, 640],
    "images/garden/IMG_flower_beaded_sphere.jpg": [505, 640],
    "images/garden/IMG_flower_cone_tower.jpg": [480, 640],
    "images/home/IMG_framed_ceramic_tiles.jpg": [480, 640],
    "images/home/IMG_tile_mosaic.jpeg": [480, 640],
    "images/garden/IMG_face_masks_tree.jpg": [480, 640],
    "images/garden/IMG_face_masks_tree_2.jpg": [480, 640],
    "images/garden/IMG_face_masks_tree_3.jpg": [352, 640],
    "images/totems/IMG_totem_planter_column.jpg": [480, 640],
    "images/home/IMG_6821.jpeg": [640, 618],
    "images/home/IMG_6817.jpeg": [640, 480],
    "images/home/IMG_0221.jpg": [640, 581],
    "images/totems/IMG_silver_totem_tall.jpg": [231, 640],
    "images/totems/IMG_silver_totem_short.jpg": [498, 640],
    "images/home/IMG_candlestick_pair_speckled.jpg": [427, 640],
    "images/home/IMG_candlesticks_white_pair.jpg": [427, 640],
    "images/totems/IMG_5466.jpg": [390, 640],
    "images/totems/IMG_5467.jpg": [462, 640],
    "images/totems/IMG_ode_to_nala_full.jpg": [480, 640],
    "images/totems/IMG_ode_to_nala_rabbit.jpg": [480, 640],
    "images/totems/IMG_ode_to_nala_house.jpg": [480, 640],
    "images/garden/IMG_dragonfly_succulent_pot.jpg": [480, 640],
    "images/garden/IMG_dragonfly_garden_bed.jpg": [480, 640],
    "images/garden/IMG_wall_pockets_trio.jpg": [640, 480],
    "images/garden/IMG_wall_pockets_tree.jpg": [480, 640],
    "images/garden/IMG_wall_pockets_tree_wide.jpg": [480, 640]
  };

  var CAT_LABELS = { garden: "Garden Pieces", home: "Home Decor", totems: "Totems" };

  var grid = document.getElementById("gallery-grid");
  function catsOf(p) { return [p.cat].concat(p.extraCats || []); }
  // Grid shows a lightweight thumbnail; the lightbox loads the full-res file.
  function thumbOf(src) { return src.replace(/\/([^/]+)$/, "/thumbs/$1"); }
  // A piece's display name: its title if set, otherwise its short caption.
  function titleOf(p) { return p.title || p.caption || ""; }

  PIECES.forEach(function (p, i) {
    var el = document.createElement("figure");
    el.className = "piece " + catsOf(p).map(function (c) { return "cat-" + c; }).join(" ");
    el.setAttribute("data-cat", p.cat);
    el.setAttribute("data-id", p.id);
    var d = DIMS[p.src];
    var dimAttr = d ? ' width="' + d[0] + '" height="' + d[1] + '"' : "";
    // The whole gallery sits below the top photo, so every thumbnail loads
    // lazily (on scroll). That keeps the connection clear for the top photo
    // to load first, instead of competing with it on page load.
    el.innerHTML =
      '<div class="piece-media">' +
        '<img src="' + thumbOf(p.src) + '"' + dimAttr + ' alt="' + (titleOf(p) || (CAT_LABELS[p.cat] + ' ' + p.id)) + '" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\'' + p.src + '\'">' +
        '<figcaption>' +
          '<span class="piece-no">' + String(p.id).padStart(2, "0") + '</span>' +
        '</figcaption>' +
      '</div>' +
      (titleOf(p) ? '<div class="piece-caption">' + titleOf(p) + '</div>' : '');
    el.addEventListener("click", function () { openLightbox(p.id); });
    grid.appendChild(el);
  });

  // Because every cell reserves its space (width/height on each img), Isotope
  // can lay the grid out and reveal it straight away — no waiting for all the
  // thumbnails to download. As lazy thumbnails arrive while scrolling, we
  // re-run the layout to absorb any rounding differences.
  var iso = new Isotope(grid, {
    itemSelector: ".piece",
    layoutMode: "masonry",
    percentPosition: true,
    masonry: {
      columnWidth: ".grid-sizer",
      gutter: ".gutter-sizer"
    },
    transitionDuration: "0.3s"
  });
  grid.classList.add("is-laid-out");
  imagesLoaded(grid).on("progress", function () { iso.layout(); });

  var filterBtns = document.querySelectorAll(".filter");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      var f = btn.getAttribute("data-filter");
      if (iso) iso.arrange({ filter: f === "all" ? "*" : ".cat-" + f });
    });
  });

  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCat = document.getElementById("lb-cat");
  var lbTitle = document.getElementById("lb-title");
  var lbNote = document.getElementById("lb-note");
  var lbNoteField = document.getElementById("lb-note-field");
  var lbSize = document.getElementById("lb-size");
  var lbSizeField = document.getElementById("lb-size-field");
  var lbIdx = document.getElementById("lb-idx");
  var lbTotal = document.getElementById("lb-total");
  var lbInquire = document.getElementById("lb-inquire");
  var current = 0;
  var visible = PIECES.slice();

  function openLightbox(pid) {
    var active = document.querySelector(".filter.is-active").getAttribute("data-filter");
    visible = active === "all" ? PIECES.slice() : PIECES.filter(function (p) { return catsOf(p).indexOf(active) >= 0; });
    current = visible.findIndex(function (p) { return p.id === pid; });
    if (current < 0) current = 0;
    renderLb();
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function step(d) {
    current = (current + d + visible.length) % visible.length;
    renderLb();
  }
  // Show a detail field only when the piece has that information filled in,
  // so the drill-down never shows an empty "Size" or "Artist's Note" label.
  function setField(fieldEl, textEl, value) {
    if (value) { textEl.textContent = value; fieldEl.style.display = ""; }
    else { textEl.textContent = ""; fieldEl.style.display = "none"; }
  }
  function renderLb() {
    var p = visible[current];
    lbImg.src = p.src;
    lbImg.alt = titleOf(p) || (CAT_LABELS[p.cat] + " " + p.id);
    var t = titleOf(p);
    // With a real title, show the category as a small eyebrow above it; without
    // one, use the category as the heading itself and drop the redundant eyebrow.
    lbCat.textContent = CAT_LABELS[p.cat];
    lbCat.style.display = t ? "" : "none";
    lbTitle.textContent = t || CAT_LABELS[p.cat];
    setField(lbNoteField, lbNote, p.note);
    setField(lbSizeField, lbSize, p.size);
    lbIdx.textContent = String(current + 1).padStart(2, "0");
    lbTotal.textContent = String(visible.length).padStart(2, "0");
  }

  document.querySelector(".lb-close").addEventListener("click", closeLightbox);
  document.querySelector(".lb-prev").addEventListener("click", function () { step(-1); });
  document.querySelector(".lb-next").addEventListener("click", function () { step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  lbInquire.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  var nav = document.getElementById("nav");
  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 32); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
})();
