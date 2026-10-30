/* ═══════════════════════════════════════════════════════════
   FOCUS — Professional's Family Meet
   Scroll choreography · parallax · countdown
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Hero entrance ─────────────────────────────────────── */
  window.addEventListener("load", function () {
    requestAnimationFrame(function () {
      document.body.classList.add("loaded");
    });
  });
  // Fallback if load already fired or is delayed by fonts
  setTimeout(function () {
    document.body.classList.add("loaded");
  }, 1200);

  /* ── Reveal on scroll (IntersectionObserver) ───────────── */
  var revealTargets = document.querySelectorAll("[data-reveal], .intro__lines");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ── Scroll progress + parallax (single rAF loop) ──────── */
  var progressBar = document.getElementById("progressBar");
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var ticking = false;

  function update() {
    ticking = false;
    var scrollY = window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar && max > 0) {
      progressBar.style.transform = "scaleX(" + Math.min(scrollY / max, 1) + ")";
    }

    if (!prefersReducedMotion) {
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0;
        var rect = el.getBoundingClientRect();
        var centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
        var shift = centerOffset * speed * -1;
        // Preserve the centering transform on ghost words
        if (el.classList.contains("speaker__ghost") || el.classList.contains("dinner__ghost")) {
          el.style.transform = "translate(-50%, calc(-50% + " + shift.toFixed(1) + "px))";
        } else {
          el.style.transform = "translate3d(0," + shift.toFixed(1) + "px,0)";
        }
      });
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();

  /* ── Countdown to 15 Nov 2026, 4:30 PM IST ─────────────── */
  var target = new Date("2026-11-15T16:30:00+05:30").getTime();
  var cells = {
    days: document.getElementById("cdDays"),
    hours: document.getElementById("cdHours"),
    mins: document.getElementById("cdMins"),
    secs: document.getElementById("cdSecs")
  };

  function pad(n) { return String(n).padStart(2, "0"); }

  function tickCountdown() {
    var diff = target - Date.now();
    if (diff <= 0) {
      cells.days.textContent = "0";
      cells.hours.textContent = "00";
      cells.mins.textContent = "00";
      cells.secs.textContent = "00";
      return;
    }
    var s = Math.floor(diff / 1000);
    cells.days.textContent = Math.floor(s / 86400);
    cells.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    cells.mins.textContent = pad(Math.floor((s % 3600) / 60));
    cells.secs.textContent = pad(s % 60);
  }

  if (cells.days) {
    tickCountdown();
    setInterval(tickCountdown, 1000);
  }
})();
