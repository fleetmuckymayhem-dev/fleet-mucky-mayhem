document.addEventListener("DOMContentLoaded", function () {
    var carousel = document.querySelector("#aboutUsCarousel");
    var indicators = document.querySelectorAll(".carousel-indicators-container .indicator");

    carousel.addEventListener("slid.bs.carousel", function (event) {
      // Remove active class from all indicators
      indicators.forEach(function (indicator) {
        indicator.classList.remove("active");
      });

      // Add active class to the current indicator
      indicators[event.to].classList.add("active");
    });

    // Ensure indicator clicks also update properly
    indicators.forEach(function (indicator, index) {
      indicator.addEventListener("click", function () {
        indicators.forEach((i) => i.classList.remove("active"));
        this.classList.add("active");
      });
    });
  });