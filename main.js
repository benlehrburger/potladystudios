(function () {
  "use strict";

  var PIECES = [
    { id: 1,  cat: "home",   src: "images/home/IMG_4905.jpg", caption: "coil orchid bowl" },
    { id: 13, cat: "home",   src: "images/home/IMG_6824.jpeg" },
    { id: 15, cat: "home",   src: "images/home/IMG_4873.jpg" },
    { id: 2,  cat: "totems", src: "images/totems/IMG_5466.jpg" },
    { id: 17, cat: "garden", src: "images/garden/IMG_0199.jpg" },
    { id: 3,  cat: "garden", src: "images/garden/IMG_0216.jpg" },
    { id: 4,  cat: "home",   src: "images/home/IMG_0275.jpg" },
    { id: 5,  cat: "garden", src: "images/garden/IMG_5534.jpg" },
    { id: 6,  cat: "totems", src: "images/totems/IMG_5521.jpg" },
    { id: 7,  cat: "home",   src: "images/home/IMG_6821.jpeg" },
    { id: 18, cat: "home",   src: "images/home/IMG_6817.jpeg" },
    { id: 8,  cat: "garden", src: "images/garden/IMG_0202.jpg" },
    { id: 12, cat: "garden", src: "images/garden/IMG_0065.jpg" },
    { id: 9,  cat: "home",   src: "images/home/IMG_0221.jpg" },
    { id: 10, cat: "garden", src: "images/garden/IMG_4944.jpg" },
    { id: 11, cat: "totems", src: "images/totems/IMG_0029.jpg" },
    { id: 14, cat: "garden", src: "images/garden/IMG_0212.jpg" },
    { id: 16, cat: "totems", src: "images/totems/IMG_5467.jpg" },
    { id: 19, cat: "garden", src: "images/garden/IMG_5706.jpg" },
    { id: 20, cat: "garden", src: "images/garden/IMG_0217.jpg" },
    { id: 21, cat: "home",   src: "images/home/IMG_tile_mosaic.jpeg" },
    { id: 22, cat: "home",   src: "images/home/IMG_candleholders_pair_portrait.jpeg" },
    { id: 23, cat: "home",   src: "images/home/IMG_candleholders_pair_wide.jpeg" },
    { id: 24, cat: "home",   src: "images/home/IMG_candleholder_textured.jpeg" },
    { id: 25, cat: "home",   src: "images/home/IMG_candleholder_petals.jpeg" }
  ];

  var CAT_LABELS = { garden: "Garden Pieces", home: "Home Decor", totems: "Totems" };

  var grid = document.getElementById("gallery-grid");
  PIECES.forEach(function (p) {
    var el = document.createElement("figure");
    el.className = "piece";
    el.setAttribute("data-cat", p.cat);
    el.setAttribute("data-id", p.id);
    el.innerHTML =
      '<img src="' + p.src + '" alt="' + (p.caption || (CAT_LABELS[p.cat] + ' ' + p.id)) + '" loading="lazy">' +
      '<figcaption>' +
        '<span class="piece-no">' + String(p.id).padStart(2, "0") + '</span>' +
        (p.caption ? '<span class="piece-caption">' + p.caption + '</span>' : '') +
      '</figcaption>';
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
      if (iso) iso.arrange({ filter: f === "all" ? "*" : '[data-cat="' + f + '"]' });
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
    visible = active === "all" ? PIECES.slice() : PIECES.filter(function (p) { return p.cat === active; });
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
