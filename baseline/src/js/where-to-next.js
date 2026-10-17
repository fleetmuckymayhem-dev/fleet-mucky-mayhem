/**
 * Where To Next: Automatically displays the next upcoming ride from rides.json
 * and starts a live countdown timer.
 *
 * 🟢 Beginner: This script fetches data from a JSON file and updates the page.
 * 🟡 Intermediate: It uses date comparison to find the next upcoming ride.
 */

// Default fallback image when no route map is provided
const FALLBACK_MAP_IMAGE = "img/ride-maps/no-map-provided.png";

/**
 * DOM element references for updating the "Where To Next" section
 * Using getElementById for performance and clarity
 */
const elements = {
  title: document.getElementById("next-title"),
  date: document.getElementById("next-date"),
  startTime: document.getElementById("next-start-time"),
  startPointName: document.getElementById("next-start-point-name"),
  startPointLink: document.getElementById("next-start-point-link"),
  destination: document.getElementById("next-destination"),
  distance: document.getElementById("next-distance"),
  overallTime: document.getElementById("next-overall-time"),
  routeMap: document.getElementById("next-route-map"),
  // Countdown elements
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  min: document.getElementById("min"),
  sec: document.getElementById("sec"),
};

/**
 * Formats an ISO date string (e.g., "2026-02-21") into display format (e.g., "21-Feb-26")
 *
 * @param {string|null} isoDate - The date in ISO format (YYYY-MM-DD)
 * @returns {string} - Formatted date string or "TBD" if no date
 */
function formatDateDisplay(isoDate) {
  if (!isoDate) return "TBD";

  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);

  return `${day}-${month}-${year}`;
}

/**
 * Combines ride date and start time into a JavaScript Date object
 *
 * @param {Object} ride - The ride object from JSON
 * @returns {Date|null} - Combined date/time or null if no date
 */
function getTargetDateTime(ride) {
  if (!ride?.date) return null;

  // Default to 09:30 if no start time specified
  const time = ride.startTime ?? "09:30";

  // Create date string like "2026-02-21T09:30:00"
  return new Date(`${ride.date}T${time}:00`);
}

/**
 * Finds the next upcoming ride from the longerRides array
 * Only considers rides with a date that is in the future
 *
 * @param {Array} longerRides - Array of ride objects from JSON
 * @returns {Object|null} - The next upcoming ride or null
 */
function findNextUpcomingRide(longerRides) {
  const now = new Date();

  // Filter to rides with dates, then find future ones
  const upcomingRides = longerRides
    .filter((ride) => ride.date !== null)
    .map((ride) => ({
      ride,
      dateTime: getTargetDateTime(ride),
    }))
    .filter((item) => item.dateTime && item.dateTime.getTime() >= now.getTime())
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

  // Return the soonest upcoming ride
  if (upcomingRides.length > 0) {
    return upcomingRides[0].ride;
  }

  // No future rides found - return null (will show TBD)
  return null;
}

/**
 * Updates all the "Where To Next" section elements with ride data
 *
 * @param {Object|null} ride - The ride object or null for TBD state
 * @returns {Date|null} - The target date/time for countdown, or null
 */
function updateWhereToNext(ride) {
  if (!ride) {
    // No upcoming ride - show TBD state
    if (elements.title) elements.title.textContent = "TBD";
    if (elements.date) elements.date.textContent = "TBD";
    if (elements.startTime) elements.startTime.textContent = "--";
    if (elements.startPointName)
      elements.startPointName.textContent = "Check WhatsApp";
    if (elements.startPointLink) elements.startPointLink.style.display = "none";
    if (elements.destination) elements.destination.textContent = "--";
    if (elements.distance) elements.distance.textContent = "--";
    if (elements.overallTime) elements.overallTime.textContent = "--";
    if (elements.routeMap) elements.routeMap.src = FALLBACK_MAP_IMAGE;
    return null;
  }

  // Update all fields from ride data
  if (elements.title) {
    elements.title.textContent = ride.title;
  }

  if (elements.date) {
    elements.date.textContent = formatDateDisplay(ride.date);
  }

  if (elements.startTime) {
    elements.startTime.textContent = ride.startTime ?? "--";
  }

  if (elements.startPointName) {
    elements.startPointName.textContent =
      ride.meetPoint?.name ?? "Regular Meet Point";
  }

  if (elements.startPointLink) {
    const mapsUrl = ride.meetPoint?.googleMapsUrl;
    if (mapsUrl) {
      elements.startPointLink.href = mapsUrl;
      elements.startPointLink.style.display = "inline";
    } else {
      elements.startPointLink.style.display = "none";
    }
  }

  if (elements.destination) {
    elements.destination.textContent = ride.destination ?? "--";
  }

  if (elements.distance) {
    elements.distance.textContent = ride.distanceMiles ?? "--";
  }

  if (elements.overallTime) {
    elements.overallTime.textContent = ride.overallTime ?? "--";
  }

  // Update route map image with fallback
  if (elements.routeMap) {
    elements.routeMap.src = ride.routeMapImage ?? FALLBACK_MAP_IMAGE;
    elements.routeMap.alt = `${ride.title} Route Map`;
  }

  return getTargetDateTime(ride);
}

/**
 * Starts a countdown timer that updates every second
 *
 * @param {Date|null} targetDate - The date/time to count down to
 */
function startCountdown(targetDate) {
  // Reset countdown if no target
  if (!targetDate) {
    if (elements.days) elements.days.textContent = "00";
    if (elements.hours) elements.hours.textContent = "00";
    if (elements.min) elements.min.textContent = "00";
    if (elements.sec) elements.sec.textContent = "00";
    return;
  }

  /**
   * Updates the countdown display
   * Called every second by setInterval
   */
  function tick() {
    const now = new Date();
    let diff = targetDate.getTime() - now.getTime();

    // Don't show negative countdown
    if (diff < 0) diff = 0;

    // Calculate time units
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Update display with zero-padding
    if (elements.days) elements.days.textContent = String(days).padStart(2, "0");
    if (elements.hours)
      elements.hours.textContent = String(hours).padStart(2, "0");
    if (elements.min)
      elements.min.textContent = String(minutes).padStart(2, "0");
    if (elements.sec)
      elements.sec.textContent = String(seconds).padStart(2, "0");
  }

  // Initial tick immediately
  tick();

  // Then update every second
  setInterval(tick, 1000);
}

/**
 * Main initialization function
 * Fetches longer-rides.json and sets up the "Where To Next" section
 */
async function initWhereToNext() {
  try {
    // Fetch the rides data from JSON file
    const response = await fetch("data/longer-rides.json");

    if (!response.ok) {
      throw new Error(`Failed to fetch longer-rides.json: ${response.status}`);
    }

    const data = await response.json();

    // Find the next upcoming ride from longerRides array
    const longerRides = Array.isArray(data?.longerRides)
      ? data.longerRides
      : [];
    const nextRide = findNextUpcomingRide(longerRides);

    // Update the UI and get target date for countdown
    const targetDate = updateWhereToNext(nextRide);

    // Start the countdown timer
    startCountdown(targetDate);

    // Log success for debugging
    if (nextRide) {
      console.log(`Where To Next: Showing "${nextRide.title}" on ${nextRide.date}`);
      console.log(`Where To Next: Showing Map: "${elements.routeMap.src}"`);
    } else {
      console.log("Where To Next: No upcoming rides found, showing TBD");
    }
  } catch (error) {
    console.error("Where To Next initialization failed:", error);
    // Show TBD state on error
    updateWhereToNext(null);
    startCountdown(null);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initWhereToNext);
