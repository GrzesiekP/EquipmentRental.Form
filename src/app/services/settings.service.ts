import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  readonly webhookUrl = environment.webhookUrl;
  
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
