document.addEventListener("DOMContentLoaded", () => {
  const currentSection = document.querySelector(".section__product-banner");
  const colorButtons = document.querySelectorAll(".color-button");
  const quantityDisplay = document.querySelector(
    ".product--inventory_quantity>span"
  );
  const addToCartButton = document.querySelector(".add-to-cart");

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
        });

      // Update quantity display
      // if (available > 0) {
      //   quantityDisplay.textContent = `In stock: ${available}`;
      // } else if (available == "available") {
      //   quantityDisplay.textContent = "In stock";
      // } else {
      //   quantityDisplay.textContent = "Out of stock";
      // }
    });
  });

  addToCartButton.addEventListener("click", () => {
    // Handle add to cart
  });
});
