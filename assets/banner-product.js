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
  const colorInputs = currentSection.querySelectorAll("[data-color-input]");

  const addToCartButton = currentSection.querySelector("[data-add-to-cart]");

  // Handle color selection and variant update
  colorInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const variantId = input.dataset.variantId;
      const productHandle = currentSection.dataset.productHandle;
      const inputLabel = input.nextElementSibling;

      // Handle color selection
      currentSection
        .querySelectorAll(".tw-color-swatch")
        .forEach((item) => item.classList.remove("active"));
      inputLabel.classList.add("active");

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
