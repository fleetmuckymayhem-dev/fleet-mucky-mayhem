/**
 * Ride Diary Module
 *
 * 🟢 Beginner: This module handles:
 * 1. Loading ride data from JSON and rendering accordions
 * 2. Toggling between different accordion views (Regular, Longer, Archived)
 *
 * Phase 1: JSON → Accordion rendering
 */

// ============================================================================
// JSON DATA RENDERING FUNCTIONS
// ============================================================================

/**
 * Format a date from ISO format (YYYY-MM-DD) to display format (DD-MMM-YY)
 *
 * @param {string|null} dateString - ISO date string or null for TBD rides
 * @returns {string} Formatted date string (e.g., "21-Feb-26") or "TBD"
 *
 * 🟢 Beginner: This converts machine-readable dates to human-friendly format
 */
import { formatRideDate as formatDate, compareRideDates } from '../lib/dates.ts';
import { loadRideData } from '../lib/data.ts';
import Collapse from 'bootstrap/js/dist/collapse';

// Plain data fields are text. Guidance and notes deliberately support author-written HTML.
function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

/**
 * Generate the accordion header button HTML
 */
function createAccordionButton(ride, collapseId, cssClass) {
  const dateDisplay = formatDate(ride.date);
  return `
    <button class="accordion-button collapsed ${cssClass} lead brand-text" type="button" data-bs-toggle="collapse"
      data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
      ${dateDisplay} | ${escapeHtml(ride.title)}
    </button>
  `;
}

/**
 * Generate the General Info table HTML
 *
 * 🟢 Beginner: This creates the Bootstrap table showing ride details
 */
function createGeneralInfoTable(ride) {
  const meetPointNote = ride.meetPoint.note ? ` ${escapeHtml(ride.meetPoint.note)}` : "";
  const meetPointName = escapeHtml(ride.meetPoint.name);
  const meetPointHtml = ride.meetPoint.googleMapsUrl
    ? `${meetPointName} (<a href="${escapeHtml(ride.meetPoint.googleMapsUrl)}" target="_blank" rel="noopener noreferrer" class="brand-text">Google Maps <i class="bi bi-box-arrow-up-right brand-text link-icon"> </i></a>)${meetPointNote}`
    : `${meetPointName}${meetPointNote}`;

  return `
    <table class="table table-borderless table-dark ride-general-info">
      <tbody class="text-start">
        <tr>
          <th scope="row" style="width: 20%;">DESTINATION:</th>
          <td class="text-start" style="width: 80%;">${escapeHtml(ride.destination ?? 'TBC')}</td>
        </tr>
        <tr>
          <th scope="row" style="width: 20%;">DISTANCE:</th>
          <td class="text-start" style="width: 80%;">${escapeHtml(ride.distanceMiles ?? 'TBC')} miles</td>
        </tr>
        <tr>
          <th scope="row" style="width: 20%;">DEPARTURE TIME:</th>
          <td class="text-start" style="width: 80%;">${escapeHtml(ride.startTime ?? '09:30')} ${meetPointHtml}</td>
        </tr>
        <tr>
          <td colspan="2" class="pt-4">Timings below are for guidance only!</td>
        </tr>
        <tr>
          <th scope="row" style="width: 20%;">OVERALL TIME:</th>
          <td class="text-start" style="width: 80%;">${escapeHtml(ride.overallTime ?? 'TBC')}</td>
        </tr>
        <tr>
          <th scope="row" style="width: 20%;">RIDE TIME:</th>
          <td class="text-start" style="width: 80%;">${escapeHtml(ride.rideTime ?? 'TBC')}</td>
        </tr>
      </tbody>
    </table>
  `;
}

/**
 * Generate the notes section HTML from array of notes
 *
 * 🟢 Beginner: Notes are stored as arrays for cleaner data,
 * but displayed with line breaks for readability
 */
