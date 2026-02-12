const themeToggle = document.getElementById("theme-toggle");
const properties = Array.isArray(window.PROPERTIES) ? window.PROPERTIES : [];

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

const params = new URLSearchParams(window.location.search);
const propertyKey = params.get("property");
const property = properties.find((item) => item.slug === propertyKey) || properties[0];

if (property) {
  setText("property-meta", `${property.typeLabel} | ${property.offerLabel}`);
  setText("property-title", property.title);
  setText("property-price", formatPrice(property.price, property.offer));
  setText("property-location", property.location);
  setText("property-specs", property.specs);
  setText("property-summary", property.summary);
  setMockImage(property);
}

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

function formatPrice(price, offer) {
  const amount = `PHP ${price.toLocaleString("en-PH")}`;
  return offer === "rent" ? `${amount} / month` : amount;
}

function setMockImage(property) {
  const image = document.getElementById("property-image");
  if (!image) {
    return;
  }

  image.classList.add(property.mockTone);
  image.textContent = property.mockLabel;
}
