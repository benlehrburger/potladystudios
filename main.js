(function () {
  "use strict";

  var PIECES = [
    { id: 1,  cat: "home",   src: "images/home/IMG_4905.jpg", caption: "Coil built orchid bowl planter" },
    { id: 2,  cat: "home",   src: "images/home/IMG_braided_bowl.jpg" },
    { id: 3,  cat: "home",   src: "images/home/IMG_4873.jpg" },
    { id: 4,  cat: "garden", src: "images/garden/IMG_0199.jpg" },
    { id: 5,  cat: "garden", src: "images/garden/IMG_0212.jpg" },
    { id: 6,  cat: "garden", src: "images/garden/IMG_0065.jpg" },
    { id: 7,  cat: "garden", src: "images/garden/IMG_0216.jpg" },
    { id: 8,  cat: "garden", src: "images/garden/IMG_5706.jpg" },
    { id: 9,  cat: "garden", src: "images/garden/IMG_flower_coral_vessel.jpg" },
    { id: 10, cat: "garden", src: "images/garden/IMG_flower_pod_opening.jpg" },
    { id: 11, cat: "garden", src: "images/garden/IMG_flower_brown_bud.jpg" },
    { id: 12, cat: "garden", src: "images/garden/IMG_flower_green_star.jpg" },
    { id: 13, cat: "garden", src: "images/garden/IMG_flower_pumpkin_orange.jpg" },
    { id: 14, cat: "garden", src: "images/garden/IMG_flower_coral_top.jpg" },
    { id: 15, cat: "garden", src: "images/garden/IMG_flower_cream_bulb.jpg" },
    { id: 16, cat: "garden", src: "images/garden/IMG_flower_beaded_sphere.jpg" },
    { id: 17, cat: "garden", src: "images/garden/IMG_flower_cone_tower.jpg" },
    { id: 18, cat: "garden", src: "images/garden/IMG_flower_garden_collection.jpg" },
    { id: 19, cat: "home",   src: "images/home/IMG_0275.jpg" },
    { id: 20, cat: "home",   src: "images/home/IMG_tile_mosaic.jpeg" },
    { id: 21, cat: "garden", extraCats: ["home"], src: "images/garden/IMG_face_masks_tree.jpg", caption: "Ceramic face masks on a tree" },
    { id: 22, cat: "garden", src: "images/garden/IMG_4944.jpg" },
    { id: 23, cat: "garden", extraCats: ["totems"], src: "images/totems/IMG_5521.jpg" },
    { id: 24, cat: "home",   src: "images/home/IMG_6821.jpeg" },
    { id: 25, cat: "home",   src: "images/home/IMG_6817.jpeg" },
    { id: 26, cat: "home",   src: "images/home/IMG_0221.jpg" },
    { id: 27, cat: "totems", src: "images/totems/IMG_silver_totem_tall.jpg" },
    { id: 28, cat: "totems", src: "images/totems/IMG_silver_totem_short.jpg" },
    { id: 29, cat: "home",   src: "images/home/IMG_candlestick_pair_speckled.jpg", caption: "Pair of sculpted candlesticks" },
    { id: 30, cat: "totems", src: "images/totems/IMG_5466.jpg" },
    { id: 31, cat: "totems", src: "images/totems/IMG_5467.jpg" },
    { id: 32, cat: "garden", src: "images/garden/IMG_0217.jpg" },
    { id: 33, cat: "home",   src: "images/home/IMG_candleholders_pair_portrait.jpeg" }
  ];

  var CAT_LABELS = { garden: "Garden Pieces", home: "Home Decor", totems: "Totems" };

  var grid = document.getElementById("gallery-grid");
  function catsOf(p) { return [p.cat].concat(p.extraCats || []); }

  PIECES.forEach(function (p) {
    var el = document.createElement("figure");
    el.className = "piece " + catsOf(p).map(function (c) { return "cat-" + c; }).join(" ");
    el.setAttribute("data-cat", p.cat);
    el.setAttribute("data-id", p.id);
    el.innerHTML =
      '<div class="piece-media">' +
        '<img src="' + p.src + '" alt="' + (p.caption || (CAT_LABELS[p.cat] + ' ' + p.id)) + '" loading="lazy">' +
        '<figcaption>' +
          '<span class="piece-no">' + String(p.id).padStart(2, "0") + '</span>' +
        '</figcaption>' +
      '</div>' +
      (p.caption ? '<div class="piece-caption">' + p.caption + '</div>' : '');
    el.addEventListener("click", function () { openLightbox(p.id); });
    grid.appendChild(el);
  });

  var iso;
  imagesLoaded(grid, function () {
    iso = new Isotope(grid, {
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
  });

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
