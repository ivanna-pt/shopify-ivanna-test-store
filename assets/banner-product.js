class VariantSelector extends HTMLElement {
  constructor() {
    super();
  }

  get section() {
    return this.closest(".section__product-banner");
  }

  get form() {
    return document.getElementById(`product-form-${this.sectionId}`);
  }

  get hiddenInput() {
    return this.form?.querySelector('input[name="id"]');
  }

  get sectionId() {
    return this.dataset.sectionId;
  }

  get productHandle() {
    return this.dataset.productHandle;
  }

  get variants() {
    if (!this._variants) {
      const jsonEl = document.querySelector(
        `#ProductVariants-${this.sectionId}`
      );
      try {
        this._variants = JSON.parse(jsonEl?.textContent || "[]");
      } catch (e) {
        console.error("Failed to parse variants JSON", e);
        this._variants = [];
      }
    }
    return this._variants;
  }

  get optionInputs() {
    return this.querySelectorAll('input[type="radio"]');
  }

  connectedCallback() {
    this.optionInputs.forEach((input) => {
      input.addEventListener("change", (e) => this.onChange(e.target));
    });

    this.syncInitialState();
  }

  onChange(input) {
    this.updateActiveForGroup(input);
    this.updateFromSelection();
  }

  syncInitialState() {
    this.updateFromSelection();
  }

  updateFromSelection() {
    const options = this.getSelectedOptions();
    const variant = this.findVariant(options);

    if (variant) {
      this.hiddenInput.value = variant.id;
      this.updateButtonState(variant.available);
      this.renderSection(variant.id);
    } else {
      this.updateButtonState(false);
    }
  }

  getSelectedOptions() {
    const groups = Array.from(this.querySelectorAll('input[type="radio"]'))
      .map((i) => i.name)
      .filter((v, i, arr) => arr.indexOf(v) === i);

    return groups.map((groupName) => {
      const checked = this.querySelector(`input[name="${groupName}"]:checked`);
      return checked ? checked.value : null;
    });
  }

  findVariant(optionValues) {
    return (
      this.variants.find((v) =>
        optionValues.every((value, index) => {
          if (!value) return true;
          return v[`option${index + 1}`] === value;
        })
      ) || null
    );
  }

  updateActiveForGroup(input) {
    const group = input.name;
    this.querySelectorAll(`input[name="${group}"]`).forEach((i) => {
      const label = i.nextElementSibling;
      if (label) label.classList.toggle("active", i === input);
    });
  }

  updateButtonState(isAvailable) {
    const btn = this.form.querySelector('button[type="submit"]');
    btn.disabled = !isAvailable;
    btn.classList.toggle("button--disabled", !isAvailable);
  }

  renderSection(variantId) {
    const url = `/products/${this.productHandle}?variant=${variantId}&sections=${this.sectionId}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const html = data[this.sectionId];
        if (!html) return;

        const temp = document.createElement("div");
        temp.innerHTML = html;

        this.updateBlock("[data-price-container]", temp);
        this.updateBlock("[data-inventory-quantity]", temp);
        this.updateBlock("[data-product-images]", temp, true);
        this.updateBlock("[data-atc-text]", temp);
      })
      .catch(console.error);
  }

  updateBlock(selector, temp, reInit = false) {
    const newNode = temp.querySelector(selector);
    const current = this.section.querySelector(selector);
    if (!newNode || !current) return;

    current.innerHTML = newNode.innerHTML;

    if (reInit) initProductGallery(this.section);
  }
}

customElements.define("variant-selector", VariantSelector);

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

// document.addEventListener("DOMContentLoaded", () => {
//   currentSections.forEach((section) => {
//     initProductGallery(section);
//     handleOptionSelection(section, "[data-color-input]", ".tw-color-swatch");
//     handleOptionSelection(section, "[data-size-input]", ".tw-size-label");
//   });
// });

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
