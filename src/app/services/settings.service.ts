import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  readonly webhookUrl = 'https://tantunergon8n.duckdns.org/webhook/submit-reservation';
  
  readonly equipmentItems = [
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

  equipmentNameToId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}
