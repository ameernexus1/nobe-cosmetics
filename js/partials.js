/* =============================================================================
   Nobe Cosmetics — Shared header & footer
   -----------------------------------------------------------------------------
   Why JS injection instead of fetch()?
   The site must run by simply DOUBLE-CLICKING the .html files (file:// protocol)
   as well as on GitHub Pages. Browsers block fetch() of local partials under
   file:// (CORS), which would leave pages with no header/footer when opened
   directly. Rendering the markup from template strings here works in BOTH
   environments and still keeps the navbar/footer in ONE place to edit.

   Each page just needs two placeholders:
       <div id="site-header"></div>
       <div id="site-footer"></div>
   …and to load  products.js  then  partials.js  then  main.js.
============================================================================= */
(function () {
  "use strict";

  // Which nav item should be highlighted? Derived from the current filename.
  var path = window.location.pathname.split("/").pop() || "index.html";

  var NAV_LINKS = [
    { href: "index.html",   label: "Home",    match: ["index.html", ""] },
    { href: "about.html",   label: "About",   match: ["about.html"] },
    { href: "shop.html",    label: "Shop",    match: ["shop.html", "product-obtan-soap.html", "product-face-mask.html"], chevron: true },
    { href: "contact.html", label: "Contact", match: ["contact.html"] }
  ];

  function isActive(link) {
    return link.match.indexOf(path) !== -1;
  }

  /* Inline SVG icons (no icon font / no external requests). */
  var ICON = {
    whatsapp:
      '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 2h-.01C6.5 2 2.02 6.48 2.02 12c0 1.95.57 3.76 1.54 5.29L2 22l4.83-1.53A9.93 9.93 0 0 0 12.04 22C17.57 22 22 17.52 22 12S17.57 2 12.04 2zm5.83 15.83A8.19 8.19 0 0 1 12.04 20a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-2.87.91.94-2.79-.2-.3A8.16 8.16 0 0 1 3.82 12c0-4.53 3.69-8.21 8.22-8.21 2.2 0 4.26.86 5.81 2.41a8.16 8.16 0 0 1 2.41 5.8c0 4.53-3.69 8.03-8.39 8.03z"/>' +
      "</svg>",
    search:
      '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">' +
      '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm5 12 5 5"/></svg>',
    menu:
      '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">' +
      '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close:
      '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">' +
      '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></svg>',
    instagram:
      '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.5.01-4.74.07-.9.04-1.38.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.33-.28.81-.32 1.71C3.21 8.5 3.2 8.86 3.2 12s.01 3.5.07 4.74c.04.9.19 1.38.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.33.13.81.28 1.71.32 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.38-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.33.28-.81.32-1.71.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74c-.04-.9-.19-1.38-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.33-.13-.81-.28-1.71-.32C15.5 4.01 15.14 4 12 4zm0 3.06A4.94 4.94 0 1 0 12 17a4.94 4.94 0 0 0 0-9.94zm0 8.14A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4zm6.29-8.34a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z"/></svg>',
    facebook:
      '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>'
  };

  /* ---------------------------------- HEADER --------------------------------- */
  function headerHTML() {
    var navDesktop = NAV_LINKS.map(function (l) {
      return '<a href="' + l.href + '"' + (isActive(l) ? ' class="is-active" aria-current="page"' : "") + ">" + l.label + "</a>";
    }).join("");

    var navMobile = NAV_LINKS.map(function (l) {
      return '<a href="' + l.href + '"' + (isActive(l) ? ' class="is-active" aria-current="page"' : "") + ">" + l.label + "</a>";
    }).join("");

    return (
      // Announcement bar (text rotates via main.js)
      '<div class="announce-bar" role="status" aria-live="polite">' +
        '<span class="announce-text" id="announceText">' + SITE.announcements[0] + "</span>" +
      "</div>" +

      '<div class="nav-shell">' +
        '<div class="container nav-inner">' +
          // Left: hamburger (mobile) + logo
          '<button class="nav-hamburger" id="menuOpen" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">' + ICON.menu + "</button>" +
          '<a class="logo" href="index.html" aria-label="' + SITE.brandName + ' home">' +
            // Placeholder logo: swap assets/logo.svg for the real logo, or replace this
            // <img> with a text wordmark. It falls back to text if the file is missing.
            '<img src="assets/logo.svg" alt="' + SITE.brandName + ' logo" width="132" height="40" ' +
              "onerror=\"this.style.display='none';this.nextElementSibling.style.display='inline';\">" +
            '<span class="logo-fallback" style="display:none">Nobe<em>Cosmetics</em></span>' +
          "</a>" +

          // Center/left desktop nav
          '<nav class="nav-links" aria-label="Primary">' + navDesktop + "</nav>" +

          // Right: search + whatsapp
          '<div class="nav-actions">' +
            '<button class="icon-btn" id="searchToggle" aria-label="Search products" aria-expanded="false" aria-controls="searchBar">' + ICON.search + "</button>" +
            '<a class="icon-btn whatsapp" href="' + waLink("Hi Nobe Cosmetics! I have a question.") + '" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">' + ICON.whatsapp + "</a>" +
          "</div>" +
        "</div>" +

        // Expandable search bar -> redirects to shop.html?q=
        '<div class="search-bar" id="searchBar" hidden>' +
          '<form class="container search-form" role="search" action="shop.html" method="get">' +
            '<label class="visually-hidden" for="siteSearch">Search products</label>' +
            ICON.search +
            '<input type="search" id="siteSearch" name="q" placeholder="Search products…" autocomplete="off">' +
            '<button type="submit" class="btn btn-sm">Search</button>' +
          "</form>" +
        "</div>" +
      "</div>" +

      // Mobile slide-in menu + overlay
      '<div class="menu-overlay" id="menuOverlay" hidden></div>' +
      '<aside class="mobile-menu" id="mobileMenu" aria-hidden="true" aria-label="Mobile menu">' +
        '<div class="mobile-menu-head">' +
          '<span class="logo-fallback">Nobe<em>Cosmetics</em></span>' +
          '<button class="icon-btn" id="menuClose" aria-label="Close menu">' + ICON.close + "</button>" +
        "</div>" +
        '<nav class="mobile-nav" aria-label="Mobile primary">' + navMobile + "</nav>" +
        '<a class="btn btn-block whatsapp-btn" href="' + waLink("Hi Nobe Cosmetics! I'd like to place an order.") + '" target="_blank" rel="noopener noreferrer">' + ICON.whatsapp + " Order on WhatsApp</a>" +
      "</aside>"
    );
  }

  /* ---------------------------------- FOOTER ---------------------------------
     Slim footer: brand + tagline, one compact contact block, a single link row,
     and small social icons. (Shop column removed — it duplicates the nav — and
     the newsletter removed for now; both are easy one-line adds later.) */
  function footerHTML() {
    return (
      '<div class="container footer-slim">' +
        '<div class="footer-brand">' +
          '<span class="logo-fallback footer-logo">Nobe<em>Cosmetics</em></span>' +
          '<p class="footer-tag">Handcrafted, natural skincare — made fresh in Lahore.</p>' +
        "</div>" +

        '<div class="footer-contact">' +
          '<a class="whatsapp-link" href="' + waLink("Hi Nobe Cosmetics!") + '" target="_blank" rel="noopener noreferrer">' + ICON.whatsapp + " WhatsApp</a>" +
          '<a href="mailto:' + SITE.email + '">' + SITE.email + "</a>" +
          '<span class="footer-addr">' + SITE.address.line1 + ", " + SITE.address.line2 + "</span>" +
        "</div>" +

        '<nav class="footer-links" aria-label="Footer">' +
          '<a href="about.html">About</a><span class="dot" aria-hidden="true">·</span>' +
          '<a href="contact.html">Contact</a><span class="dot" aria-hidden="true">·</span>' +
          '<a href="privacy.html">Privacy</a><span class="dot" aria-hidden="true">·</span>' +
          '<a href="terms.html">Terms</a>' +
        "</nav>" +

        '<div class="social-row">' +
          '<a href="' + SITE.social.instagram + '" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="icon-btn">' + ICON.instagram + "</a>" +
          '<a href="' + SITE.social.facebook + '" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="icon-btn">' + ICON.facebook + "</a>" +
        "</div>" +
      "</div>" +

      '<div class="footer-bottom container">' +
        '<p>&copy; <span id="footerYear">2026</span> ' + SITE.brandName + ". All rights reserved.</p>" +
      "</div>"
    );
  }

  /* ------------------------- FLOATING WHATSAPP BUTTON ------------------------
     Persistent, fixed bottom-left on every page. Opens WhatsApp in a NEW tab and
     never navigates/reloads the Nobe site itself. */
  function floatingWaHTML() {
    return (
      '<a class="wa-float" href="' + waLink("Hi Nobe Cosmetics! I'd like to place an order.") + '" ' +
        'target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">' +
        ICON.whatsapp +
      "</a>"
    );
  }

  /* ------------------------------- INJECT ------------------------------------ */
  function inject() {
    var header = document.getElementById("site-header");
    var footer = document.getElementById("site-footer");
    if (header) header.innerHTML = headerHTML();
    if (footer) footer.innerHTML = footerHTML();

    // Persistent floating WhatsApp button (added once per page).
    if (!document.querySelector(".wa-float")) {
      document.body.insertAdjacentHTML("beforeend", floatingWaHTML());
    }

    // Signal to main.js that chrome is in the DOM and ready to wire up.
    document.dispatchEvent(new CustomEvent("chrome:ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