function createNotesHtml(notes) {
  if (!notes || notes.length === 0) {
    return "";
  }

  // Check if notes contain paragraph-style content (longer entries)
  const hasLongNotes = notes.some((note) => note.length > 100);

  if (hasLongNotes) {
    return notes.map((note) => `<p>${note}</p>`).join("");
  }

  return notes.join("<br />");
}

/**
 * Generate the guidance section HTML from string or array of guidance
 *
 * 🟢 Beginner: Guidance can be stored as string or array for cleaner data,
 * but displayed with paragraph formatting for arrays
 */
function createGuidanceHtml(guidance) {
  if (!guidance) {
    return "";
  }

  // If guidance is an array, format each item as a paragraph
  if (Array.isArray(guidance)) {
    return guidance.map((item) => `<p>${item}</p>`).join("");
  }

  // If guidance is a string, use it as-is
  return guidance;
}

/**
 * Generate the photos section HTML
 */
function createPhotosHtml(ride) {
  let html = ride.photosUrl ? `
    <a href="${escapeHtml(ride.photosUrl)}" target="_blank" rel="noopener noreferrer"><img
      src="img/photos.svg" alt="Photos Button" width="50px" height="50px"> <i
      class="bi bi-box-arrow-up-right brand-text link-icon"> </i></a>
  ` : '<p>Photos will be available here soon.</p>';

  if (ride.reliveUrl) {
    html += `<br /><br />
    <p><a href="${escapeHtml(ride.reliveUrl)}" class="brand-text" target="_blank" rel="noopener noreferrer">Relive the adventure here <i class="bi bi-box-arrow-up-right brand-text link-icon"> </i></a></p>`;
  }

  return html;
}

/**
 * Generate a complete accordion item HTML for a ride
 *
 * 🟡 Intermediate: This combines all the helper functions to build
 * the full accordion structure matching the existing HTML pattern
 */
function createAccordionItem(ride, index, group) {
  const headingId = `heading${group}-${index}`;
  const collapseId = `collapse${group}-${index}`;
  const cssClass = `rides${String(ride.year).slice(-2)}`;

  const notesHtml = createNotesHtml(ride.notes);
  const guidanceHtml = createGuidanceHtml(ride.guidance);

  return `
    <div class="accordion-item">
      <h2 class="accordion-header" id="${headingId}">
        ${createAccordionButton(ride, collapseId, cssClass)}
      </h2>
      <div id="${collapseId}" class="accordion-collapse collapse" data-bs-parent="#accordion${group}" aria-labelledby="${headingId}">
        <div class="accordion-body body-text">
          GENERAL INFO:
          ${createGeneralInfoTable(ride)}
          <hr />
          GUIDANCE:<br />
          ${guidanceHtml}
          <hr />
          NOTES:<br />
          ${notesHtml}
          <hr />
          PHOTOS:<br />
          ${createPhotosHtml(ride)}
        </div>
      </div>
    </div>
  `;
}

/**
 * Group rides by year
 *
 * 🟢 Beginner: This organizes rides into year groups for separate accordions
 */
function groupRidesByYear(rides) {
  return rides.reduce((groups, ride) => {
    const year = ride.year;
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(ride);
    return groups;
  }, {});
}

/** Render each programme in calendar order, with undecided dates last. */
function renderRides(rides, group, container) {
  container.innerHTML = [...rides]
    .sort((a, b) => compareRideDates(a.date, b.date))
    .map((ride, index) => createAccordionItem(ride, index + 1, group))
    .join('');
}

function showMessage(container, message) {
  const paragraph = document.createElement('p');
  paragraph.className = 'body-text text-light';
  paragraph.setAttribute('role', 'status');
  paragraph.textContent = message;
  container.replaceChildren(paragraph);
}

