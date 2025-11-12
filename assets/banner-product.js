const currentSections = document.querySelectorAll(".section__product-banner");

// Handle product image gallery
function initProductGallery(section) {
  const mainImage = section.querySelector("[data-main-image] img");
  const thumbs = section.querySelectorAll("[data-gallery-thumb]");

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
      section
        .querySelectorAll("[data-gallery-item]")
        .forEach((item) => item.classList.remove("active"));
      thumbWrapper.classList.add("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  currentSections.forEach((section) => {
    initProductGallery(section);
    handleOptionSelection(section, "[data-color-input]", ".tw-color-swatch");
    handleOptionSelection(section, "[data-size-input]", ".tw-size-label");
  });
});

function handleOptionSelection(section, optionSelector, labelSelector) {
  const optionInputs = section.querySelectorAll(optionSelector);
  const productHandle = section.dataset.productHandle;

  optionInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const variantId = input.dataset.variantId;
      const inputLabel = input.nextElementSibling;

      // Handle color selection
      section
        .querySelectorAll(labelSelector)
        .forEach((item) => item.classList.remove("active"));
      inputLabel.classList.add("active");

      // Update variant information when color is selected with Section Rendering API
      if (input.getAttribute("data-color-input") !== null) {
        const url = `/products/${productHandle}?variant=${variantId}&sections=banner-product`;
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = data["banner-product"];
            section.querySelector("[data-price-container]").innerHTML =
              tempDiv.querySelector("[data-price-container]").innerHTML;
            section.querySelector("[data-inventory-quantity]").innerHTML =
              tempDiv.querySelector("[data-inventory-quantity]").innerHTML;
            section.querySelector("[data-product-images]").innerHTML =
              tempDiv.querySelector("[data-product-images]").innerHTML;
            initProductGallery(section);
          });
      }
    });
  });
}
