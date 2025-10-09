const currentSection = document.querySelector(".section__product-banner");

// Handle product image gallery
function initProductGallery() {
  const mainImage = currentSection.querySelector(".main-image img");
  const thumbs = currentSection.querySelectorAll(".gallery-thumb");

  if (!mainImage || !thumbs.length) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", (e) => {
      const mainImageUrl = thumb.dataset.large;
      const mainImageAlt = thumb.alt;
      const thumbWrapper = thumb.closest(".product-gallery__item");

      if (thumb.dataset.srcset) {
        mainImage.srcset = thumb.dataset.srcset;
        mainImage.sizes = thumb.dataset.sizes;
      }

      mainImage.src = mainImageUrl;
      mainImage.alt = mainImageAlt;

      // Update active thumbnail styling
      currentSection
        .querySelectorAll(".product-gallery__item")
        .forEach((item) => item.classList.remove("active"));
      thumbWrapper.classList.add("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", initProductGallery);

document.addEventListener("DOMContentLoaded", () => {
  const colorButtons = currentSection.querySelectorAll(".color-button");

  const addToCartButton = currentSection.querySelector(".add-to-cart");

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
          currentSection.querySelector(".price-container").innerHTML =
            tempDiv.querySelector(".price-container").innerHTML;
          currentSection.querySelector(
            ".product--inventory_quantity"
          ).innerHTML = tempDiv.querySelector(
            ".product--inventory_quantity"
          ).innerHTML;
          currentSection.querySelector(".product-images").innerHTML =
            tempDiv.querySelector(".product-images").innerHTML;
          initProductGallery();
        });
    });
  });

  addToCartButton.addEventListener("click", () => {
    // Handle add to cart
  });
});
