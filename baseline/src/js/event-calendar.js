/**
 * Event Calendar Module
 *
 * 🟢 Beginner: This module handles the event calendar functionality using FullCalendar.
 * It loads events from a JSON file, displays them colour-coded by type, and shows
 * details in a modal when clicked.
 *
 * Key concepts:
 * - Dynamic data loading (fetch API)
 * - Third-party library integration (FullCalendar)
 * - Event handling and DOM manipulation
 * - Bootstrap modal usage
 */

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { bootstrap } from './main.js';

/**
 * Event type to colour mapping
 * 🟢 Beginner: These hex colours match the legend in the HTML
 */
const EVENT_COLOURS = {
  'Social': '#8B5CF6',          // Purple
  'Introductory-Ride': '#10B981', // Green
  'Regular-Ride': '#3B82F6',      // Blue
  'Longer-Ride': '#D4AF37'        // Gold (brand colour)
};

/**
 * Event type to detail file mapping
 * 🟢 Beginner: Each event type has its own JSON file with full details
 */
const EVENT_FILES = {
  'Social': 'data/social-events.json',
  'Introductory-Ride': 'data/introductory-rides.json',
  'Regular-Ride': 'data/regular-rides.json',
  'Longer-Ride': 'data/longer-rides.json'
};

/** @type {Calendar | null} */
let calendarInstance = null;

/** @type {Array} */
let allEvents = [];

/**
 * Format guidance for display - handles both string and array formats
 *
 * 🟢 Beginner: Guidance can be stored as string or array for cleaner data,
 * but displayed consistently
 */
function formatGuidance(guidance) {
  if (!guidance) {
    return '';
  }
  
  // If guidance is an array, join with line breaks for calendar display
  if (Array.isArray(guidance)) {
    return guidance.join('\n');
  }
  
  // If guidance is a string, use it as-is
  return guidance;
}

/**
 * Transforms events.json data into FullCalendar event format
 *
 * 🟡 Intermediate: This function handles two types of events:
 * - Single-occurrence events (with a specific date)
 * - Recurring events (with daysOfWeek for weekly repetition)
 *
 * @param {Array} events - Raw events from events.json
 * @returns {Array} Events formatted for FullCalendar
 */
function transformEvents(events) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events.map(event => {
    const baseEvent = {
      id: event.id,
      title: event.title,
      backgroundColor: EVENT_COLOURS[event.eventType],
      borderColor: EVENT_COLOURS[event.eventType],
      extendedProps: {
        eventType: event.eventType,
        location: event.location
      }
    };

    // Recurring event (Regular Rides)
    // 🟢 Beginner: FullCalendar uses daysOfWeek to create repeating events
    if (event.daysOfWeek) {
      return {
        ...baseEvent,
        daysOfWeek: event.daysOfWeek,
        startTime: event.startTime,
        startRecur: event.startRecur,
        endRecur: event.endRecur,
        duration: event.duration
      };
    }

    // Single occurrence event
    const eventDate = new Date(event.date);
    const isPast = eventDate < today;

    return {
      ...baseEvent,
      start: `${event.date}T${event.startTime}`,
      classNames: isPast ? ['past-event'] : []
    };
  });
}

/**
 * Fetches full event details from type-specific file
 *
 * 🟢 Beginner: On-demand loading means we only fetch the detailed info
 * when the user actually clicks on an event.
 *
 * @param {string} eventId - The unique ID of the event
 * @param {string} eventType - The type of event (Social, Regular-Ride, etc.)
 * @returns {Promise<Object|undefined>} The full event details or undefined
 */
async function fetchEventDetails(eventId, eventType) {
  const file = EVENT_FILES[eventType];
  const response = await fetch(file);
  const data = await response.json();

  // Handle longer-rides.json structure (has longerRides + archivedRides arrays)
  // 🟢 Beginner: Different JSON files may have different array names
  let events = data.events || data.longerRides || [];
  
  // Include archived rides for longer-rides.json
  if (data.archivedRides) {
    events = [...events, ...data.archivedRides];
  }
  
  return events.find(e => e.id === eventId);
}

/**
 * Formats a time string for display
 *
 * @param {string} timeStr - Time in HH:MM format
 * @returns {string} Formatted time string
 */
function formatTime(timeStr) {
  if (!timeStr) return '';
  return timeStr;
}

