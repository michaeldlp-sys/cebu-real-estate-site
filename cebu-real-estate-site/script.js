const form = document.getElementById("inquiry-form");
const message = document.getElementById("form-message");
const themeToggle = document.getElementById("theme-toggle");

const filterType = document.getElementById("filter-type");
const filterBudget = document.getElementById("filter-budget");
const resultsCount = document.getElementById("results-count");
const listingCards = Array.from(document.querySelectorAll(".listing-card"));

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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.elements["name"].value.trim();

  message.textContent = `Thanks, ${name}. A Cebu property advisor will contact you within 24 hours.`;
  form.reset();
});

if (filterType && filterBudget && resultsCount && listingCards.length > 0) {
  filterType.addEventListener("change", updateListingResults);
  filterBudget.addEventListener("change", updateListingResults);
  updateListingResults();
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

function updateListingResults() {
  const selectedType = filterType.value;
  const selectedBudget = filterBudget.value;

  let visibleCount = 0;

  listingCards.forEach((card) => {
    const type = card.dataset.type || "";
    const price = Number(card.dataset.price || 0);

    const matchesType = selectedType === "all" || selectedType === type;
    const matchesBudget = matchesBudgetRange(price, selectedBudget);
    const isVisible = matchesType && matchesBudget;

    card.classList.toggle("is-hidden", !isVisible);

    if (isVisible) {
      visibleCount += 1;
    }
  });

  const total = listingCards.length;
  resultsCount.textContent = `Showing ${visibleCount} of ${total} listings`;
}

function matchesBudgetRange(price, budget) {
  if (budget === "all") {
    return true;
  }

  if (budget === "below10") {
    return price < 10000000;
  }

  if (budget === "10to15") {
    return price >= 10000000 && price <= 15000000;
  }

  if (budget === "above15") {
    return price > 15000000;
  }

  return true;
}
