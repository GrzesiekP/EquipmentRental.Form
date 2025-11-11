// ====================================
// Equipment Rental Form - JavaScript
// ====================================

// Settings are loaded from js/settings.js
// Ensure SETTINGS object is available before using
if (typeof SETTINGS === 'undefined') {
    throw new Error('SETTINGS object is not defined. Make sure js/settings.js is loaded before app.js');
}

// DOM Element References
let form;
let submitBtn;
let feedbackMessage;

/**
 * Generate equipment rows dynamically
 */
function generateEquipmentRows() {
    const equipmentTable = document.getElementById('equipmentTable');
    if (!equipmentTable) return;

    SETTINGS.equipmentItems.forEach(item => {
        const itemId = equipmentNameToId(item);
        const row = document.createElement('div');
        row.className = 'equipment-row';
        row.setAttribute('data-equipment', item);
        row.setAttribute('role', 'row');

        row.innerHTML = `
            <div class="col-equipment" role="cell">${item}</div>
            <div class="col-quantity" role="cell">
                <label for="quantity-${itemId}" class="sr-only">Ilość - ${item}</label>
                <input
                    type="number"
                    id="quantity-${itemId}"
                    name="quantity-${itemId}"
                    min="0"
                    step="1"
                    value="0"
                    aria-label="Ilość - ${item}">
            </div>
            <div class="col-notes" role="cell">
                <label for="notes-${itemId}" class="sr-only">Uwagi - ${item}</label>
                <input
                    type="text"
                    id="notes-${itemId}"
                    name="notes-${itemId}"
                    aria-label="Uwagi - ${item}">
            </div>
        `;

        equipmentTable.appendChild(row);
    });
}

/**
 * Initialize the application
 * Sets up event listeners and DOM references
 */
