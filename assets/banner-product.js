const currentSection = document.querySelector(".section__product-banner");

// Handle product image gallery
function initProductGallery() {
  const mainImage = currentSection.querySelector("[data-main-image] img");
  const thumbs = currentSection.querySelectorAll("[data-gallery-thumb]");

  if (!mainImage || !thumbs.length) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", (e) => {
      const mainImageUrl = thumb.dataset.large;
      const mainImageAlt = thumb.alt;
      const thumbWrapper = thumb.closest("[data-gallery-item]");

      if (thumb.dataset.srcset) {
        mainImage.srcset = thumb.dataset.srcset;
        mainImage.sizes = thumb.dataset.sizes;
      }

      mainImage.src = mainImageUrl;
      mainImage.alt = mainImageAlt;

      // Update active thumbnail styling
      currentSection
        .querySelectorAll("[data-gallery-item]")
        .forEach((item) => item.classList.remove("active"));
      thumbWrapper.classList.add("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", initProductGallery);

document.addEventListener("DOMContentLoaded", () => {
  const colorButtons = currentSection.querySelectorAll("[data-color-button]");

  const addToCartButton = currentSection.querySelector("[data-add-to-cart]");

  // Handle color selection and variant update
  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const variantId = button.dataset.variantId;
      const productHandle = button.dataset.productHandle;

      // Handle color selection
      colorButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Update variant information with Section Rendering API
      const url = `/products/${productHandle}?variant=${variantId}&sections=banner-product`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = data["banner-product"];
          currentSection.querySelector("[data-price-container]").innerHTML =
            tempDiv.querySelector("[data-price-container]").innerHTML;
          currentSection.querySelector("[data-inventory-quantity]").innerHTML =
            tempDiv.querySelector("[data-inventory-quantity]").innerHTML;
          currentSection.querySelector("[data-product-images]").innerHTML =
            tempDiv.querySelector("[data-product-images]").innerHTML;
          initProductGallery();
        });
    });
  });

  addToCartButton.addEventListener("click", () => {
    // Handle add to cart
  });
});
