// Load only the Bootstrap controls this page uses.
import 'bootstrap/js/dist/carousel';
import 'bootstrap/js/dist/dropdown';
import '../js/navlink.js';
import '../js/about-us.js';
import '../js/ride-diary.js';
import './where-to-next.ts';

// Ignore a second accordion opening until its sibling's transition completes.
// Bootstrap's parent lookup can miss a panel while it has only .collapsing.
document.addEventListener('show.bs.collapse', event => {
  if (!(event.target instanceof HTMLElement)) return;
  const accordion = event.target.closest('.accordion');
  if (accordion?.querySelector('.collapsing')) event.preventDefault();
});
