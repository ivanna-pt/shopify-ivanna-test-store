document.addEventListener("DOMContentLoaded", () => {
  const colorButtons = document.querySelectorAll(".color-button");
  const quantityDisplay = document.querySelector(
    ".product--inventory_quantity>span"
  );
  const addToCartButton = document.querySelector(".add-to-cart");

  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const variantId = button.getAttribute("data-variant-id");
      const color = button.getAttribute("data-color");
      const available = button.getAttribute("data-available");

      // Handle color selection
      colorButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Update quantity display
      if (available > 0) {
        quantityDisplay.textContent = `In stock: ${available}`;
      } else if (available == "available") {
        quantityDisplay.textContent = "In stock";
      } else {
        quantityDisplay.textContent = "Out of stock";
      }
    });
  });

  addToCartButton.addEventListener("click", () => {
    // Handle add to cart
  });
});
