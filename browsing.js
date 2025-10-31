// browsing.js

// ---------- FILTER INTERACTIVITY ----------

// Category & Style filter buttons
const tagButtons = document.querySelectorAll(".tag");
tagButtons.forEach(button => {
  button.addEventListener("click", () => {
    button.classList.toggle("active");
    filterProducts();
  });
});

// Color palette filters
const colorSwatches = document.querySelectorAll(".color-swatch");
colorSwatches.forEach(swatch => {
  swatch.addEventListener("click", () => {
    // Remove active border from other swatches
    colorSwatches.forEach(s => s.style.outline = "");
    // Highlight the selected one
    swatch.style.outline = "3px solid #4a148c";
    filterProducts();
  });
});

// Sorting buttons (Most Popular / Newest)
const sortButtons = document.querySelectorAll(".sort-btn");
sortButtons.forEach(button => {
  button.addEventListener("click", () => {
    sortButtons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    sortProducts(button.textContent);
  });
});

// ---------- PRICE RANGE FILTER ----------
const priceRange = document.querySelector('input[type="range"]');
const priceLabels = document.querySelector(".price-labels span:last-child");

if (priceRange && priceLabels) {
  priceRange.addEventListener("input", () => {
    const value = priceRange.value;
    priceLabels.textContent = value >= 1000 ? "1000+" : value;
    filterProducts();
  });
}

// ---------- LIKE BUTTONS ----------
const likeButtons = document.querySelectorAll(".like-button");

likeButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const icon = button.querySelector("svg");
    if (icon.style.color === "rgb(255, 105, 180)") {
      icon.style.color = "#ccc"; // Reset
    } else {
      icon.style.color = "hotpink"; // Active
    }
  });
});

// ---------- PRODUCT FILTERING LOGIC ----------

// Placeholder: normally you’d fetch or store data in JS objects.
// For demo purposes, simulate each product with categories & style.
const products = [
  { id: 1, category: "Anniversary", style: "Elegant", color: "pink", price: 250 },
  { id: 2, category: "Birthday", style: "Fun", color: "yellow", price: 400 },
  { id: 3, category: "Thank you", style: "Minimal", color: "blue", price: 600 },
];

// Example mapping for demo only
const productCards = document.querySelectorAll(".product-card");

function filterProducts() {
  const activeTags = [...document.querySelectorAll(".tag.active")].map(tag => tag.textContent);
  const selectedColor = [...document.querySelectorAll(".color-swatch")].find(s => s.style.outline);
  const selectedColorName = selectedColor ? selectedColor.classList[1] : null;
  const priceLimit = parseInt(priceRange.value);

  products.forEach((product, index) => {
    const card = productCards[index];
    const matchCategory = activeTags.length === 0 || activeTags.includes(product.category);
    const matchStyle = activeTags.length === 0 || activeTags.includes(product.style);
    const matchColor = !selectedColorName || product.color === selectedColorName;
    const matchPrice = product.price <= priceLimit;

    if (matchCategory && matchStyle && matchColor && matchPrice) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// ---------- SORTING LOGIC ----------
function sortProducts(criteria) {
  const grid = document.querySelector(".product-grid");
  const cards = Array.from(grid.children);
  
  if (criteria === "Newest") {
    cards.reverse();
  }
  
  grid.innerHTML = "";
  cards.forEach(card => grid.appendChild(card));
}

// ---------- SEARCH BAR ----------
const searchInput = document.querySelector(".search-input");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    productCards.forEach((card, index) => {
      const product = products[index];
      if (product.category.toLowerCase().includes(query) || product.style.toLowerCase().includes(query)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}

console.log("Browsing page interactive features loaded!");
