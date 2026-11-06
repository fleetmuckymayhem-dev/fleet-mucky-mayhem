import Collapse from 'bootstrap/js/dist/collapse';

// Navigation owns only its links; carousel and dropdown state stay independent.
const nav = document.querySelector('header nav');
const navLinkEls = nav?.querySelectorAll('.nav-link') ?? [];
const sections = [...navLinkEls].map(link => document.querySelector(link.hash)).filter(Boolean);

function setActiveLink(link) {
  navLinkEls.forEach(item => {
    item.classList.toggle('active', item === link);
    if (item === link) item.setAttribute('aria-current', 'location');
    else item.removeAttribute('aria-current');
  });
}

const menu = nav?.querySelector('#navbarNav');
const toggler = nav?.querySelector('.navbar-toggler');
navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    setActiveLink(link);
    if (menu?.classList.contains('show') && toggler && getComputedStyle(toggler).display !== 'none') {
      Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
    }
  });
});
menu?.addEventListener('hidden.bs.collapse', () => {
  // A collapsed menu must not keep keyboard focus on a hidden link.
  if (menu.contains(document.activeElement)) toggler?.focus();
});

let scheduled = false;
function updateActiveSection() {
  scheduled = false;
  const position = window.scrollY + (nav?.offsetHeight ?? 60) + 20;
  let current = sections[0];
  for (const section of sections) {
    if (section.offsetTop <= position) current = section;
  }
  const link = [...navLinkEls].find(item => item.hash === '#' + current?.id);
  if (link) setActiveLink(link);
}
window.addEventListener('scroll', () => {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(updateActiveSection);
  }
}, { passive: true });
window.addEventListener('resize', updateActiveSection);
window.addEventListener('pageshow', updateActiveSection);
updateActiveSection();