/**
 * Renders modal content based on event type
 *
 * 🟡 Intermediate: Different event types have different fields,
 * so we conditionally render content based on what data is available.
 *
 * @param {Object} event - FullCalendar event object
 * @param {Object|null} details - Full event details from type-specific file
 * @returns {string} HTML content for the modal
 */
function renderModalContent(event, details) {
  const eventType = event.extendedProps.eventType;

  // Event type badge
  let content = `
    <p class="text-muted mb-2">${eventType.replace(/-/g, ' ')}</p>
    <h4>${event.title}</h4>
  `;

  if (details) {
    // Meeting point (all event types have this)
    if (details.meetPoint) {
      content += `
        <p>
          <strong>Meet:</strong>
          <a href="${details.meetPoint.googleMapsUrl}" target="_blank" rel="noopener">
            ${details.meetPoint.name}
          </a>
          ${details.meetPoint.note ? `<br><small class="text-muted">${details.meetPoint.note}</small>` : ''}
        </p>
      `;
    }

    // Start time
    const timeDisplay = details.startTime || formatTime(event.startStr?.slice(11, 16));
    if (timeDisplay) {
      content += `<p><strong>Time:</strong> ${timeDisplay}</p>`;
    }

    // Duration (Social, Regular rides)
    if (details.duration) {
      content += `<p><strong>Duration:</strong> ${details.duration}</p>`;
    }

    // Longer Ride specific fields
    // 🟢 Beginner: Only show these fields for longer rides
    if (eventType === 'Longer-Ride') {
      if (details.destination) {
        content += `<p><strong>Destination:</strong> ${details.destination}</p>`;
      }
      if (details.distanceMiles) {
        content += `<p><strong>Distance:</strong> ${details.distanceMiles} miles</p>`;
      }
      if (details.overallTime) {
        content += `<p><strong>Estimated time:</strong> ${details.overallTime}</p>`;
      }
      if (details.routeMapImage) {
        content += `
          <img src="${details.routeMapImage}" alt="Route map" class="img-fluid mt-2 mb-2 rounded">
        `;
      }
    }

    // Guidance/info (all event types can have this)
    if (details.guidance) {
      content += `<p><strong>Info:</strong> ${formatGuidance(details.guidance)}</p>`;
    }
  } else {
    // Fallback if details couldn't be loaded
    content += `
      <p><strong>Location:</strong> ${event.extendedProps.location || 'TBC'}</p>
      <p class="text-muted"><small>Full details not available</small></p>
    `;
  }

  return content;
}

/**
 * Stores current event data for iCal export
 * @type {Object|null}
 */
let currentEventData = null;

/**
 * Handles event click - fetches details and shows modal
 *
 * 🟡 Intermediate: This is an async function because we need to
 * fetch data from the server before showing the modal content.
 *
 * @param {Object} info - FullCalendar event click info object
 */
async function handleEventClick(info) {
  const eventId = info.event.id;
  const eventType = info.event.extendedProps.eventType;

  const modalBody = document.getElementById('eventModalBody');
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');

  // Show loading state
  modalBody.innerHTML = '<p class="text-center"><span class="spinner-border spinner-border-sm me-2"></span>Loading...</p>';

  // Show the modal immediately (better UX)
  const modal = new bootstrap.Modal(document.getElementById('eventModal'));
  modal.show();

  try {
    const details = await fetchEventDetails(eventId, eventType);
    modalBody.innerHTML = renderModalContent(info.event, details);

    // Store data for iCal export
    currentEventData = {
      event: info.event,
      details: details
    };

    // 🟢 Beginner: Only show "Add to Calendar" for future events
    // Past events don't need to be added to calendars
    if (addToCalendarBtn) {
      const eventDate = info.event.start;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isPastEvent = eventDate < today;
      
      addToCalendarBtn.style.display = isPastEvent ? 'none' : 'inline-block';
    }
  } catch (error) {
    console.error('Error fetching event details:', error);
    modalBody.innerHTML = renderModalContent(info.event, null);
    currentEventData = null;

    // Disable add to calendar on error
    if (addToCalendarBtn) {
      addToCalendarBtn.style.display = 'none';
    }
  }
}

/**
 * Generates an iCal (.ics) file for the current event
 *
 * 🟡 Intermediate: iCal is a standard format for calendar events.
 * This creates a downloadable file that can be imported into any calendar app.
 */