async function loadRidesFromJson() {
  const longer = document.getElementById('accordionLonger');
  const menu = document.getElementById('archivedRidesMenu');
  const archives = document.getElementById('archivedRidesGroups');
  const archiveButton = document.getElementById('archivedDropdownBtn');
  archiveButton.disabled = true;
  try {
    const data = await loadRideData();
    renderRides(data.longerRides, 'Longer', longer);
    if (!data.longerRides.length) {
      const programme = data.programmeYear ? 'The ' + data.programmeYear : 'The next';
      showMessage(longer, programme + ' Longer Rides programme will be published here soon.');
    }

    menu.replaceChildren();
    archives.replaceChildren();
    const groups = groupRidesByYear(data.archivedRides);
    for (const year of Object.keys(groups).map(Number).sort((a, b) => b - a)) {
      const accordion = document.createElement('div');
      accordion.id = 'accordion' + year;
      accordion.className = 'accordion accordion-flush text-dark text-start d-none';
      renderRides(groups[year], year, accordion);
      archives.append(accordion);

      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.id = 'showArchived' + year;
      button.className = 'dropdown-item';
      button.textContent = String(year);
      button.addEventListener('click', () => showAccordion(accordion.id, button.id));
      item.append(button);
      menu.append(item);
    }
    archiveButton.disabled = !menu.children.length;
  } catch (error) {
    console.error('Error loading Ride Diary:', error);
    showMessage(longer, 'Unable to load Longer Rides. Please try refreshing the page.');
  }
}

// ============================================================================
// ACCORDION VISIBILITY TOGGLE FUNCTIONS
// ============================================================================

function showAccordion(targetAccordionIds, activeButtonId) {
  document.querySelectorAll('#ride-diary .accordion').forEach((accordion) => {
    accordion.classList.add('d-none');
  });

  // Show the target accordion(s)
  // targetAccordionIds can be a string or an array of strings
  const idsToShow = Array.isArray(targetAccordionIds) ? targetAccordionIds : [targetAccordionIds];
  idsToShow.forEach((id) => {
    document.getElementById(id).classList.remove('d-none');
  });

  // Update button styles for regular buttons
  const primaryButtons = ['showRegular', 'showLonger'];
  primaryButtons.forEach((id) => {
    const button = document.getElementById(id);
    if (!button) return;
    if (id === activeButtonId) {
      button.classList.add('btn-warning');
      button.classList.remove('btn-secondary');
    } else {
      button.classList.add('btn-secondary');
      button.classList.remove('btn-warning');
    }
  });

  // Update archived dropdown button style
  const archivedDropdownBtn = document.getElementById('archivedDropdownBtn');
  if (archivedDropdownBtn) {
    if (activeButtonId.startsWith('showArchived')) {
      archivedDropdownBtn.classList.add('btn-warning');
      archivedDropdownBtn.classList.remove('btn-secondary');
    } else {
      archivedDropdownBtn.classList.add('btn-secondary');
      archivedDropdownBtn.classList.remove('btn-warning');
    }
  }

  // Collapse all accordion items in the displayed accordion(s)
  idsToShow.forEach((id) => {
    collapseAllAccordionItems(id);
  });
}

function collapseAllAccordionItems(accordionId) {
  const accordion = document.getElementById(accordionId);
  if (!accordion) return;

  accordion.querySelectorAll('.accordion-collapse').forEach(panel => {
    const collapse = Collapse.getOrCreateInstance(panel, { toggle: false });
    if (panel.classList.contains('collapsing')) {
      const settled = () => {
        panel.removeEventListener('shown.bs.collapse', settled);
        panel.removeEventListener('hidden.bs.collapse', settled);
        collapse.hide();
      };
      panel.addEventListener('shown.bs.collapse', settled, { once: true });
      panel.addEventListener('hidden.bs.collapse', settled, { once: true });
    } else {
      collapse.hide();
    }
  });
}

// Add event listeners for buttons
document.getElementById('showRegular').addEventListener('click', function () {
  showAccordion('accordionRegular', 'showRegular');
});

document.getElementById('showLonger').addEventListener('click', function () {
  showAccordion('accordionLonger', 'showLonger');
});

/** Initialize controls once the ride groups have been rendered. */
async function initRideDiary() {
  await loadRidesFromJson();
  showAccordion('accordionRegular', 'showRegular');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRideDiary, { once: true });
} else {
  void initRideDiary();
}
