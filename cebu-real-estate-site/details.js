const themeToggle = document.getElementById("theme-toggle");
const properties = Array.isArray(window.PROPERTIES) ? window.PROPERTIES : [];
const propertyContent = document.getElementById("property-content");
const notFound = document.getElementById("not-found");
const propertyImage = document.getElementById("property-image");
const propertyPhotoCaption = document.getElementById("property-photo-caption");
const propertyGallery = document.getElementById("property-gallery");
const IMAGE_FALLBACK = "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1400&q=80";

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
const property = properties.find((item) => item.slug === propertyKey);

if (property) {
  setText("property-meta", `${property.typeLabel} | ${property.offerLabel}`);
  setText("property-title", property.title);
  setText("property-price", formatPrice(property.price, property.offer));
  setText("property-location", property.location);
  setText("property-specs", property.specs);
  setText("property-summary", property.summary);
  setGallery(property);
} else {
  if (propertyContent) {
    propertyContent.classList.add("is-hidden");
  }
  if (notFound) {
    notFound.classList.remove("is-hidden");
  }
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

function setGallery(property) {
  const photos = Array.isArray(property.interiorGallery) ? property.interiorGallery.slice(0, 4) : [];

  if (!propertyImage || photos.length === 0) {
    return;
  }

  propertyImage.src = photos[0].url;
  propertyImage.onerror = () => {
    propertyImage.src = IMAGE_FALLBACK;
  };
  propertyImage.alt = `${property.title} photo 1`;
  if (propertyPhotoCaption) {
    propertyPhotoCaption.textContent = photos[0].label;
  }

  if (!propertyGallery) {
    return;
  }

  const thumbs = photos.map((photo, index) => {
    const isActive = index === 0 ? "is-active" : "";
    return `
      <button class="photo-thumb ${isActive}" type="button" data-photo-index="${index}" aria-label="View photo ${index + 1}">
        <img src="${photo.url}" alt="${photo.label} thumbnail" loading="lazy" onerror="this.onerror=null;this.src='${IMAGE_FALLBACK}';" />
        <span>${photo.label}</span>
      </button>
    `;
  }).join("");

  propertyGallery.innerHTML = thumbs;

  const thumbButtons = Array.from(propertyGallery.querySelectorAll(".photo-thumb"));
  thumbButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const photoIndex = Number(button.dataset.photoIndex || 0);
      const next = photos[photoIndex];
      if (!next) {
        return;
      }

      propertyImage.src = next.url;
      propertyImage.alt = `${property.title} photo ${photoIndex + 1}`;
      if (propertyPhotoCaption) {
        propertyPhotoCaption.textContent = next.label;
      }

      thumbButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
    });
  });
}
