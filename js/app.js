// ====================================
// Equipment Rental Form - JavaScript
// ====================================

// Constants
const WEBHOOK_URL = 'https://tantunergon8n.duckdns.org/webhook-test/d3f86dbd-05be-45c2-ba6d-e73c2ee4e244';
const EQUIPMENT_ITEMS = [
    'Raki Koszykowe',
    'Czekan',
    'Raki Półautomatyczne',
    'Kijki Trekkingowe',
    'ABC Lawinowe',
    'Łopata Lawinowa',
    'Detektor Lawinowy',
    'Sonda Lawinowa',
    'Zestaw Via Ferrata',
    'Kask',
    'Lonża Via Ferrata',
    'Uprząż',
    'Stuptuty',
    'Nosidełko Turystyczne dla Dzieci',
    'Raczki Turystyczne',
    'Plecak'
];

// DOM Element References
let form;
let submitBtn;
let feedbackMessage;

/**
 * Initialize the application
 * Sets up event listeners and DOM references
 */
function init() {
    // Get DOM references
    form = document.getElementById('equipmentForm');
    submitBtn = document.getElementById('submitBtn');
    feedbackMessage = document.getElementById('feedbackMessage');

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
    
    EQUIPMENT_ITEMS.forEach(item => {
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
    
    // CRITICAL: Validate dates BEFORE time validation
    // This ensures users see date errors even if times aren't filled
    if (data.pickupDate && data.returnDate) {
        const pickup = new Date(data.pickupDate);
        const returnD = new Date(data.returnDate);
        console.log('🔍 DEBUG: Date validation - Pickup:', pickup, 'Return:', returnD);
        console.log('🔍 DEBUG: Is return < pickup?', returnD < pickup);
        
        if (returnD < pickup) {
            console.log('🔍 DEBUG: Date validation FAILED - returning error');
            return {
                isValid: false,
                message: 'Data zwrotu musi być równa lub późniejsza od daty odbioru'
            };
        }
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
        const response = await fetch(WEBHOOK_URL, {
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
    console.log('🔍 DEBUG: handleFormSubmit called');

    // Hide any existing feedback
    hideFeedback();

    // Collect form data
    const formData = collectFormData();
    console.log('🔍 DEBUG: Form data collected:', formData);

    // Validate the data
    const validation = validateForm(formData);
    console.log('🔍 DEBUG: Validation result:', validation);
    if (!validation.isValid) {
        console.log('🔍 DEBUG: Validation failed, showing error:', validation.message);
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