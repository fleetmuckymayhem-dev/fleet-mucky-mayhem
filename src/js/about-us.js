const carousel = document.querySelector('#aboutUsCarousel');
const indicators = carousel?.querySelectorAll('.carousel-indicators-container .indicator') ?? [];

// The completed slide transition is the single source of indicator state.
carousel?.addEventListener('slid.bs.carousel', event => {
  indicators.forEach((indicator, index) => {
    const active = index === event.to;
    indicator.classList.toggle('active', active);
    if (active) indicator.setAttribute('aria-current', 'true');
    else indicator.removeAttribute('aria-current');
  });
});
