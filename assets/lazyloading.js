// lazy-load.js
(function () {
  "use strict";

  /* -------------------------
     CONFIG
  ------------------------- */
  const IO_OPTIONS = {
    rootMargin: "200px 0px", // preload 200px before entering viewport
    threshold: 0.01,
  };

  // CSS selectors for items to handle
  const SELECTORS = {
    img: "img.lazy-image", // images to lazy-load
    bg: ".lazy-bg", // elements with data-bg for backgrounds
  };

  // Assets to lazy-inject on first user interaction (example: Swiper)
  const SCRIPT_URLS = [
    "/cdn/shop/t/13/assets/swiper-bundle.min.js?v=153095317606561337801763567068",
  ];
  const STYLE_URLS = [
    "/cdn/shop/t/13/assets/swiper-bundle.min.css?v=178409850749087333521763567068",
  ];

  /* -------------------------
     STATE
  ------------------------- */
  let observer = null;
  let assetsLoaded = false;
  let ioSupported = "IntersectionObserver" in window;

  /* -------------------------
     UTILS
  ------------------------- */
  const safeForEach = (list, fn) =>
    Array.prototype.forEach.call(list || [], fn);

  const injectScripts = (urls = []) => {
    urls.filter(Boolean).forEach((url) => {
      const s = document.createElement("script");
      s.src = url;
      s.defer = true;
      s.crossOrigin = ""; // keep empty if you don't want CORS set
      document.head.appendChild(s);
    });
  };

  const injectStyles = (urls = []) => {
    urls.filter(Boolean).forEach((url) => {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = url;
      document.head.appendChild(l);
    });
  };

  const loadAssets = () => {
    if (assetsLoaded) return;
    assetsLoaded = true;
    injectStyles(STYLE_URLS);
    injectScripts(SCRIPT_URLS);
    // emit a small event so other scripts can react
    document.dispatchEvent(new CustomEvent("lazy:assets:loaded"));
    // cleanup event listeners (added below)
    removeInteractionListeners();
  };

  const interactionEvents = [
    "click",
    "scroll",
    "touchstart",
    "mousemove",
    "keydown",
    "wheel",
  ];
  const addInteractionListeners = () => {
    interactionEvents.forEach((e) =>
      window.addEventListener(e, onFirstInteraction, {
        passive: true,
        once: true,
      })
    );
    // fallback to idle
    if ("requestIdleCallback" in window) {
      requestIdleCallback(loadAssets, { timeout: 3000 });
    } else {
      // absolute fallback: load after 5s
      setTimeout(loadAssets, 5000);
    }
  };
  const removeInteractionListeners = () => {
    interactionEvents.forEach((e) =>
      window.removeEventListener(e, onFirstInteraction)
    );
  };

  function onFirstInteraction() {
    loadAssets();
  }

  /* -------------------------
     CORE: image/background handling
  ------------------------- */

  // Convert immediate src/srcset to data- attributes to prevent browser from loading them
  function prepareImageForLazy(img) {
    // skip if already prepared
    if (img.dataset._lazyPrepared) return;
    // avoid preparing images that are intentionally eager or already lazy-managed
    // e.g., if developer already set data-src — skip
    if (!img.dataset.src && img.src) {
      img.dataset.src = img.src;
      img.removeAttribute("src");
    }
    if (!img.dataset.srcset && img.srcset) {
      img.dataset.srcset = img.srcset;
      img.removeAttribute("srcset");
    }
    // mark prepared
    img.dataset._lazyPrepared = "1";
  }

  function loadImage(el) {
    if (!el) return;
    const img = el.tagName === "IMG" ? el : el.querySelector("img");
    if (img) {
      const src = img.dataset.src;
      const srcset = img.dataset.srcset;
      if (src) {
        img.src = src;
        delete img.dataset.src;
      }
      if (srcset) {
        img.srcset = srcset;
        delete img.dataset.srcset;
      }
      img.classList.add("lazy-loaded");
      // ensure width/height attributes are preserved to avoid CLS (developer should output them)
    }
  }

  function loadBackground(el) {
    if (!el) return;
    const bg = el.dataset.bg;
    if (bg) {
      // support multiple URLs (if developer provided)
      el.style.backgroundImage = `url(${bg})`;
      delete el.dataset.bg;
    }
    el.classList.add("lazy-bg-loaded");
  }

  function onIntersection(entries, obs) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (el.tagName === "IMG") {
        loadImage(el);
      } else if (el.classList && el.classList.contains("lazy-bg")) {
        loadBackground(el);
      } else if (el.tagName === "PICTURE") {
        // If a <picture> has been observed, prefer loading its <img>
        loadImage(el.querySelector("img"));
      }

      obs.unobserve(el);
    });
  }

  // Observe a node or NodeList for lazy loading
  function observe(root) {
    if (!ioSupported) return;

    if (!observer) {
      observer = new IntersectionObserver(onIntersection, IO_OPTIONS);
    }

    // images
    const imgs = (root || document).querySelectorAll(SELECTORS.img);
    safeForEach(imgs, (img) => {
      prepareImageForLazy(img);
      observer.observe(img);
    });

    // backgrounds
    const bgs = (root || document).querySelectorAll(SELECTORS.bg);
    safeForEach(bgs, (el) => {
      // only observe if it has data-bg — developer should set data-bg="{{ image | image_url }}"
      if (el.dataset && el.dataset.bg) {
        observer.observe(el);
      }
    });
  }

  /* -------------------------
     FALLBACK (no IntersectionObserver)
  ------------------------- */
  function fallbackLoadAll(root) {
    // simply restore all data-src/data-srcset and data-bg
    const imgs = (root || document).querySelectorAll(SELECTORS.img);
    safeForEach(imgs, (img) => {
      if (img.dataset && img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
      }
      if (img.dataset && img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        delete img.dataset.srcset;
      }
      img.classList.add("lazy-loaded");
    });

    const bgs = (root || document).querySelectorAll(SELECTORS.bg);
    safeForEach(bgs, (el) => {
      if (el.dataset && el.dataset.bg) {
        el.style.backgroundImage = `url(${el.dataset.bg})`;
        delete el.dataset.bg;
        el.classList.add("lazy-bg-loaded");
      }
    });
  }

  /* -------------------------
     SHOPIFY DYNAMIC SECTION HANDLING
     - listens to section load/unload events and initialises nodes inside the new section only.
  ------------------------- */
  function onShopifySectionLoad(e) {
    const sectionRoot = e && e.target ? e.target : document;
    // For safety, run after microtask so DOM is stable
    setTimeout(() => {
      if (ioSupported) {
        observe(sectionRoot);
      } else {
        fallbackLoadAll(sectionRoot);
      }
    }, 50);
  }

  /* -------------------------
     INITIALIZE
  ------------------------- */
  function init() {
    // Add interaction-based asset loader
    addInteractionListeners();

    // Initialize lazy observation or fallback
    if (ioSupported) {
      observe(document);
    } else {
      // load lazily via fallback (no IO)
      // but do not immediately load everything — still defer to assets / interaction if desired
      // here we restore immediately to keep compatibility
      fallbackLoadAll(document);
    }

    // Shopify editor events: re-init when a section loads
    document.addEventListener("shopify:section:load", onShopifySectionLoad);
    document.addEventListener("shopify:section:reorder", onShopifySectionLoad);
    // When sections are removed we don't need special handling — garbage collector and unobserved nodes are fine.

    // If other apps dynamically inject content, we can observe DOM mutations for added nodes:
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          // if a new node contains lazy selectors — initialize only that subtree
          if (
            node.matches &&
            (node.matches(SELECTORS.img) || node.matches(SELECTORS.bg))
          ) {
            if (ioSupported) observe(node.parentNode || document);
            else fallbackLoadAll(node.parentNode || document);
          } else if (
            node.querySelector &&
            (node.querySelector(SELECTORS.img) ||
              node.querySelector(SELECTORS.bg))
          ) {
            if (ioSupported) observe(node);
            else fallbackLoadAll(node);
          }
        });
      });
    });
    mutationObserver.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Run on DOM ready, or immediately if DOM already ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Export small API on window for debugging / manual triggers
  window.__LAZY = {
    observe,
    loadAssets,
    loadAllNow: () => {
      // forcefully load everything now (both assets and media)
      loadAssets();
      if (ioSupported) {
        // attempt to find all observed nodes and load them
        const imgs = document.querySelectorAll(SELECTORS.img);
        safeForEach(imgs, (img) => loadImage(img));
        const bgs = document.querySelectorAll(SELECTORS.bg);
        safeForEach(bgs, (el) => loadBackground(el));
      } else {
        fallbackLoadAll(document);
      }
    },
  };
})();
