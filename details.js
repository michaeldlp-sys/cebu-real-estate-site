const themeToggle = document.getElementById("theme-toggle");

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

const properties = {
  "it-park-condo": {
    meta: "Condominium | For Sale",
    title: "2BR Condo in IT Park",
    price: "PHP 7,800,000",
    location: "Lahug, Cebu City",
    specs: "58 sqm | 2 Bed | 1 Bath",
    summary: "Walkable to offices, dining, and transport hubs. Suitable for professionals and investors seeking stable rental demand."
  },
  "banilad-townhouse": {
    meta: "Townhouse | For Sale",
    title: "Modern Townhouse in Banilad",
    price: "PHP 11,200,000",
    location: "Banilad, Cebu City",
    specs: "120 sqm lot | 3 Bed | 2 Bath",
    summary: "Located in a quiet gated pocket with convenient access to schools, malls, and major roads."
  },
  "talamban-detached": {
    meta: "House | For Sale",
    title: "Single Detached Home in Talamban",
    price: "PHP 15,500,000",
    location: "Talamban, Cebu City",
    specs: "220 sqm lot | 4 Bed | 3 Bath",
    summary: "Spacious family layout with outdoor area and room for future upgrades."
  },
  "mabolo-ayala-rent": {
    meta: "Condominium | For Rent",
    title: "1BR Condo near Ayala",
    price: "PHP 38,000 / month",
    location: "Mabolo, Cebu City",
    specs: "46 sqm | 1 Bed | 1 Bath",
    summary: "Central rental option with easy access to Ayala Center and nearby business districts."
  },
  "talisay-lot": {
    meta: "Lot | For Sale",
    title: "Residential Lot in Talisay",
    price: "PHP 6,200,000",
    location: "Talisay, Cebu",
    specs: "310 sqm lot | Corner parcel",
    summary: "Good lot option for custom-home buyers looking for long-term value."
  },
  "mactan-family-rent": {
    meta: "House | For Rent",
    title: "Family House near Mactan Newtown",
    price: "PHP 55,000 / month",
    location: "Lapu-Lapu, Cebu",
    specs: "180 sqm lot | 3 Bed | 2 Bath",
    summary: "Well-positioned for airport access and island-side lifestyle amenities."
  }
};

const params = new URLSearchParams(window.location.search);
const propertyKey = params.get("property") || "it-park-condo";
const property = properties[propertyKey] || properties["it-park-condo"];

setText("property-meta", property.meta);
setText("property-title", property.title);
setText("property-price", property.price);
setText("property-location", property.location);
setText("property-specs", property.specs);
setText("property-summary", property.summary);

function setTheme(theme) {
  document.body.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}
