/* =============================================================================
   Nobe Cosmetics — Site data & configuration
   -----------------------------------------------------------------------------
   This file holds ALL the content a non-technical editor needs to change:
     1. SITE   — global brand info (WhatsApp number, email, address, promo bar…)
     2. products — the product catalogue (add a 3rd product by copy-pasting)

   Everything marked  // TODO: replace  is placeholder content that MUST be
   swapped for real values before the site goes live. See README.md for the
   full launch checklist.
============================================================================= */

/* -----------------------------------------------------------------------------
   1. GLOBAL SITE CONFIG
   Edit these once — they feed the header, footer, contact page and every
   "Order on WhatsApp" button across the whole site.
----------------------------------------------------------------------------- */
const SITE = {
  brandName: "Nobe Cosmetics",

  // Thin promo bar shown above the navbar. Add more strings to rotate them.
  announcements: [
    "🌿 Handcrafted Skincare, Made Fresh in Lahore",
    "✨ Free delivery on orders over PKR 3,000",       // TODO: replace / remove
    "💬 Questions? Message us on WhatsApp anytime"
  ],

  // WhatsApp click-to-chat number in INTERNATIONAL format, digits only.
  // Format: country code + number, no "+", no spaces, no leading zero.
  // Example for a Pakistani number 0300 1234567 -> "923001234567".
  whatsappNumber: "923001234567",                      // TODO: replace with real number

  email: "hello@nobecosmetics.com",                    // TODO: replace with real email
  phoneDisplay: "+92 300 1234567",                     // TODO: replace with real number

  address: {
    line1: "Nobe Cosmetics",
    line2: "Lahore, Pakistan"                          // TODO: replace with full address
  },

  social: {
    instagram: "https://instagram.com/",               // TODO: replace with real profile
    facebook: "https://facebook.com/"                  // TODO: replace with real profile
  },

  // Google Maps embed "src" URL for the Contact page (optional).
  // Leave as "" to hide the map, or paste an embed URL from Google Maps.
  mapEmbedSrc: "",                                     // TODO: optional — paste Google Maps embed URL

  currency: "PKR"
};

/* Build a ready-to-use wa.me link with an optional pre-filled message. */
function waLink(message) {
  const base = "https://wa.me/" + SITE.whatsappNumber;
  return message ? base + "?text=" + encodeURIComponent(message) : base;
}

/* -----------------------------------------------------------------------------
   2. PRODUCT CATALOGUE
   To add a product later: copy one { ... } block, paste it, and edit the
   fields. `id` must be unique and match the product-<id>.html filename.
   `category` must match one of the CATEGORIES ids below.
----------------------------------------------------------------------------- */
const CATEGORIES = [
  { id: "soaps",      label: "Soaps" },
  { id: "face-masks", label: "Face Masks" }
  // { id: "serums", label: "Serums" },   // <- example: add a category here later
];

const products = [
  {
    id: "obtan-soap",
    name: "Obtan Soap",
    price: 0,                                           // TODO: set real price in PKR
    category: "soaps",
    badge: "Bestseller",                               // TODO: optional label, or "" to hide
    shortDescription:
      "PLACEHOLDER — a gentle brightening cleansing bar. Add a one-line hook here.", // TODO: replace
    fullDescription:
      "PLACEHOLDER — write the full product story here. Describe what Obtan Soap " +
      "does, who it's for, the skin concerns it targets, and how it feels to use. " +
      "Keep the tone warm and natural.",              // TODO: replace
    ingredients:
      "PLACEHOLDER — list key ingredients, e.g. natural oils, turmeric, glycerin…", // TODO: replace
    howToUse:
      "PLACEHOLDER — e.g. Lather onto damp skin, massage gently, rinse with warm " +
      "water. Use morning and evening.",              // TODO: replace
    image: "assets/images/obtan-soap.svg",             // TODO: replace with real photo (jpg/png/webp)
    imageAlt: "Obtan Soap bar by Nobe Cosmetics"       // TODO: replace with descriptive alt text
  },
  {
    id: "face-mask",
    name: "Face Mask",
    price: 0,                                           // TODO: set real price in PKR
    category: "face-masks",
    badge: "",                                         // TODO: optional label, or "" to hide
    shortDescription:
      "PLACEHOLDER — a nourishing weekly treatment mask. Add a one-line hook here.", // TODO: replace
    fullDescription:
      "PLACEHOLDER — write the full product story here. Describe what the Face Mask " +
      "does, the glow it gives, the natural ingredients, and how often to use it.",  // TODO: replace
    ingredients:
      "PLACEHOLDER — list key ingredients, e.g. clay, rose, honey, botanical extracts…", // TODO: replace
    howToUse:
      "PLACEHOLDER — e.g. Apply an even layer to clean skin, leave for 10–15 minutes, " +
      "rinse off. Use 1–2 times a week.",             // TODO: replace
    image: "assets/images/face-mask.svg",              // TODO: replace with real photo (jpg/png/webp)
    imageAlt: "Face Mask by Nobe Cosmetics"            // TODO: replace with descriptive alt text
  }
  // ---------------------------------------------------------------------------
  // ,{
  //   id: "new-product",
  //   name: "New Product",
  //   price: 0,
  //   category: "soaps",
  //   badge: "",
  //   shortDescription: "…",
  //   fullDescription: "…",
  //   ingredients: "…",
  //   howToUse: "…",
  //   image: "assets/images/new-product.svg",
  //   imageAlt: "…"
  // }
  // ---------------------------------------------------------------------------
];

/* Helpers used by the pages. */
function getProductById(id) {
  return products.find(function (p) { return p.id === id; });
}

function formatPrice(price) {
  if (!price || price <= 0) return "Price on request"; // shows nicely while price is 0 (placeholder)
  return SITE.currency + " " + Number(price).toLocaleString("en-PK");
}
