document.addEventListener("DOMContentLoaded", () => {
  let loaded = false;

  const scriptUrls = [
    "/cdn/shop/t/13/assets/swiper-bundle.min.js?v=153095317606561337801763567068",
  ];

  const styleUrls = [
    "/cdn/shop/t/13/assets/swiper-bundle.min.css?v=178409850749087333521763567068",
  ];

  const loadAssets = () => {
    if (loaded) return;
    loaded = true;

    scriptUrls.filter(Boolean).forEach((url) => {
      const s = document.createElement("script");
      s.src = url;
      s.defer = true;
      document.head.appendChild(s);
    });

    styleUrls.filter(Boolean).forEach((url) => {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = url;
      document.head.appendChild(l);
    });

    console.log("Lazy-loaded Swiper assets");

    events.forEach((e) => document.removeEventListener(e, loadAssets));
  };

  const events = ["click", "scroll", "touchstart", "mousemove", "keydown"];
  events.forEach((e) => document.addEventListener(e, loadAssets));

  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadAssets, { timeout: 3000 });
  }
});
