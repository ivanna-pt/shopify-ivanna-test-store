class ProductRecommendationsCarousel extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.loadRecommendations();
  }

  async loadRecommendations() {
    fetch(
      `${this.dataset.url}&product_id=${this.dataset.productId}&section_id=${this.dataset.sectionId}`
    )
      .then((response) => response.text())
      .then((text) => {
        const html = document.createElement("div");
        html.innerHTML = text;
        const recommendations = html.querySelector(
          "product-recommendations-carousel"
        );
        console.log(recommendations);

        if (recommendations && recommendations.innerHTML.trim().length) {
          this.innerHTML = recommendations.innerHTML;

          this.initSwiper();
        }
      });
  }

  initSwiper() {
    const recommendationsSwiper = new Swiper(
      ".product-recommendations-swiper",
      {
        slidesPerView: 1.2,
        spaceBetween: 16,
        grid: {
          rows: 1,
          fill: "row",
        },
        breakpoints: {
          750: {
            slidesPerView: "auto",
            spaceBetween: 20,
            grid: {
              rows: 1,
            },
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 24,
            grid: {
              rows: 1,
            },
          },
        },
        navigation: {
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        },
      }
    );
  }
}

if (!customElements.get("product-recommendations-carousel")) {
  customElements.define(
    "product-recommendations-carousel",
    ProductRecommendationsCarousel
  );
}
