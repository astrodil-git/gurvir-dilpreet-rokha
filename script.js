const eventDate = new Date("2026-10-24T18:00:00-07:00");

function updateCountdown() {
  const now = new Date();
  const difference = eventDate - now;

  if (difference <= 0) {
    document.getElementById("days").textContent = "000";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("days").textContent = String(days).padStart(3, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

function loadInviteCard() {
  const image = document.getElementById("invite-card-image");

  if (!image) {
    return;
  }

  const candidates = ["assets/invite-card.jpg", "assets/invite-card.png"];
  let index = 0;

  image.onerror = () => {
    index += 1;

    if (index < candidates.length) {
      image.src = candidates[index];
      return;
    }

    image.onerror = null;
    image.src = image.dataset.placeholder;
  };

  image.src = candidates[index];
}

loadInviteCard();

function tryImageCandidates(image, candidates, onDone) {
  let index = 0;

  function tryNext() {
    if (index >= candidates.length) {
      onDone(false);
      return;
    }

    const src = candidates[index];
    index += 1;

    image.onload = () => {
      image.onload = null;
      image.onerror = null;
      onDone(true, src);
    };

    image.onerror = () => {
      tryNext();
    };

    image.src = src;
  }

  tryNext();
}

function loadHeroPhoto() {
  const hero = document.querySelector(".hero");

  if (!hero) {
    return;
  }

  const probe = new Image();
  const candidates = [
    "assets/hero-photo.jpg",
    "assets/hero-photo.jpeg",
    "assets/hero-photo.png"
  ];

  tryImageCandidates(probe, candidates, (success, src) => {
    if (!success) {
      return;
    }

    hero.style.setProperty("--hero-image", `url("${src}")`);
    hero.classList.add("has-photo");
  });
}

function loadPhotoGallery() {
  const carousel = document.getElementById("photo-carousel");
  const track = document.getElementById("carousel-track");
  const dots = document.getElementById("carousel-dots");
  const prevButton = document.getElementById("carousel-prev");
  const nextButton = document.getElementById("carousel-next");

  if (!carousel || !track || !dots || !prevButton || !nextButton) {
    return;
  }

  const slots = [
    { id: "photo-1", candidates: ["assets/photo-1.jpg", "assets/photo-1.jpeg", "assets/photo-1.png"] },
    { id: "photo-2", candidates: ["assets/photo-2.jpg", "assets/photo-2.jpeg", "assets/photo-2.png"] },
    { id: "photo-3", candidates: ["assets/photo-3.jpg", "assets/photo-3.jpeg", "assets/photo-3.png"] }
  ];

  let completedLoads = 0;

  slots.forEach((slot) => {
    const image = document.getElementById(slot.id);

    if (!image) {
      return;
    }

    tryImageCandidates(image, slot.candidates, (success) => {
      if (!success) {
        const frame = image.closest(".photo-frame");

        if (frame) {
          frame.hidden = true;
        }
      } else {
        image.hidden = false;
      }

      completedLoads += 1;

      if (completedLoads === slots.length) {
        initializeCarousel();
      }
    });
  });

  function initializeCarousel() {
    const slides = Array.from(track.querySelectorAll(".carousel-slide")).filter(
      (slide) => !slide.hidden
    );

    if (slides.length === 0) {
      return;
    }

    let currentIndex = 0;

    carousel.hidden = false;
    dots.hidden = false;
    dots.innerHTML = "";

    slides.forEach((slide, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Go to photo ${index + 1}`);
      dot.addEventListener("click", () => {
        currentIndex = index;
        render();
      });
      dots.appendChild(dot);
    });

    prevButton.hidden = slides.length < 2;
    nextButton.hidden = slides.length < 2;

    prevButton.onclick = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      render();
    };

    nextButton.onclick = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      render();
    };

    function render() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      Array.from(dots.children).forEach((dot, index) => {
        dot.classList.toggle("is-active", index === currentIndex);
      });
    }

    render();
  }
}

loadHeroPhoto();
loadPhotoGallery();
