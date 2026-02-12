const form = document.getElementById("inquiry-form");
const message = document.getElementById("form-message");
const themeToggle = document.getElementById("theme-toggle");

const searchForm = document.getElementById("property-search");
const searchOffer = document.getElementById("search-offer");
const searchType = document.getElementById("search-type");
const searchLocation = document.getElementById("search-location");
const searchPrice = document.getElementById("search-price");
const clearFiltersButton = document.getElementById("clear-filters");
const resultsCount = document.getElementById("results-count");
const listingGrid = document.getElementById("listing-grid");
const emptyState = document.getElementById("empty-state");
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const quickLocationButtons = Array.from(document.querySelectorAll("[data-quick-location]"));
const offerNavLinks = Array.from(document.querySelectorAll("[data-nav-offer]"));

const properties = Array.isArray(window.PROPERTIES) ? window.PROPERTIES : [];
let listingCards = [];
const IMAGE_FALLBACK = "assets/placeholders/fallback-property.svg";

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

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("is-hidden");
    mobileMenu.classList.toggle("is-hidden", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
    menuToggle.textContent = isOpen ? "Menu" : "Close";
  });
}

renderListings(properties);

if (searchForm) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterListings();
  });
}

if (clearFiltersButton) {
  clearFiltersButton.addEventListener("click", () => {
    searchOffer.value = "all";
    searchType.value = "all";
    searchLocation.value = "";
    searchPrice.value = "0";
    filterListings();
  });
}

quickLocationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    searchLocation.value = button.dataset.quickLocation || "";
    filterListings();
  });
});

offerNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const offer = link.dataset.navOffer;
    if (offer) {
      searchOffer.value = offer;
      filterListings();
    }
    if (mobileMenu && menuToggle) {
      mobileMenu.classList.add("is-hidden");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "Menu";
    }
  });
});

if (listingCards.length > 0) {
  filterListings();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.elements["name"].value.trim();
  message.textContent = `Thanks, ${name}. An LV Realty advisor will contact you within 24 hours.`;
  form.reset();
});

function renderListings(items) {
  if (!listingGrid) {
    return;
  }

  listingGrid.textContent = "";

  items.forEach((property) => {
    const card = document.createElement("article");
    card.className = "listing-card";
    card.dataset.offer = property.offer;
    card.dataset.type = property.type;
    card.dataset.location = property.searchLocation;
    card.dataset.price = String(property.price);

    const detailsHref = `details.html?property=${encodeURIComponent(property.slug)}`;
    const coverPhoto = property.coverPhoto || "";

    if (coverPhoto) {
      const photoLink = document.createElement("a");
      photoLink.href = detailsHref;
      photoLink.className = "photo-link";

      const image = document.createElement("img");
      image.className = "listing-photo";
      image.src = coverPhoto;
      image.alt = `${property.title} exterior preview`;
      image.loading = "lazy";
      image.addEventListener("error", () => {
        image.src = IMAGE_FALLBACK;
      }, { once: true });

      photoLink.appendChild(image);
      card.appendChild(photoLink);
    } else {
      const visual = document.createElement("div");
      visual.className = `listing-image ${property.mockTone}`;
      visual.textContent = property.mockLabel;
      card.appendChild(visual);
    }

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = `${property.typeLabel} | ${property.offerLabel}`;
    card.appendChild(meta);

    const title = document.createElement("h3");
    title.textContent = property.title;
    card.appendChild(title);

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatPrice(property.price, property.offer);
    card.appendChild(price);

    const location = document.createElement("p");
    location.className = "location";
    location.textContent = property.location;
    card.appendChild(location);

    const specs = document.createElement("p");
    specs.className = "details";
    specs.textContent = property.specs;
    card.appendChild(specs);

    const detailsLink = document.createElement("a");
    detailsLink.href = detailsHref;
    detailsLink.className = "button button-ghost";
    detailsLink.textContent = "View Details";
    card.appendChild(detailsLink);

    listingGrid.appendChild(card);
  });

  listingCards = Array.from(document.querySelectorAll(".listing-card"));
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
  if (emptyState) {
    emptyState.classList.toggle("is-hidden", visible > 0);
  }
}

function formatPrice(price, offer) {
  const amount = `PHP ${price.toLocaleString("en-PH")}`;
  return offer === "rent" ? `${amount} / month` : amount;
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

