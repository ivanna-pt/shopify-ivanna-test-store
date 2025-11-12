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

        if (recommendations && recommendations.innerHTML.trim().length) {
          this.innerHTML = recommendations.innerHTML;
        }
      });
  }
}

customElements.define(
  "product-recommendations-carousel",
  ProductRecommendationsCarousel
);
