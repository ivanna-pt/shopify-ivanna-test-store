const featuredProductsSection = document.querySelectorAll(".featured-products");

featuredProductsSection.forEach((section) => {
  const sortByForm = section.querySelector("#SortByForm");
  const sectionId = section.getAttribute("data-section-id");
  const collectionHandle = section.getAttribute("data-collection-handle");

  sortByForm.addEventListener("change", (event) => {
    event.preventDefault();
    const sortBy = event.target.value;
    const url = `/collections/${collectionHandle}?sort_by=${sortBy}&section_id=${sectionId}`;
    fetch(url)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = data;
        const newGrid = tempDiv.querySelector(".featured-products__grid");
        const currentGrid = section.querySelector(".featured-products__grid");
        currentGrid.innerHTML = newGrid.innerHTML;
      });
  });
});
