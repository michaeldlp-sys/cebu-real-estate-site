const form = document.getElementById("inquiry-form");
const message = document.getElementById("form-message");
const themeToggle = document.getElementById("theme-toggle");

const searchForm = document.getElementById("property-search");
const searchOffer = document.getElementById("search-offer");
const searchType = document.getElementById("search-type");
const searchLocation = document.getElementById("search-location");
const searchPrice = document.getElementById("search-price");
const resultsCount = document.getElementById("results-count");
const listingCards = Array.from(document.querySelectorAll(".listing-card"));
const quickLocationButtons = Array.from(document.querySelectorAll("[data-quick-location]"));

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
const savedTheme = localStorage.getItem("theme");
const initialTheme = savedTheme || (mediaQuery.matches ? "dark" : "light");
setTheme(initialTheme);

if (!savedTheme) {
  mediaQuery.addEventListener("change", (event) => {
    setTheme(event.matches ? "dark" : "light");
  });
}

themeToggle.addEventListener("click", () => {
  const currentTheme = document.body.dataset.theme === "dark" ? "dark" : "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem("theme", nextTheme);
});

if (searchForm) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterListings();
  });
}

quickLocationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    searchLocation.value = button.dataset.quickLocation || "";
    filterListings();
  });
});

if (listingCards.length > 0) {
  filterListings();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.elements["name"].value.trim();
  message.textContent = `Thanks, ${name}. A Cebu property advisor will contact you within 24 hours.`;
  form.reset();
});

function setTheme(theme) {
  document.body.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

function filterListings() {
  const selectedOffer = searchOffer.value;
  const selectedType = searchType.value;
  const selectedLocation = searchLocation.value.trim().toLowerCase();
  const maxPrice = Number(searchPrice.value || 0);

  let visible = 0;

  listingCards.forEach((card) => {
    const offer = card.dataset.offer || "";
    const type = card.dataset.type || "";
    const location = (card.dataset.location || "").toLowerCase();
    const price = Number(card.dataset.price || 0);

    const matchesOffer = selectedOffer === "all" || offer === selectedOffer;
    const matchesType = selectedType === "all" || type === selectedType;
    const matchesLocation = selectedLocation === "" || location.includes(selectedLocation);
    const matchesPrice = maxPrice === 0 || price <= maxPrice;

    const isMatch = matchesOffer && matchesType && matchesLocation && matchesPrice;
    card.classList.toggle("is-hidden", !isMatch);

    if (isMatch) {
      visible += 1;
    }
  });

  resultsCount.textContent = `Showing ${visible} of ${listingCards.length} properties`;
}
