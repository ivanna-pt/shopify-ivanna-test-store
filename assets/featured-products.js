const featuredProductsSection = document.querySelectorAll(".featured-products");

featuredProductsSection.forEach((section) => {
  if (!section) return;
  const sortByForm = section.querySelector("#SortByForm");
  const sectionHandle = "featured-products";
  const collectionHandle = section.getAttribute("data-collection-handle");

  // Handle sort by change
  sortByForm.addEventListener("change", (event) => {
    event.preventDefault();
    const sortBy = event.target.value;
    const url = `/collections/${collectionHandle}?sort_by=${sortBy}&sections=${sectionHandle}`;
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = data[sectionHandle];
        const newGrid = tempDiv.querySelector(".featured-products__grid");
        const currentGrid = section.querySelector(".featured-products__grid");
        currentGrid.innerHTML = newGrid.innerHTML;
      });
  });

  // Add to cart functionality
  const addToCartButtons = document.querySelectorAll(
    ".product-card__add-to-cart"
  );
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const variantId = button
        .closest(".product-card")
        .getAttribute("data-variant-id");

      try {
        const addResp = await fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [
              {
                id: variantId,
                quantity: 1,
              },
            ],
          }),
        });

        const sectionsToRender = [
          "cart-icon-bubble",
          "cart-drawer",
          "cart-notification",
        ];
        const url = `/?sections=${sectionsToRender.join(",")}`;

        const response = await fetch(url);
        const data = await response.json();

        // Update cart count bubble
        const bubble = document.querySelector("#cart-icon-bubble");

        if (bubble && data["cart-icon-bubble"]) {
          bubble.innerHTML = data["cart-icon-bubble"];
        }

        // Update mini cart (no cartdrawer element in the DOM)
        // const drawer = document.querySelector("#cart-drawer");
        // if (drawer && data["cart-drawer"]) {
        //   console.log("Updating cart drawer");
        //   drawer.outerHTML = data["cart-drawer"];
        //   document.querySelector(".cart-drawer").classList.add("is-open");
        // }
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    });
  });
});
