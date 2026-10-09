const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Sticky nav shadow / shrink
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Mobile menu
const toggle = document.getElementById("navToggle");
const menu = document.getElementById("navMenu");
const setMenu = (open) => {
  menu.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

// Scroll reveal
const revealIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        revealIO.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealIO.observe(el));

// Count-up stats
const countUp = (el) => {
  const target = +el.dataset.count;
  if (reduceMotion) { el.textContent = target; return; }
  const start = performance.now();
  const duration = 1600;
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      countUp(entry.target);
      countIO.unobserve(entry.target);
    }
  });
});
document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

// Product filter tabs
const tabs = document.querySelectorAll(".tabs__btn");
const cards = document.querySelectorAll(".card");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.toggle("is-active", t === tab);
      t.setAttribute("aria-selected", t === tab);
    });
    const filter = tab.dataset.filter;
    cards.forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.cat !== filter);
    });
  });
});

// Wishlist + add-to-cart feedback
document.querySelectorAll(".card__fav").forEach((btn) => {
  btn.addEventListener("click", () => {
    const on = btn.classList.toggle("is-on");
    btn.querySelector("i").className = on ? "fa-solid fa-heart" : "fa-regular fa-heart";
  });
});
document.querySelectorAll(".card__add").forEach((btn) => {
  btn.addEventListener("click", () => {
    const icon = btn.querySelector("i");
    btn.classList.add("is-added");
    icon.className = "fa-solid fa-check";
    setTimeout(() => {
      btn.classList.remove("is-added");
      icon.className = "fa-solid fa-plus";
    }, 1400);
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
