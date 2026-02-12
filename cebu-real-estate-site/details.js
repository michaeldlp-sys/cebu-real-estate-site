const themeToggle = document.getElementById("theme-toggle");
const properties = Array.isArray(window.PROPERTIES) ? window.PROPERTIES : [];
const propertyContent = document.getElementById("property-content");
const notFound = document.getElementById("not-found");
const propertyImage = document.getElementById("property-image");
const propertyPhotoCaption = document.getElementById("property-photo-caption");
const propertyGallery = document.getElementById("property-gallery");
const lightbox = document.getElementById("photo-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
const IMAGE_FALLBACK = "assets/placeholders/fallback-property.svg";
let activePhotos = [];
let activePhotoIndex = 0;
let lastFocusedElement = null;

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
  activePhotos = photos;

  if (!propertyImage || photos.length === 0) {
    return;
  }

  setMainPhoto(0, property.title);
  propertyImage.style.cursor = "zoom-in";
  propertyImage.addEventListener("click", () => openLightbox(activePhotoIndex, property.title));

  if (!propertyGallery) {
    return;
  }

  propertyGallery.textContent = "";
  photos.forEach((photo, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `photo-thumb ${index === 0 ? "is-active" : ""}`;
    button.dataset.photoIndex = String(index);
    button.setAttribute("aria-label", `View photo ${index + 1}`);

    const thumbImage = document.createElement("img");
    thumbImage.src = photo.url;
    thumbImage.alt = `${photo.label} thumbnail`;
    thumbImage.loading = "lazy";
    thumbImage.addEventListener("error", () => {
      thumbImage.src = IMAGE_FALLBACK;
    }, { once: true });

    const label = document.createElement("span");
    label.textContent = photo.label;

    button.appendChild(thumbImage);
    button.appendChild(label);
    propertyGallery.appendChild(button);
  });

  const thumbButtons = Array.from(propertyGallery.querySelectorAll(".photo-thumb"));
  thumbButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const photoIndex = Number(button.dataset.photoIndex || 0);
      setMainPhoto(photoIndex, property.title);
    });
  });
}

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", () => {
    showLightboxPhoto(activePhotoIndex - 1);
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener("click", () => {
    showLightboxPhoto(activePhotoIndex + 1);
  });
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (!lightbox || lightbox.classList.contains("is-hidden")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
    return;
  }

  if (event.key === "ArrowLeft") {
    showLightboxPhoto(activePhotoIndex - 1);
    return;
  }

  if (event.key === "ArrowRight") {
    showLightboxPhoto(activePhotoIndex + 1);
    return;
  }

  if (event.key === "Tab") {
    trapLightboxFocus(event);
  }
});

function openLightbox(index, title) {
  if (!lightbox || activePhotos.length === 0) {
    return;
  }

  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  lightbox.classList.remove("is-hidden");
  lightbox.dataset.title = title;
  document.body.style.overflow = "hidden";
  showLightboxPhoto(index);
  if (lightboxClose) {
    lightboxClose.focus();
  }
}

function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.classList.add("is-hidden");
  document.body.style.overflow = "";
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function showLightboxPhoto(index) {
  if (!lightboxImage || !lightboxCaption || activePhotos.length === 0) {
    return;
  }

  if (index < 0) {
    activePhotoIndex = activePhotos.length - 1;
  } else if (index >= activePhotos.length) {
    activePhotoIndex = 0;
  } else {
    activePhotoIndex = index;
  }

  const current = activePhotos[activePhotoIndex];
  const title = lightbox && lightbox.dataset.title ? lightbox.dataset.title : "Property";

  lightboxImage.src = current.url;
  lightboxImage.onerror = () => {
    lightboxImage.onerror = null;
    lightboxImage.src = IMAGE_FALLBACK;
  };
  lightboxImage.alt = `${title} ${current.label}`;
  lightboxCaption.textContent = current.label;
}

function setMainPhoto(index, title) {
  if (!propertyImage || activePhotos.length === 0) {
    return;
  }

  const boundedIndex = Math.max(0, Math.min(index, activePhotos.length - 1));
  activePhotoIndex = boundedIndex;
  const current = activePhotos[activePhotoIndex];

  propertyImage.src = current.url;
  propertyImage.onerror = () => {
    propertyImage.onerror = null;
    propertyImage.src = IMAGE_FALLBACK;
  };
  propertyImage.alt = `${title} ${current.label}`;
  if (propertyPhotoCaption) {
    propertyPhotoCaption.textContent = current.label;
  }

  if (propertyGallery) {
    const thumbButtons = Array.from(propertyGallery.querySelectorAll(".photo-thumb"));
    thumbButtons.forEach((button, thumbIndex) => {
      button.classList.toggle("is-active", thumbIndex === activePhotoIndex);
    });
  }
}

function trapLightboxFocus(event) {
  if (!lightbox) {
    return;
  }

  const focusable = Array.from(
    lightbox.querySelectorAll("button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")
  ).filter((element) => !element.hasAttribute("hidden"));

  if (focusable.length === 0) {
    event.preventDefault();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const activeElement = document.activeElement;

  if (!event.shiftKey && activeElement === last) {
    event.preventDefault();
    first.focus();
  } else if (event.shiftKey && activeElement === first) {
    event.preventDefault();
    last.focus();
  }
}

