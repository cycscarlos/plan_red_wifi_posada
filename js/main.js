(function () {
  "use strict";

  /* ---------- Nav scroll state ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.getElementById("navToggle");
  var mobile = document.getElementById("navMobile");
  toggle.addEventListener("click", function () {
    var isOpen = mobile.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  mobile.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mobile.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Stage accordion ---------- */
  var stageHeads = document.querySelectorAll(".stage__head");
  stageHeads.forEach(function (head) {
    head.addEventListener("click", function () {
      var expanded = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", expanded ? "false" : "true");
    });
  });
  // Open the first stage by default
  if (stageHeads[0]) stageHeads[0].setAttribute("aria-expanded", "true");

  /* ---------- Animated stat counters ---------- */
  var statEls = document.querySelectorAll(".stat__value[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString("es");
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString("es");
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && statEls.length) {
    var statIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statEls.forEach(function (el) { statIo.observe(el); });
  }

  /* ---------- Floating scroll-to-top / scroll-to-bottom button ---------- */
  var scrollFab = document.getElementById("scrollFab");
  if (scrollFab) {
    var FAB_SHOW_AFTER = 380; // px scrolled before the button appears
    var FAB_BOTTOM_MARGIN = 80; // px from the true bottom to flip the icon

    function updateScrollFab() {
      var scrollY = window.scrollY || window.pageYOffset;
      var viewportH = window.innerHeight;
      var fullH = document.documentElement.scrollHeight;
      var distanceToBottom = fullH - (scrollY + viewportH);

      if (scrollY > FAB_SHOW_AFTER) scrollFab.classList.add("is-visible");
      else scrollFab.classList.remove("is-visible");

      if (distanceToBottom <= FAB_BOTTOM_MARGIN) {
        scrollFab.classList.add("is-at-bottom");
        scrollFab.setAttribute("aria-label", "Volver al inicio de la página");
      } else {
        scrollFab.classList.remove("is-at-bottom");
        scrollFab.setAttribute("aria-label", "Ir al final de la página");
      }
    }

    window.addEventListener("scroll", updateScrollFab, { passive: true });
    window.addEventListener("resize", updateScrollFab);
    updateScrollFab();

    scrollFab.addEventListener("click", function () {
      var goingUp = scrollFab.classList.contains("is-at-bottom");
      window.scrollTo({
        top: goingUp ? 0 : document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    });
  }
})();
