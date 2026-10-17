/**
 * Ride Diary Module
 *
 * 🟢 Beginner: This module handles:
 * 1. Loading ride data from JSON and rendering accordions
 * 2. Toggling between different accordion views (Regular, Longer, Archived)
 *
 * Phase 1: JSON → Accordion rendering
 * Phase 2 (future): FullCalendar integration
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
function formatDate(dateString) {
  if (!dateString) {
    return "TBD";
  }

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const month = months[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);

  return `${day}-${month}-${year}`;
}

/**
 * Generate the accordion header button HTML
 */
function createAccordionButton(ride, collapseId, cssClass) {
  const dateDisplay = formatDate(ride.date);
  return `
    <button class="accordion-button collapsed ${cssClass} lead brand-text" type="button" data-bs-toggle="collapse"
      data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
      ${dateDisplay} | ${ride.title}
    </button>
  `;
}

/**
 * Generate the General Info table HTML
 *
 * 🟢 Beginner: This creates the Bootstrap table showing ride details
 */
function createGeneralInfoTable(ride) {
  const meetPointNote = ride.meetPoint.note ? ` ${ride.meetPoint.note}` : "";
  const meetPointHtml = ride.meetPoint.googleMapsUrl
    ? `${ride.meetPoint.name} (<a href="${ride.meetPoint.googleMapsUrl}" target="_blank" class="brand-text">Google Maps <i class="bi bi-box-arrow-up-right brand-text link-icon"> </i></a>)${meetPointNote}`
    : ride.meetPoint.name;

  return `
    <table class="table table-borderless table-dark">
      <tbody class="text-start">
        <tr>
          <th scope="row" style="width: 20%;">DESTINATION:</th>
          <td class="text-start" style="width: 80%;">${ride.destination}</td>
        </tr>
        <tr>
          <th scope="row" style="width: 20%;">DISTANCE:</th>
          <td class="text-start" style="width: 80%;">${ride.distanceMiles} miles</td>
        </tr>
        <tr>
          <th scope="row" style="width: 20%;">OVERALL TIME:</th>
          <td class="text-start" style="width: 80%;">${ride.overallTime}</td>
        </tr>
        <tr>
          <th scope="row" style="width: 20%;">DEPARTURE TIME:</th>
          <td class="text-start" style="width: 80%;">${ride.startTime} ${meetPointHtml}</td>
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
  let html = `
    <a href="${ride.photosUrl}" target="_blank"><img
      src="img/photos.svg" alt="Photos Button" width="50px" height="50px"> <i
      class="bi bi-box-arrow-up-right brand-text link-icon"> </i></a>
  `;

  if (ride.reliveUrl) {
    html += `<br /><br />
    <p><a href="${ride.reliveUrl}" class="brand-text" target="_blank">Relive the adventure here <i class="bi bi-box-arrow-up-right brand-text link-icon"> </i></a></p>`;
  }

  return html;
}

/**
 * Generate a complete accordion item HTML for a ride
 *
 * 🟡 Intermediate: This combines all the helper functions to build
 * the full accordion structure matching the existing HTML pattern
 */
function createAccordionItem(ride, index, year) {
  const headingId = `heading${year}-${index}`;
  const collapseId = `collapse${year}-${index}`;
  const cssClass = `rides${String(year).slice(-2)}`;

  const notesHtml = createNotesHtml(ride.notes);
  const guidanceHtml = createGuidanceHtml(ride.guidance);

  return `
    <!-- ${formatDate(ride.date)} | ${ride.title} -->
    <div class="accordion-item">
      <h2 class="accordion-header" id="${headingId}">
        ${createAccordionButton(ride, collapseId, cssClass)}
      </h2>
      <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headingId}">
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

/**
 * Sort rides by date for archived rides (newest first)
 *
 * 🟢 Beginner: Archived rides show most recent at the top
 */
function sortRidesNewestFirst(rides) {
  return [...rides].sort((a, b) => {
    // Both have dates - sort descending (newest first)
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }
    // TBD rides go last for archived
    if (!a.date) return 1;
    if (!b.date) return -1;
    return 0;
  });
}

/**
 * Sort rides by date for longer/upcoming rides (chronological order)
 * Dated rides first (oldest to newest), then TBD rides
 *
 * 🟢 Beginner: Upcoming rides show in calendar order (Feb, Mar, Apr...)
 * with TBD rides at the end
 */
function sortRidesChronological(rides) {
  return [...rides].sort((a, b) => {
    // Both have dates - sort ascending (oldest first)
    if (a.date && b.date) {
      return new Date(a.date) - new Date(b.date);
    }
    // TBD rides (null date) go last
    if (!a.date) return 1;
    if (!b.date) return -1;
    return 0;
  });
}

/**
 * Render rides for a specific year into an accordion container
 *
 * @param {Array} rides - Array of ride objects
 * @param {number} year - The year for IDs
 * @param {string} containerId - The DOM container ID
 * @param {string} sortOrder - 'chronological' for upcoming rides, 'newest' for archived
 */
