// --- DOM Element References (DRY and Centralized) ---
const daysItem = document.querySelector("#days");
const hoursItem = document.querySelector("#hours");
const minItem = document.querySelector("#min");
const secItem = document.querySelector("#sec");

// --- Countdown Logic ---
let countdownInterval; // To store the interval ID for clearing

/**
 * Updates the display with the given time values.
 * Ensures single responsibility: displaying.
 * @param {number} days
 * @param {number} hours
 * @param {number} minutes
 * @param {number} seconds
 */
const updateCountdownDisplay = (days, hours, minutes, seconds) => {
    // Pad numbers with leading zeros if less than 10 for consistent formatting
    daysItem.innerHTML = String(days).padStart(2, '0');
    hoursItem.innerHTML = String(hours).padStart(2, '0');
    minItem.innerHTML = String(minutes).padStart(2, '0');
    secItem.innerHTML = String(seconds).padStart(2, '0');
};

/**
 * Calculates the remaining time and updates the countdown display.
 * Stops the countdown when the target date is reached.
 */
const calculateAndDisplayCountdown = () => {
    const futureDate = new Date("2026-02-21T09:30:00");
    const currentDate = new Date();
    let timeLeft = futureDate.getTime() - currentDate.getTime(); // Use getTime() for milliseconds


    // If countdown is finished or already passed
    if (timeLeft <= 0) {
        clearInterval(countdownInterval); // Stop the interval
        updateCountdownDisplay(0, 0, 0, 0); // Set all to zero
        // console.log("Countdown finished!");
        return; // Exit the function
    }

    // Calculate time components
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Update the display
    updateCountdownDisplay(days, hours, minutes, seconds);
};

// --- Dark Mode Switch Logic (kept separate as it's a distinct concern) ---
document.addEventListener('DOMContentLoaded', (event) => {
    const htmlElement = document.documentElement;
    const switchElement = document.getElementById('darkModeSwitch');

    // Set the default theme to dark if no setting is found in local storage
    const currentTheme = localStorage.getItem('bsTheme') || 'dark';
    htmlElement.setAttribute('data-bs-theme', currentTheme);
    // Ensure the switch reflects the loaded theme state
    if (switchElement) { // Add a check if switchElement exists
        switchElement.checked = currentTheme === 'dark';
    }


    if (switchElement) { // Only add listener if the switch exists
        switchElement.addEventListener('change', function () {
            if (this.checked) {
                htmlElement.setAttribute('data-bs-theme', 'dark');
                localStorage.setItem('bsTheme', 'dark');
            } else {
                htmlElement.setAttribute('data-bs-theme', 'light');
                localStorage.setItem('bsTheme', 'light');
            }
        });
    }

    // Initialize and start the countdown when the DOM is ready
    calculateAndDisplayCountdown(); // Call once immediately to avoid initial flicker
    countdownInterval = setInterval(calculateAndDisplayCountdown, 1000); // Start the interval
});