function generateICalFile() {
  if (!currentEventData) return;

  const { event, details } = currentEventData;

  // Parse the event date and time
  const startDate = event.start;
  const eventType = event.extendedProps.eventType;

  // Format date for iCal (YYYYMMDDTHHmmss)
  // 🟢 Beginner: iCal uses a specific date format without dashes or colons
  const formatICalDate = (date) => {
    const d = new Date(date);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  };

  // Calculate end time (default 2 hours if not specified)
  let endDate = new Date(startDate);
  if (details?.duration) {
    // Parse duration like "2-3 hours" or "03:00"
    const durationMatch = details.duration.match(/(\d+)/);
    if (durationMatch) {
      endDate.setHours(endDate.getHours() + parseInt(durationMatch[1]));
    }
  } else {
    endDate.setHours(endDate.getHours() + 2);
  }

  // Build location string
  const location = details?.meetPoint?.name || event.extendedProps.location || '';

  // Build description
  let description = '';
  if (details?.guidance) {
    description = formatGuidance(details.guidance);
  }
  if (eventType === 'Longer-Ride' && details) {
    if (details.destination) {
      description += `\\nDestination: ${details.destination}`;
    }
    if (details.distanceMiles) {
      description += `\\nDistance: ${details.distanceMiles} miles`;
    }
  }

  // Generate unique ID
  const uid = `${event.id}@fleetmuckymayhem.co.uk`;

  // Build iCal content
  // 🟢 Beginner: This is the iCal file format specification
  const icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fleet Mucky Mayhem//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatICalDate(new Date())}`,
    `DTSTART:${formatICalDate(startDate)}`,
    `DTEND:${formatICalDate(endDate)}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  // Create and download file
  // 🟢 Beginner: This creates a "virtual" file and triggers a download
  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${event.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Sets up event type filter functionality
 *
 * 🟡 Intermediate: Filters work by maintaining all events in memory
 * and re-rendering only the visible ones based on checkbox state.
 */
function setupFilters() {
  const checkboxes = document.querySelectorAll('.filter-checkbox');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      applyFilters();
    });
  });
}

/**
 * Applies current filter state to the calendar
 */
function applyFilters() {
  if (!calendarInstance) return;

  // Get all checked event types
  const checkedTypes = Array.from(document.querySelectorAll('.filter-checkbox:checked'))
    .map(cb => cb.dataset.eventType);

  // Filter events based on checked types
  const filteredEvents = allEvents.filter(event => {
    return checkedTypes.includes(event.extendedProps.eventType);
  });

  // Remove all events and add filtered ones
  calendarInstance.removeAllEvents();
  filteredEvents.forEach(event => {
    calendarInstance.addEvent(event);
  });
}

/**
 * Initialises the calendar
 *
 * 🟢 Beginner: This is the main entry point - it runs when the page loads.
 * It fetches the events data and creates the FullCalendar instance.
 */
async function initCalendar() {
  const calendarEl = document.getElementById('calendar-mount');
  if (!calendarEl) return;

  try {
    // Fetch events index
    const response = await fetch('data/events.json');
    const data = await response.json();

    // Transform and store all events
    allEvents = transformEvents(data.events);

    // Create the calendar instance
    // 🟢 Beginner: This is where we configure FullCalendar with our settings
    calendarInstance = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, multiMonthPlugin],
      initialView: 'dayGridMonth',
      locale: 'en-GB',
      firstDay: 1, // Monday start (0 = Sunday, 1 = Monday)
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,multiMonthYear'
      },
      buttonText: {
        today: 'Today',
        month: 'Month',
        year: 'Year'
      },
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24-hour format
      },
      events: allEvents,
      eventClick: handleEventClick,
      eventDisplay: 'block',
      dayMaxEvents: 3, // Show "+X more" when too many events
      moreLinkClick: 'popover' // Show events in a popover when clicking "+X more"
    });

    calendarInstance.render();

    // Setup filter functionality
    setupFilters();

    // Setup "Add to Calendar" button
    const addToCalendarBtn = document.getElementById('addToCalendarBtn');
    if (addToCalendarBtn) {
      addToCalendarBtn.addEventListener('click', generateICalFile);
    }

    console.log('Event calendar initialised successfully');
  } catch (error) {
    console.error('Error initialising calendar:', error);
    calendarEl.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <strong>Error:</strong> Could not load the event calendar. Please try refreshing the page.
      </div>
    `;
  }
}

// Initialise on DOM ready
// 🟢 Beginner: DOMContentLoaded fires when the HTML is fully parsed
document.addEventListener('DOMContentLoaded', initCalendar);
