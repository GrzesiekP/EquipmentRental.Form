// ====================================
// Equipment Rental Form - Vue.js Application
// ====================================

// Check if Vue is loaded
if (typeof Vue === 'undefined') {
    console.error('Vue.js failed to load. Please check your internet connection or CDN availability.');
    document.addEventListener('DOMContentLoaded', function() {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = '<div style="padding: 2rem; text-align: center; color: #dc2626;"><h2>Błąd ładowania aplikacji</h2><p>Nie udało się załadować Vue.js. Sprawdź połączenie internetowe.</p></div>';
        }
    });
} else {
    const { createApp } = Vue;

    createApp({
    data() {
        return {
            // Settings from SETTINGS object
            webhookUrl: SETTINGS.webhookUrl,
            equipmentItems: SETTINGS.equipmentItems,
            
            // Form data
            formData: {
                name: '',
                surname: '',
                peselOrdId: '',
                phone: '',
                email: '',
                address: '',
                pickupDate: '',
                pickupHour: '16:00',
                returnDate: '',
                returnHour: '16:00',
                equipment: {}
            },
            
            // UI state
            isLoading: false,
            showSuccessPage: false,
            feedback: {
                message: '',
                type: ''
            }
        };
    },
    
    mounted() {
        // Initialize equipment data
        this.initializeEquipmentData();
        
        // Set default dates
        this.setDefaultDates();
    },
    
    methods: {
        /**
         * Initialize equipment data structure
         */
        initializeEquipmentData() {
            this.equipmentItems.forEach(item => {
                const itemId = this.equipmentNameToId(item);
                this.formData.equipment[itemId] = {
                    name: item,
                    quantity: 0,
                    notes: ''
                };
            });
        },
        
        /**
         * Set default dates (tomorrow and day after tomorrow)
         */
        setDefaultDates() {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const dayAfterTomorrow = new Date();
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
            
            this.formData.pickupDate = this.formatDateInput(tomorrow);
            this.formData.returnDate = this.formatDateInput(dayAfterTomorrow);
        },
        
        /**
         * Convert equipment name to ID format
         */
        equipmentNameToId(name) {
            return name.toLowerCase().replace(/\s+/g, '-');
        },
        
        /**
         * Format date as YYYY-MM-DD
         */
        formatDateInput(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        
        /**
         * Format date as YYYY-MM-DD HH:MM:SS
         */
        formatSubmitDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
        
        /**
         * Format time as HH:MM:SS
         */
        formatTime(timeValue) {
            if (!timeValue) return '00:00:00';
            return `${timeValue}:00`;
        },
        
        /**
         * Increment time by 15 minutes
         */
        incrementTime(field) {
            const timeValue = this.formData[field];
            if (!timeValue) {
                this.formData[field] = '00:00';
                return;
            }
            
            const [hours, minutes] = timeValue.split(':').map(Number);
            let newMinutes = minutes + 15;
            let newHours = hours;
            
            if (newMinutes >= 60) {
                newMinutes = 0;
                newHours = (newHours + 1) % 24;
            }
            
            this.formData[field] = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
        },
        
        /**
         * Decrement time by 15 minutes
         */
        decrementTime(field) {
            const timeValue = this.formData[field];
            if (!timeValue) {
                this.formData[field] = '00:00';
                return;
            }
            
            const [hours, minutes] = timeValue.split(':').map(Number);
            let newMinutes = minutes - 15;
            let newHours = hours;
            
            if (newMinutes < 0) {
                newMinutes = 45;
                newHours = (newHours - 1 + 24) % 24;
            }
            
            this.formData[field] = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
        },
        
        /**
         * Increment equipment quantity
         */
        incrementQuantity(itemId) {
            if (this.formData.equipment[itemId]) {
                this.formData.equipment[itemId].quantity++;
            }
        },
        
        /**
         * Decrement equipment quantity
         */
        decrementQuantity(itemId) {
            if (this.formData.equipment[itemId] && this.formData.equipment[itemId].quantity > 0) {
                this.formData.equipment[itemId].quantity--;
            }
        },
        
        /**
         * Validate form data
         */
        validateForm() {
            // Check required fields
            if (!this.formData.name || this.formData.name === '') {
                return {
                    isValid: false,
                    message: 'Imię jest wymagane'
                };
            }
            
            if (!this.formData.surname || this.formData.surname === '') {
                return {
                    isValid: false,
                    message: 'Nazwisko jest wymagane'
                };
            }
            
            if (!this.formData.peselOrdId || this.formData.peselOrdId === '') {
                return {
                    isValid: false,
                    message: 'PESEL lub ID jest wymagane'
                };
            }
            
            if (!this.formData.phone || this.formData.phone === '') {
                return {
                    isValid: false,
                    message: 'Telefon jest wymagany'
                };
            }
            
            if (!this.formData.email || this.formData.email === '') {
                return {
                    isValid: false,
                    message: 'Email jest wymagany'
                };
            }
            
            if (!this.formData.address || this.formData.address === '') {
                return {
                    isValid: false,
                    message: 'Adres jest wymagany'
                };
            }
            
            if (!this.formData.pickupDate || this.formData.pickupDate === '') {
                return {
                    isValid: false,
                    message: 'Data odbioru jest wymagana'
                };
            }
            
            if (!this.formData.returnDate || this.formData.returnDate === '') {
                return {
                    isValid: false,
                    message: 'Data zwrotu jest wymagana'
                };
            }
            
            // Validate dates are not in the past
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const pickup = new Date(this.formData.pickupDate);
            pickup.setHours(0, 0, 0, 0);
            
            if (pickup < today) {
                return {
                    isValid: false,
                    message: 'Data odbioru nie może być w przeszłości'
                };
            }
            
            const returnD = new Date(this.formData.returnDate);
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
            
            // Validate time fields
            if (!this.formData.pickupHour || this.formData.pickupHour === '00:00') {
                return {
                    isValid: false,
                    message: 'Godzina odbioru jest wymagana'
                };
            }
            
            if (!this.formData.returnHour || this.formData.returnHour === '00:00') {
                return {
                    isValid: false,
                    message: 'Godzina zwrotu jest wymagana'
                };
            }
            
            return {
                isValid: true,
                message: ''
            };
        },
        
        /**
         * Collect form data for submission
         */
        collectFormData() {
            // Collect equipment data
            const equipment = [];
            
            Object.keys(this.formData.equipment).forEach(itemId => {
                const item = this.formData.equipment[itemId];
                const quantity = parseInt(item.quantity, 10) || 0;
                const comments = item.notes.trim();
                
                // Only include items with quantity > 0 OR comments provided
                if (quantity > 0 || comments !== '') {
                    equipment.push({
                        type: item.name,
                        quantity: quantity,
                        comments: comments !== '' ? comments : null
                    });
                }
            });
            
            // Create the data object
            return {
                submitDate: this.formatSubmitDate(new Date()),
                name: this.formData.name.trim(),
                surname: this.formData.surname.trim(),
                peselOrdId: this.formData.peselOrdId.trim(),
                phone: this.formData.phone.trim(),
                email: this.formData.email.trim(),
                address: this.formData.address.trim(),
                pickupDate: this.formData.pickupDate,
                returnDate: this.formData.returnDate,
                pickupHour: this.formatTime(this.formData.pickupHour),
                returnHour: this.formatTime(this.formData.returnHour),
                equipment: equipment
            };
        },
        
        /**
         * Submit data to webhook
         */
        async submitToWebhook(data) {
            try {
                const response = await fetch(this.webhookUrl, {
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
                    status: response.status,
                    data: await response.json().catch(() => ({}))
                };
            } catch (error) {
                console.error('Webhook submission error:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        },
        
        /**
         * Show feedback message
         */
        showFeedback(message, type) {
            this.feedback = {
                message: message,
                type: type
            };
            
            // Scroll to feedback message
            this.$nextTick(() => {
                const feedbackEl = document.getElementById('feedbackMessage');
                if (feedbackEl) {
                    feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        },
        
        /**
         * Hide feedback message
         */
        hideFeedback() {
            this.feedback = {
                message: '',
                type: ''
            };
        },
        
        /**
         * Handle form submission
         */
        async handleFormSubmit() {
            // Hide any existing feedback
            this.hideFeedback();
            
            // Validate the form
            const validation = this.validateForm();
            if (!validation.isValid) {
                this.showFeedback(validation.message, 'error');
                return;
            }
            
            // Collect form data
            const formData = this.collectFormData();
            
            // Set loading state
            this.isLoading = true;
            
            // Submit to webhook
            const result = await this.submitToWebhook(formData);
            
            // Remove loading state
            this.isLoading = false;
            
            // Handle result
            if (result.success && result.status >= 200 && result.status < 300) {
                // Show success page
                this.showSuccessPage = true;
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                this.showFeedback(
                    'Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.',
                    'error'
                );
            }
        }
    }
}).mount('#app');
}
