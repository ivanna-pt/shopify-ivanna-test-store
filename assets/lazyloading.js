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
