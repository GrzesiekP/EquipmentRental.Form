// ====================================
// Equipment Rental Form - Settings
// ====================================

/**
 * Interface for application settings
 */
interface Settings {
    webhookUrl: string;
    equipmentItems: string[];
}

/**
 * Application configuration
 */
const SETTINGS: Settings = {
    webhookUrl: 'https://tantunergon8n.duckdns.org/webhook/submit-reservation',
    equipmentItems: [
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
    ]
};
