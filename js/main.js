/* =============================================================================
   Nobe Cosmetics — Interactions
   -----------------------------------------------------------------------------
   Handles: mobile slide-in menu, announcement rotation, search toggle,
   product card rendering (featured + shop grid), category filter + search,
   product detail pages, quick-view modal, testimonials carousel,
   localStorage wishlist, newsletter (client-side), and scroll fade-ins.

   Depends on products.js (SITE, products, waLink, formatPrice…) and runs after
   partials.js has injected the header/footer (listens for "chrome:ready").
============================================================================= */
(function () {
  "use strict";

  var WISHLIST_KEY = "nobe_wishlist";

  /* --------------------------- small utilities ------------------------------ */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ------------------------------ WISHLIST ----------------------------------- */
  function getWishlist() {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveWishlist(list) {
    try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function toggleWishlist(id) {
    var list = getWishlist();
    var i = list.indexOf(id);
    if (i === -1) list.push(id); else list.splice(i, 1);
    saveWishlist(list);
    return list.indexOf(id) !== -1;
  }
  function inWishlist(id) { return getWishlist().indexOf(id) !== -1; }

  /* ------------------------ WISHLIST DRAWER + BADGE -------------------------- */
  function updateWishCount() {
    var badge = document.getElementById("wishCount");
    if (!badge) return;
    var n = getWishlist().length;
    badge.textContent = String(n);
    badge.hidden = n === 0;
  }
  function syncHearts() {
    // Keep on-page product hearts in sync when items are removed from the drawer
    $all("[data-wish]").forEach(function (btn) {
      var active = inWishlist(btn.getAttribute("data-wish"));
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    var main = document.querySelector("[data-product-id]");
    var pd = document.querySelector(".pd-wish");
    if (main && pd) {
      var a = inWishlist(main.getAttribute("data-product-id"));
      pd.classList.toggle("is-active", a);
      pd.setAttribute("aria-pressed", String(a));
    }
  }
  function wishItemHTML(p) {
    var href = "product-" + p.id + ".html";
    var orderMsg = "Hi, I'd like to order " + p.name + ".";
    return (
      '<div class="wish-item">' +
        '<a href="' + href + '"><img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.name) + '" width="58" height="72"></a>' +
        '<div class="wish-item-info">' +
          '<h4><a href="' + href + '">' + esc(p.name) + "</a></h4>" +
          '<span class="price">' + esc(formatPrice(p.price)) + "</span>" +
          '<div class="wish-actions">' +
            '<a class="btn wish-order" href="' + waLink(orderMsg) + '" target="_blank" rel="noopener noreferrer">Order</a>' +
            '<button class="wish-remove" data-wish-remove="' + esc(p.id) + '">Remove</button>' +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }
  function renderWishlist() {
    var body = document.getElementById("wishBody");
    if (!body) return;
    var items = getWishlist().map(getProductById).filter(Boolean);
    if (items.length === 0) {
      body.innerHTML = '<p class="wish-empty">No saved items yet.<br>Tap the ♡ on any product to save it here, or <a href="shop.html">browse the shop</a>.</p>';
      return;
    }
    body.innerHTML = items.map(wishItemHTML).join("");
    $all("[data-wish-remove]", body).forEach(function (btn) {
      btn.addEventListener("click", function () {
        toggleWishlist(btn.getAttribute("data-wish-remove"));
        refreshWishUI();
        syncHearts();
      });
    });
  }
  function refreshWishUI() {
    updateWishCount();
    var drawer = document.getElementById("wishDrawer");
    if (drawer && drawer.classList.contains("is-open")) renderWishlist();
  }

  var HEART =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
    '<path fill="currentColor" d="M12 21s-6.7-4.35-9.33-8.02C.9 10.3 1.36 7.3 3.5 5.9c1.9-1.24 4.3-.7 5.6.9L12 10l2.9-3.2c1.3-1.6 3.7-2.14 5.6-.9 2.14 1.4 2.6 4.4.83 7.08C18.7 16.65 12 21 12 21z"/></svg>';

  /* --------------------------- PRODUCT CARD ---------------------------------- */
  function productCardHTML(p) {
    var href = "product-" + p.id + ".html";
    var orderMsg = "Hi, I'd like to order " + p.name + ".";
    var badge = p.badge ? '<span class="card-badge">' + esc(p.badge) + "</span>" : "";
    var faved = inWishlist(p.id);

    return (
      '<article class="product-card fade-in" data-id="' + esc(p.id) + '" data-category="' + esc(p.category) + '" data-name="' + esc(p.name.toLowerCase()) + '" data-desc="' + esc((p.shortDescription || "").toLowerCase()) + '">' +
        '<div class="card-media">' +
          badge +
          '<button class="wish-btn' + (faved ? " is-active" : "") + '" data-wish="' + esc(p.id) + '" aria-pressed="' + faved + '" aria-label="Save ' + esc(p.name) + ' for later" title="Save for later">' + HEART + "</button>" +
          '<a href="' + href + '" class="card-media-link" aria-label="' + esc(p.name) + ' details">' +
            '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.name) + '" loading="lazy" width="400" height="400">' +
          "</a>" +
          '<button class="btn btn-ghost quick-view-btn" data-quickview="' + esc(p.id) + '">Quick View</button>' +
        "</div>" +
        '<div class="card-body">' +
          '<h3 class="card-title"><a href="' + href + '">' + esc(p.name) + "</a></h3>" +
          '<p class="card-desc">' + esc(p.shortDescription) + "</p>" +
          '<div class="card-foot">' +
            '<span class="price">' + esc(formatPrice(p.price)) + "</span>" +
          "</div>" +
          '<a class="btn btn-block" href="' + waLink(orderMsg) + '" target="_blank" rel="noopener noreferrer">Order on WhatsApp</a>' +
        "</div>" +
      "</article>"
    );
  }

  function renderProducts(container, list) {
    container.innerHTML = list.map(productCardHTML).join("");
    bindCardActions(container);
    observeFadeIns(container);
  }

  function bindCardActions(ctx) {
    $all("[data-wish]", ctx).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var active = toggleWishlist(btn.getAttribute("data-wish"));
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", String(active));
        refreshWishUI();
      });
    });
    $all("[data-quickview]", ctx).forEach(function (btn) {
      btn.addEventListener("click", function () {
        openQuickView(btn.getAttribute("data-quickview"));
      });
    });
  }

  /* --------------------------- QUICK-VIEW MODAL ------------------------------ */
  var modalEl = null;
  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement("div");
    modalEl.className = "modal";
    modalEl.id = "quickViewModal";
    modalEl.setAttribute("hidden", "");
    modalEl.setAttribute("role", "dialog");
    modalEl.setAttribute("aria-modal", "true");
    modalEl.setAttribute("aria-label", "Product quick view");
    modalEl.innerHTML =
      '<div class="modal-backdrop" data-close></div>' +
      '<div class="modal-panel" role="document">' +
        '<button class="icon-btn modal-close" data-close aria-label="Close quick view">' +
          '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></svg>' +
        "</button>" +
        '<div class="modal-content" id="quickViewContent"></div>' +
      "</div>";
    document.body.appendChild(modalEl);
    $all("[data-close]", modalEl).forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modalEl.hasAttribute("hidden")) closeModal();
    });
    return modalEl;
  }
  function openQuickView(id) {
    var p = getProductById(id);
    if (!p) return;
    ensureModal();
    var href = "product-" + p.id + ".html";
    var orderMsg = "Hi, I'd like to order " + p.name + ".";
    $("#quickViewContent").innerHTML =
      '<div class="qv-media"><img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.name) + '" width="480" height="480"></div>' +
      '<div class="qv-body">' +
        (p.badge ? '<span class="card-badge qv-badge">' + esc(p.badge) + "</span>" : "") +
        "<h2>" + esc(p.name) + "</h2>" +
        '<p class="price qv-price">' + esc(formatPrice(p.price)) + "</p>" +
        "<p>" + esc(p.fullDescription) + "</p>" +
        '<div class="qv-actions">' +
          '<a class="btn" href="' + waLink(orderMsg) + '" target="_blank" rel="noopener noreferrer">Order on WhatsApp</a>' +
          '<a class="btn btn-ghost" href="' + href + '">View full details</a>' +
        "</div>" +
      "</div>";
    modalEl.removeAttribute("hidden");
    document.body.classList.add("no-scroll");
    var closeBtn = $(".modal-close", modalEl);
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    if (!modalEl) return;
    modalEl.setAttribute("hidden", "");
    document.body.classList.remove("no-scroll");
  }

  /* ------------------------------ HEADER CHROME ------------------------------ */
  function initChrome() {
    // Current year in footer
    var yr = $("#footerYear");
    if (yr) yr.textContent = String(new Date().getFullYear());

    // Rotating announcement bar
    var announceEl = $("#announceText");
    if (announceEl && SITE.announcements.length > 1) {
      var i = 0;
      setInterval(function () {
        i = (i + 1) % SITE.announcements.length;
        announceEl.style.opacity = "0";
        setTimeout(function () {
          announceEl.textContent = SITE.announcements[i];
          announceEl.style.opacity = "1";
        }, 300);
      }, 4500);
    }

    // Mobile slide-in menu
    var openBtn = $("#menuOpen");
    var closeBtn = $("#menuClose");
    var menu = $("#mobileMenu");
    var overlay = $("#menuOverlay");
    function openMenu() {
      menu.classList.add("is-open");
      overlay.hidden = false;
      requestAnimationFrame(function () { overlay.classList.add("is-visible"); });
      menu.setAttribute("aria-hidden", "false");
      if (openBtn) openBtn.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
    }
    function closeMenu() {
      menu.classList.remove("is-open");
      overlay.classList.remove("is-visible");
      setTimeout(function () { overlay.hidden = true; }, 300);
      menu.setAttribute("aria-hidden", "true");
      if (openBtn) openBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    }
    if (openBtn) openBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);
    $all(".mobile-nav a", menu).forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
    });

    // Sticky header shadow on scroll (once the header has begun to pin)
    var shell = document.getElementById("site-header");
    if (shell) {
      var onScroll = function () { shell.classList.toggle("is-scrolled", window.scrollY > 8); };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    // Expandable search bar
    var searchToggle = $("#searchToggle");
    var searchBar = $("#searchBar");
    if (searchToggle && searchBar) {
      searchToggle.addEventListener("click", function () {
        var willShow = searchBar.hasAttribute("hidden");
        if (willShow) {
          searchBar.removeAttribute("hidden");
          searchToggle.setAttribute("aria-expanded", "true");
          var inp = $("#siteSearch"); if (inp) inp.focus();
        } else {
          searchBar.setAttribute("hidden", "");
          searchToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    // Saved-items (wishlist) drawer — opened by the heart icon
    var wishToggle = $("#wishToggle");
    var wishDrawer = $("#wishDrawer");
    var wishOverlay = $("#wishOverlay");
    var wishClose = $("#wishClose");
    function openWish() {
      renderWishlist();
      wishDrawer.classList.add("is-open");
      wishOverlay.hidden = false;
      requestAnimationFrame(function () { wishOverlay.classList.add("is-visible"); });
      wishDrawer.setAttribute("aria-hidden", "false");
      if (wishToggle) wishToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
    }
    function closeWish() {
      wishDrawer.classList.remove("is-open");
      wishOverlay.classList.remove("is-visible");
      setTimeout(function () { wishOverlay.hidden = true; }, 300);
      wishDrawer.setAttribute("aria-hidden", "true");
      if (wishToggle) wishToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    }
    if (wishToggle && wishDrawer) wishToggle.addEventListener("click", openWish);
    if (wishClose) wishClose.addEventListener("click", closeWish);
    if (wishOverlay) wishOverlay.addEventListener("click", closeWish);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && wishDrawer && wishDrawer.classList.contains("is-open")) closeWish();
    });
    updateWishCount();

    // Newsletter (client-side only — see README TODO to wire to Formspree/Mailchimp)
    var nlForm = $("#newsletterForm");
    if (nlForm) {
      nlForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = $("#newsletterEmail");
        var msg = $("#newsletterMsg");
        if (input && input.checkValidity()) {
          if (msg) msg.textContent = "Thanks! We'll be in touch. ✨";
          input.value = "";
          // TODO: POST this email to a real service (Formspree / Mailchimp).
        } else if (msg) {
          msg.textContent = "Please enter a valid email address.";
        }
      });
    }
  }

  /* ------------------------------ CAROUSEL ----------------------------------- */
  function initCarousels() {
    $all(".carousel").forEach(function (root) {
      var track = $(".carousel-track", root);
      var slides = $all(".carousel-slide", track);
      if (slides.length === 0) return;
      var dotsWrap = $(".carousel-dots", root);
      var index = 0, timer = null;
      var autoplay = root.getAttribute("data-autoplay") !== "false";

      if (dotsWrap) {
        dotsWrap.innerHTML = slides.map(function (_, i) {
          return '<button class="carousel-dot" aria-label="Go to slide ' + (i + 1) + '"></button>';
        }).join("");
      }
      var dots = dotsWrap ? $all(".carousel-dot", dotsWrap) : [];

      function go(n) {
        index = (n + slides.length) % slides.length;
        track.style.transform = "translateX(-" + index * 100 + "%)";
        dots.forEach(function (d, i) { d.classList.toggle("is-active", i === index); });
      }
      dots.forEach(function (d, i) { d.addEventListener("click", function () { go(i); restart(); }); });

      function start() {
        if (!autoplay || slides.length < 2) return;
        timer = setInterval(function () { go(index + 1); }, 5000);
      }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      function restart() { stop(); start(); }

      // Touch swipe (mobile)
      var startX = 0, dx = 0, dragging = false;
      track.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; dragging = true; stop(); }, { passive: true });
      track.addEventListener("touchmove", function (e) { if (dragging) dx = e.touches[0].clientX - startX; }, { passive: true });
      track.addEventListener("touchend", function () {
        if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
        dx = 0; dragging = false; start();
      });

      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", start);

      go(0); start();
    });
  }

  /* ---------------------------- SCROLL FADE-INS ------------------------------ */
  function observeFadeIns(ctx) {
    var els = $all(".fade-in:not(.is-visible)", ctx || document);
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------ PAGE LOGIC --------------------------------- */
  // Homepage featured grid
  function initFeatured() {
    var grid = $("#featuredGrid");
    if (grid) renderProducts(grid, products);
  }

  // Shop page: render grid + category filters + search query
  function initShop() {
    var grid = $("#shopGrid");
    if (!grid) return;

    // Build filter buttons from CATEGORIES (scales automatically)
    var filterWrap = $("#shopFilters");
    if (filterWrap) {
      var btns = ['<button class="filter-btn is-active" data-filter="all">All</button>'];
      CATEGORIES.forEach(function (c) {
        btns.push('<button class="filter-btn" data-filter="' + esc(c.id) + '">' + esc(c.label) + "</button>");
      });
      filterWrap.innerHTML = btns.join("");
    }

    renderProducts(grid, products);

    var params = new URLSearchParams(window.location.search);
    var q = (params.get("q") || "").trim().toLowerCase();
    var activeFilter = "all";

    var searchInput = $("#shopSearch");
    if (searchInput && q) searchInput.value = q;

    function apply() {
      var query = (searchInput ? searchInput.value : q).trim().toLowerCase();
      var visible = 0;
      $all(".product-card", grid).forEach(function (card) {
        var matchCat = activeFilter === "all" || card.getAttribute("data-category") === activeFilter;
        var matchText = !query ||
          card.getAttribute("data-name").indexOf(query) !== -1 ||
          card.getAttribute("data-desc").indexOf(query) !== -1;
        var show = matchCat && matchText;
        card.style.display = show ? "" : "none";
        if (show) visible++;
      });
      var empty = $("#shopEmpty");
      if (empty) empty.hidden = visible !== 0;
    }

    if (filterWrap) {
      $all(".filter-btn", filterWrap).forEach(function (btn) {
        btn.addEventListener("click", function () {
          $all(".filter-btn", filterWrap).forEach(function (b) { b.classList.remove("is-active"); });
          btn.classList.add("is-active");
          activeFilter = btn.getAttribute("data-filter");
          apply();
        });
      });
    }
    if (searchInput) searchInput.addEventListener("input", apply);

    apply();
  }

  // Product detail page: reads <main data-product-id="...">
  function initProductDetail() {
    var main = $("[data-product-id]");
    if (!main) return;
    var p = getProductById(main.getAttribute("data-product-id"));
    if (!p) return;
    var orderMsg = "Hi, I'd like to order " + p.name + ".";

    function set(sel, val) { var el = $(sel, main); if (el) el.textContent = val; }
    set(".pd-name", p.name);
    set(".pd-price", formatPrice(p.price));
    set(".pd-desc", p.fullDescription);
    set(".pd-ingredients", p.ingredients);
    set(".pd-howto", p.howToUse);
    if (p.badge) { var b = $(".pd-badge", main); if (b) b.textContent = p.badge; }
    else { var b2 = $(".pd-badge", main); if (b2) b2.hidden = true; }

    var img = $(".pd-image", main);
    if (img) { img.src = p.image; img.alt = p.imageAlt || p.name; }

    var order = $(".pd-order", main);
    if (order) order.href = waLink(orderMsg);

    // Breadcrumb + document title
    var crumb = $(".pd-crumb-name", main);
    if (crumb) crumb.textContent = p.name;
    document.title = p.name + " — " + SITE.brandName;

    // Wishlist toggle on detail page
    var wish = $(".pd-wish", main);
    if (wish) {
      var faved = inWishlist(p.id);
      wish.classList.toggle("is-active", faved);
      wish.setAttribute("aria-pressed", String(faved));
      wish.addEventListener("click", function () {
        var active = toggleWishlist(p.id);
        wish.classList.toggle("is-active", active);
        wish.setAttribute("aria-pressed", String(active));
        refreshWishUI();
      });
    }
  }

  /* ------------------------------ CONTACT FORM ------------------------------- */
  function initContactForm() {
    var form = $("#contactForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      // If no Formspree endpoint set yet, fall back to mailto so nothing is lost.
      var action = form.getAttribute("action") || "";
      if (action.indexOf("formspree.io") === -1) {
        e.preventDefault();
        var name = encodeURIComponent(($("#cfName") || {}).value || "");
        var email = encodeURIComponent(($("#cfEmail") || {}).value || "");
        var message = encodeURIComponent(($("#cfMessage") || {}).value || "");
        var body = "Name: " + name + "%0D%0AEmail: " + email + "%0D%0A%0D%0A" + message;
        var note = $("#contactNote");
        if (note) note.textContent = "Opening your email app… If nothing happens, email us directly.";
        window.location.href = "mailto:" + SITE.email + "?subject=" +
          encodeURIComponent("Website enquiry from " + decodeURIComponent(name)) + "&body=" + body;
      }
      // else: let the browser POST to Formspree normally.
    });
  }

  /* -------------------------------- BOOTSTRAP -------------------------------- */
  document.addEventListener("chrome:ready", initChrome);

  function initPage() {
    initFeatured();
    initShop();
    initProductDetail();
    initContactForm();
    initCarousels();
    observeFadeIns(document);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    initPage();
  }
})();
