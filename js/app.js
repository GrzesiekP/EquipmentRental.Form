// ====================================
// Equipment Rental Form - JavaScript
// ====================================

// Constants
const WEBHOOK_URL = 'https://tantunergon8n.duckdns.org/webhook-test/d3f86dbd-05be-45c2-ba6d-e73c2ee4e244';
const EQUIPMENT_ITEMS = ['Raki', 'Kask', 'Czekan'];

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
 * Collect all form data and structure it as JSON
 * @returns {Object} Formatted data object ready for submission
 */
function collectFormData() {
    // Get personal information
    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();

    // Collect equipment data
    const equipment = [];
    
    EQUIPMENT_ITEMS.forEach(item => {
        const itemLower = item.toLowerCase();
        const quantityInput = document.getElementById(`quantity-${itemLower}`);
        const notesInput = document.getElementById(`notes-${itemLower}`);
        
        const quantity = parseInt(quantityInput.value, 10) || 0;
        const notes = notesInput.value.trim();

        // Only include items with quantity > 0 OR notes provided
        if (quantity > 0 || notes !== '') {
            equipment.push({
                item: item,
                quantity: quantity,
                notes: notes
            });
        }
    });

    // Create the data object with ISO 8601 timestamp
    const data = {
        name: name,
        surname: surname,
        equipment: equipment,
        timestamp: new Date().toISOString()
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