// document.addEventListener("DOMContentLoaded", () => {
//   let loaded = false;

//   const scriptUrls = [
//     "/cdn/shop/t/13/assets/swiper-bundle.min.js?v=153095317606561337801763567068",
//   ];

//   const styleUrls = [
//     "/cdn/shop/t/13/assets/swiper-bundle.min.css?v=178409850749087333521763567068",
//   ];

//   const loadAssets = () => {
//     if (loaded) return;
//     loaded = true;

//     scriptUrls.filter(Boolean).forEach((url) => {
//       const s = document.createElement("script");
//       s.src = url;
//       s.defer = true;
//       document.head.appendChild(s);
//     });

//     styleUrls.filter(Boolean).forEach((url) => {
//       const l = document.createElement("link");
//       l.rel = "stylesheet";
//       l.href = url;
//       document.head.appendChild(l);
//     });

//     console.log("Lazy-loaded Swiper assets");

//     events.forEach((e) => document.removeEventListener(e, loadAssets));
//   };

//   const events = ["click", "scroll", "touchstart", "mousemove", "keydown"];
//   events.forEach((e) => document.addEventListener(e, loadAssets));

//   if ("requestIdleCallback" in window) {
//     requestIdleCallback(loadAssets, { timeout: 3000 });
//   }
// });

(function () {
  if (!("IntersectionObserver" in window)) return;

  const lazyImages = document.querySelectorAll("img.lazy-image");
  const lazyBgEls = document.querySelectorAll(".lazy-bg");

  if (!lazyImages.length && !lazyBgEls.length) return;

  const onIntersection = (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;

      if (el.tagName === "IMG") {
        const src = el.dataset.src;
        const srcset = el.dataset.srcset;

        if (src) el.src = src;
        if (srcset) el.srcset = srcset;

        el.classList.add("lazy-loaded");
      }

      if (el.classList.contains("lazy-bg")) {
        const bg = el.dataset.bg;
        if (bg) el.style.backgroundImage = `url(${bg})`;
        el.classList.add("lazy-bg-loaded");
      }

      observer.unobserve(el);
    });
  };

  const observer = new IntersectionObserver(onIntersection, {
    rootMargin: "200px 0px",
    threshold: 0.01,
  });

  lazyImages.forEach((img) => {
    if (img.src) {
      img.dataset.src = img.src;
      img.removeAttribute("src");
    }
    if (img.srcset) {
      img.dataset.srcset = img.srcset;
      img.removeAttribute("srcset");
    }
    observer.observe(img);
  });

  lazyBgEls.forEach((el) => {
    observer.observe(el);
  });

  document.addEventListener("shopify:section:load", () => {
    setTimeout(() => {
      const event = new Event("DOMContentLoaded");
      document.dispatchEvent(event);
    }, 50);
  });
})();
