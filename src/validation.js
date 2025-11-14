/**
 * Validate form data
 * @param {Object} data - The form data to validate
 * @returns {Object} Validation result with isValid boolean and error message
 */
export function validateForm(data) {
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
