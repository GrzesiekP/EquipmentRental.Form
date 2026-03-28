import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export enum EquipmentCategory {
  RakiKoszykowe = 0,
  Czekan = 1,
  KijkiTrekkingowe = 2,
  ABCLawinowe = 3,
  LopataLawinowa = 4,
  DetektorLawinowy = 5,
  SondaLawinowa = 6,
  Plecak = 7,
  Kask = 8,
  ZestawViaFerrata = 9,
  LonzaViaFerrata = 10,
  Uprzaz = 11,
  Stuptuty = 12,
  NosidelkoTurystyczneDlaDzieci = 13,
  RaczkiTurystyczne = 14
}

export interface EquipmentSetting {
  displayName: string;
  category: EquipmentCategory | null;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  readonly webhookUrl = environment.webhookUrl;
  readonly apiUrl = environment.apiUrl;

  readonly equipmentItems: EquipmentSetting[] = [
    { displayName: 'Raki Koszykowe', category: EquipmentCategory.RakiKoszykowe },
    { displayName: 'Czekan', category: EquipmentCategory.Czekan },
    { displayName: 'Raki Półautomatyczne', category: null },
    { displayName: 'Kijki Trekkingowe', category: EquipmentCategory.KijkiTrekkingowe },
    { displayName: 'ABC Lawinowe', category: EquipmentCategory.ABCLawinowe },
    { displayName: 'Łopata Lawinowa', category: EquipmentCategory.LopataLawinowa },
    { displayName: 'Detektor Lawinowy', category: EquipmentCategory.DetektorLawinowy },
    { displayName: 'Sonda Lawinowa', category: EquipmentCategory.SondaLawinowa },
    { displayName: 'Zestaw Via Ferrata', category: EquipmentCategory.ZestawViaFerrata },
    { displayName: 'Kask', category: EquipmentCategory.Kask },
    { displayName: 'Lonża Via Ferrata', category: EquipmentCategory.LonzaViaFerrata },
    { displayName: 'Uprząż', category: EquipmentCategory.Uprzaz },
    { displayName: 'Stuptuty', category: EquipmentCategory.Stuptuty },
    { displayName: 'Nosidełko Turystyczne dla Dzieci', category: EquipmentCategory.NosidelkoTurystyczneDlaDzieci },
    { displayName: 'Raczki Turystyczne', category: EquipmentCategory.RaczkiTurystyczne },
    { displayName: 'Plecak', category: EquipmentCategory.Plecak }
  ];
}