function init() {
    // Get DOM references
    form = document.getElementById('equipmentForm');
    submitBtn = document.getElementById('submitBtn');
    feedbackMessage = document.getElementById('feedbackMessage');

    // Generate equipment rows dynamically
    generateEquipmentRows();

    // Set default values for date and time fields
    setDefaultValues();

    // Set up event listeners
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

/**
 * Format date as YYYY-MM-DD HH:MM:SS
 * @param {Date} date - The date object to format
 * @returns {string} Formatted date string
 */
function formatSubmitDate(date) {
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
function formatTime(timeValue) {
    if (!timeValue) return '00:00:00';
    return `${timeValue}:00`;
}

/**
 * Format date as YYYY-MM-DD for date input fields
 * @param {Date} date - The date object to format
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
function formatDateInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Set default values for date and time fields
 */
function setDefaultValues() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const pickupDateInput = document.getElementById('pickupDate');
    const pickupHourInput = document.getElementById('pickupHour');
    const returnDateInput = document.getElementById('returnDate');
    const returnHourInput = document.getElementById('returnHour');
    
    if (pickupDateInput && !pickupDateInput.value) {
        pickupDateInput.value = formatDateInput(tomorrow);
    }
    
    if (pickupHourInput && !pickupHourInput.value) {
        pickupHourInput.value = '16:00';
    }
    
    if (returnDateInput && !returnDateInput.value) {
        returnDateInput.value = formatDateInput(dayAfterTomorrow);
    }
    
    if (returnHourInput && !returnHourInput.value) {
        returnHourInput.value = '16:00';
    }
}

/**
 * Convert equipment name to ID format for input fields
 * @param {string} name - Equipment name
 * @returns {string} ID-friendly format
 */
function equipmentNameToId(name) {
    return name.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Collect all form data and structure it as JSON
 * @returns {Object} Formatted data object ready for submission
 */
function collectFormData() {
    // Get personal information with null checks
    const name = document.getElementById('name')?.value?.trim() || '';
    const surname = document.getElementById('surname')?.value?.trim() || '';
    const peselOrdId = document.getElementById('peselOrdId')?.value?.trim() || '';
    const phone = document.getElementById('phone')?.value?.trim() || '';
    const email = document.getElementById('email')?.value?.trim() || '';
    const address = document.getElementById('address')?.value?.trim() || '';
    
    // Get rental dates and times with null checks
    const pickupDate = document.getElementById('pickupDate')?.value || '';
    const returnDate = document.getElementById('returnDate')?.value || '';
    const pickupHour = formatTime(document.getElementById('pickupHour')?.value || '');
    const returnHour = formatTime(document.getElementById('returnHour')?.value || '');

    // Collect equipment data
    const equipment = [];
    
    SETTINGS.equipmentItems.forEach(item => {
        const itemId = equipmentNameToId(item);
        const quantityInput = document.getElementById(`quantity-${itemId}`);
        const notesInput = document.getElementById(`notes-${itemId}`);
        
        // Skip if elements don't exist
        if (!quantityInput || !notesInput) return;
        
        const quantity = parseInt(quantityInput.value, 10) || 0;
        const comments = notesInput.value.trim();

        // Only include items with quantity > 0 OR comments provided
        if (quantity > 0 || comments !== '') {
            equipment.push({
                type: item,
                quantity: quantity,
                comments: comments !== '' ? comments : null
            });
        }
    });

    // Create the data object with formatted timestamp
    const data = {
        submitDate: formatSubmitDate(new Date()),
        name: name,
        surname: surname,
        peselOrdId: peselOrdId,
        phone: phone,
        email: email,
        address: address,
        pickupDate: pickupDate,
        returnDate: returnDate,
        pickupHour: pickupHour,
        returnHour: returnHour,
        equipment: equipment
    };

    return data;
}

/**
 * Validate form data
 * @param {Object} data - The form data to validate
 * @returns {Object} Validation result with isValid boolean and error message
 */
function validateForm(data) {
    // Check required fields
    if (!data.name || data.name === '') {
        return {
            isValid: false,
            message: 'Imię jest wymagane'
        };
    }

    if (!data.surname || data.surname === '') {
        return {
            isValid: false,
            message: 'Nazwisko jest wymagane'
        };
    }
    
    if (!data.peselOrdId || data.peselOrdId === '') {
        return {
            isValid: false,
            message: 'PESEL lub ID jest wymagane'
        };
    }
    
    if (!data.phone || data.phone === '') {
        return {
            isValid: false,
            message: 'Telefon jest wymagany'
        };
    }
    
    if (!data.email || data.email === '') {
        return {
            isValid: false,
            message: 'Email jest wymagany'
        };
    }
    
    if (!data.address || data.address === '') {
        return {
            isValid: false,
            message: 'Adres jest wymagany'
        };
    }
    
    if (!data.pickupDate || data.pickupDate === '') {
        return {
            isValid: false,
            message: 'Data odbioru jest wymagana'
        };
    }
    
    if (!data.returnDate || data.returnDate === '') {
        return {
            isValid: false,
            message: 'Data zwrotu jest wymagana'
        };
    }
    
    // Validate dates are not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const pickup = new Date(data.pickupDate);
    pickup.setHours(0, 0, 0, 0);
    
    if (pickup < today) {
        return {
            isValid: false,
            message: 'Data odbioru nie może być w przeszłości'
        };
    }
    
    const returnD = new Date(data.returnDate);
    returnD.setHours(0, 0, 0, 0);
    
    if (returnD < today) {
        return {
            isValid: false,
            message: 'Data zwrotu nie może być w przeszłości'
        };
    }
    
    // Validate return date is not before pickup date
    if (returnD < pickup) {
        return {
            isValid: false,
            message: 'Data zwrotu musi być równa lub późniejsza od daty odbioru'
        };
    }
    
    // Validate time fields AFTER date validation
    if (!data.pickupHour || data.pickupHour === '00:00:00') {
        return {
            isValid: false,
            message: 'Godzina odbioru jest wymagana'
        };
    }
    
    if (!data.returnHour || data.returnHour === '00:00:00') {
        return {
            isValid: false,
            message: 'Godzina zwrotu jest wymagana'
        };
    }

    return {
        isValid: true,
        message: ''
    };
}

/**
 * Display feedback message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of message ('success' or 'error')
 */
function showFeedback(message, type) {
    if (!feedbackMessage) return;

    // Set the message text
    feedbackMessage.textContent = message;

    // Remove existing classes
    feedbackMessage.classList.remove('hidden', 'success', 'error');

    // Add appropriate class based on type
    if (type === 'success') {
        feedbackMessage.classList.add('success');
    } else if (type === 'error') {
        feedbackMessage.classList.add('error');
    }

    // Scroll to feedback message for visibility
    feedbackMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Hide the feedback message
 */
function hideFeedback() {
    if (feedbackMessage) {
        feedbackMessage.classList.add('hidden');
        feedbackMessage.classList.remove('success', 'error');
    }
}

/**
 * Set loading state on the submit button
 * @param {boolean} isLoading - Whether the form is in loading state
 */
function setLoadingState(isLoading) {
    if (!submitBtn) return;

    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Wysyłanie...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Wyślij';
    }
}

/**
 * Submit data to the webhook endpoint
 * @param {Object} data - The data to submit
 * @returns {Promise} Promise that resolves with the response
 */
async function submitToWebhook(data) {
    try {
        const response = await fetch(SETTINGS.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return {
            success: true,
            data: await response.json().catch(() => ({}))
        };
    } catch (error) {
        console.error('Webhook submission error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Reset the form to its initial state
 */
function resetForm() {
    if (form) {
        form.reset();
        
        // Return focus to the first input
        const firstInput = document.getElementById('name');
        if (firstInput) {
            firstInput.focus();
        }
    }
}

/**
 * Handle form submission
 * @param {Event} event - The submit event
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    // Hide any existing feedback
    hideFeedback();

    // Collect form data
    const formData = collectFormData();

    // Validate the data
    const validation = validateForm(formData);
    if (!validation.isValid) {
        showFeedback(validation.message, 'error');
        return;
    }

    // Set loading state
    setLoadingState(true);

    // Submit to webhook
    const result = await submitToWebhook(formData);

    // Remove loading state
    setLoadingState(false);

    // Handle result
    if (result.success) {
        showFeedback('Formularz został wysłany pomyślnie!', 'success');
        
        // Reset form after successful submission
        setTimeout(() => {
            resetForm();
            hideFeedback();
        }, 3000);
    } else {
        showFeedback(
            'Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.',
            'error'
        );
    }
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}