function renderYearAccordion(rides, year, containerId, sortOrder = "newest") {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container ${containerId} not found`);
    return;
  }

  const sortedRides =
    sortOrder === "chronological"
      ? sortRidesChronological(rides)
      : sortRidesNewestFirst(rides);

  const accordionHtml = sortedRides
    .map((ride, index) => createAccordionItem(ride, index + 1, year))
    .join("");

  container.innerHTML = accordionHtml;
}

/**
 * Load JSON and render all accordions
 *
 * 🟢 Beginner: This loads the ride data and generates the HTML
 */
async function loadRidesFromJson() {
  try {
    const response = await fetch("data/longer-rides.json");
    if (!response.ok) {
      throw new Error(`Failed to load longer-rides.json: ${response.status}`);
    }

    const data = await response.json();

    // Render 2026 longer rides (chronological order: Feb, Mar, Apr, then TBDs)
    if (data.longerRides) {
      const rides2026 = data.longerRides.filter((r) => r.year === 2026);
      if (rides2026.length > 0) {
        renderYearAccordion(rides2026, 2026, "accordion2026", "chronological");
      }
    }

    // Render archived rides by year (chronological order)
    if (data.archivedRides) {
      const rides2025 = data.archivedRides.filter((r) => r.year === 2025);
      const rides2024 = data.archivedRides.filter((r) => r.year === 2024);

      if (rides2025.length > 0) {
        renderYearAccordion(rides2025, 2025, "accordion2025", "chronological");
      }
      if (rides2024.length > 0) {
        renderYearAccordion(rides2024, 2024, "accordion2024", "chronological");
      }
    }

    console.log("Ride Diary loaded from JSON successfully");
    return true;
  } catch (error) {
    console.error("Error loading Ride Diary:", error);
    // Fallback: Leave existing static HTML in place
    return false;
  }
}

// ============================================================================
// ACCORDION VISIBILITY TOGGLE FUNCTIONS
// ============================================================================

function showAccordion(targetAccordionIds, activeButtonId) {
  // Hide all accordions (now includes accordion2024)
  const accordions = ['accordion2025', 'accordion2026', 'accordion2024', 'accordionRegular'];
  accordions.forEach((id) => {
    document.getElementById(id).classList.add('d-none');
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
    if (activeButtonId === 'showArchived2025' || activeButtonId === 'showArchived2024') {
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

// This function is no longer needed as we removed the dropdown structure
// Keeping it as a no-op function in case it's referenced elsewhere
function updateLongerDropdownActive(selectedYear) {
  // No-op: dropdown structure has been removed
}

function collapseAllAccordionItems(accordionId) {
  const accordion = document.getElementById(accordionId);
  if (!accordion) return;

  const items = accordion.querySelectorAll('.accordion-item');
  items.forEach((item) => {
    const button = item.querySelector('.accordion-button');
    const collapse = item.querySelector('.accordion-collapse');

    button.classList.add('collapsed');
    button.setAttribute('aria-expanded', 'false');
    collapse.classList.remove('show');
  });
}

// Add event listeners for buttons
document.getElementById('showRegular').addEventListener('click', function () {
  showAccordion('accordionRegular', 'showRegular');
});

document.getElementById('showLonger').addEventListener('click', function () {
  showAccordion('accordion2026', 'showLonger');
});

// Add event listeners for archived rides dropdown items
document.getElementById('showArchived2025').addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default anchor behavior
  showAccordion('accordion2025', 'showArchived2025');
});

document.getElementById('showArchived2024').addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default anchor behavior
  showAccordion('accordion2024', 'showArchived2024');
});

// Ensure only one accordion item is expanded at a time
function handleAccordionToggle(accordionId) {
  const accordion = document.getElementById(accordionId);
  if (!accordion) return;

  const items = accordion.querySelectorAll('.accordion-item');

  items.forEach((item) => {
    const button = item.querySelector('.accordion-button');
    const collapse = item.querySelector('.accordion-collapse');

    button.addEventListener('click', () => {
      // Collapse all other items within the same accordion
      items.forEach((otherItem) => {
        if (otherItem !== item) {
          const otherButton = otherItem.querySelector('.accordion-button');
          const otherCollapse = otherItem.querySelector('.accordion-collapse');
          otherButton.classList.add('collapsed');
          otherButton.setAttribute('aria-expanded', 'false');
          otherCollapse.classList.remove('show');
        }
      });
    });
  });
}

// Apply the toggle handler to all accordions
handleAccordionToggle('accordion2026');
handleAccordionToggle('accordion2025');
handleAccordionToggle('accordion2024');
handleAccordionToggle('accordionRegular');

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the Ride Diary
 * 1. Load rides from JSON and render accordions
 * 2. Re-apply accordion toggle handlers after content is loaded
 * 3. Show the default view (Regular Rides)
 */
async function initRideDiary() {
  // Load and render rides from JSON
  await loadRidesFromJson();

  // Re-apply toggle handlers after dynamic content is loaded
  handleAccordionToggle('accordion2026');
  handleAccordionToggle('accordion2025');
  handleAccordionToggle('accordion2024');
  handleAccordionToggle('accordionRegular');

  // Initial state: Show the Regular Rides accordion
  showAccordion('accordionRegular', 'showRegular');
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initRideDiary);