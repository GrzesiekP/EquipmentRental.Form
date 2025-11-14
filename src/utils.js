/**
 * Format date as YYYY-MM-DD HH:MM:SS
 * @param {Date} date - The date object to format
 * @returns {string} Formatted date string
 */
export function formatSubmitDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Format time input value as HH:MM:SS
 * @param {string} timeValue - Time value from input field (HH:MM)
 * @returns {string} Formatted time string (HH:MM:SS)
 */
export function formatTime(timeValue) {
    if (!timeValue) return '00:00:00';
    return `${timeValue}:00`;
}

/**
 * Format date as YYYY-MM-DD for date input fields
 * @param {Date} date - The date object to format
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
export function formatDateInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Convert equipment name to ID format for input fields
 * @param {string} name - Equipment name
 * @returns {string} ID-friendly format
 */
export function equipmentNameToId(name) {
    return name.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Increment time input by 15 minutes
 * @param {string} timeValue - Current time value (HH:MM)
 * @returns {string} New time value
 */
export function incrementTime(timeValue) {
    if (!timeValue) return '00:00';
    
    const [hours, minutes] = timeValue.split(':').map(Number);
    let newMinutes = minutes + 15;
    let newHours = hours;

    if (newMinutes >= 60) {
        newMinutes = 0;
        newHours = (newHours + 1) % 24;
    }

    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

/**
 * Decrement time input by 15 minutes
 * @param {string} timeValue - Current time value (HH:MM)
 * @returns {string} New time value
 */
export function decrementTime(timeValue) {
    if (!timeValue) return '00:00';
    
    const [hours, minutes] = timeValue.split(':').map(Number);
    let newMinutes = minutes - 15;
    let newHours = hours;

    if (newMinutes < 0) {
        newMinutes = 45;
        newHours = (newHours - 1 + 24) % 24;
    }

    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}
