(function () {
  "use strict";

  var PIECES = [
    { id: 1,  cat: "home",   src: "images/home/IMG_4905.jpg", caption: "Coil built orchid bowl planter" },
    { id: 2,  cat: "home",   src: "images/home/IMG_braided_bowl.jpg" },
    { id: 3,  cat: "home",   src: "images/home/IMG_4873.jpg" },
    { id: 4,  cat: "garden", src: "images/garden/IMG_flower_garden_collection.jpg" },
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
    { id: 18, cat: "home",   src: "images/home/IMG_framed_ceramic_tiles.jpg", caption: "Ceramic Tile Wall Art" },
    { id: 19, cat: "home",   src: "images/home/IMG_tile_mosaic.jpeg" },
    { id: 20, cat: "garden", extraCats: ["home"], src: "images/garden/IMG_face_masks_tree.jpg", caption: "Ceramic face masks on a tree" },
    { id: 21, cat: "garden", extraCats: ["home"], src: "images/garden/IMG_face_masks_tree_2.jpg" },
    { id: 22, cat: "garden", extraCats: ["home"], src: "images/garden/IMG_face_masks_tree_3.jpg" },
    { id: 23, cat: "garden", extraCats: ["totems"], src: "images/totems/IMG_totem_planter_column.jpg", caption: "Red Clay Planter Totem" },
    { id: 24, cat: "home",   src: "images/home/IMG_6821.jpeg", caption: "Colorful Hug Mugs" },
    { id: 25, cat: "home",   src: "images/home/IMG_6817.jpeg" },
    { id: 26, cat: "home",   src: "images/home/IMG_0221.jpg", caption: "Ceramic and Driftwood Bird" },
    { id: 27, cat: "totems", src: "images/totems/IMG_silver_totem_tall.jpg" },
    { id: 28, cat: "totems", src: "images/totems/IMG_silver_totem_short.jpg", caption: "MCM Tall Sculpture on Acrylic Base" },
    { id: 29, cat: "home",   src: "images/home/IMG_candlestick_pair_speckled.jpg", caption: "Pair of sculpted candlesticks" },
    { id: 30, cat: "totems", src: "images/totems/IMG_5466.jpg", caption: "Intricate Coil Built Totem Planter" },
    { id: 31, cat: "totems", src: "images/totems/IMG_5467.jpg" },
    { id: 32, cat: "garden", src: "images/garden/IMG_ode_to_nala.jpg", caption: "Ode To Nala" },
    { id: 33, cat: "garden", src: "images/garden/IMG_nala_rabbit_closeup.jpg" }
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
    "images/totems/IMG_5466.jpg": [390, 640],
    "images/totems/IMG_5467.jpg": [462, 640],
    "images/garden/IMG_ode_to_nala.jpg": [480, 640],
    "images/garden/IMG_nala_rabbit_closeup.jpg": [560, 640]
  };

  var CAT_LABELS = { garden: "Garden Pieces", home: "Home Decor", totems: "Totems" };

  var grid = document.getElementById("gallery-grid");
  function catsOf(p) { return [p.cat].concat(p.extraCats || []); }
  // Grid shows a lightweight thumbnail; the lightbox loads the full-res file.
  function thumbOf(src) { return src.replace(/\/([^/]+)$/, "/thumbs/$1"); }

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
        '<img src="' + thumbOf(p.src) + '"' + dimAttr + ' alt="' + (p.caption || (CAT_LABELS[p.cat] + ' ' + p.id)) + '" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\'' + p.src + '\'">' +
        '<figcaption>' +
          '<span class="piece-no">' + String(p.id).padStart(2, "0") + '</span>' +
        '</figcaption>' +
      '</div>' +
      (p.caption ? '<div class="piece-caption">' + p.caption + '</div>' : '');
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
  var lbTitle = document.getElementById("lb-title");
  var lbCaption = document.getElementById("lb-caption");
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
  function renderLb() {
    var p = visible[current];
    lbImg.src = p.src;
    lbImg.alt = CAT_LABELS[p.cat] + " " + p.id;
    lbTitle.textContent = CAT_LABELS[p.cat];
    lbCaption.textContent = p.caption || "";
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
