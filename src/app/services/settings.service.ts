import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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
  RaczkiTurystyczne = 14,
  RakiPolautomatyczne = 15
}

export interface EquipmentSetting {
  id: string;
  displayName: string;
  category: EquipmentCategory | null;
}

interface EquipmentSettingsApiResponseItem {
  id: string;
  pricePerDay: number;
  deposit: number;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly equipmentSettingsStorageKey = 'equipmentSettings';
  private equipmentItemsCache: EquipmentSetting[] | null = null;

  readonly webhookUrl = environment.webhookUrl;
  readonly apiUrl = environment.apiUrl;

  get equipmentItems(): EquipmentSetting[] {
    return this.equipmentItemsCache ?? [];
  }

  loadEquipmentItems(): Observable<EquipmentSetting[]> {
    if (this.equipmentItemsCache) {
      return of(this.equipmentItemsCache);
    }

    const cachedItems = this.readEquipmentItemsFromStorage();
    if (cachedItems.length > 0) {
      this.equipmentItemsCache = cachedItems;
      return of(cachedItems);
    }

    return this.http.get<EquipmentSettingsApiResponseItem[]>(environment.equipmentConfigUrl).pipe(
      map(items => items.map(item => this.mapApiItemToEquipmentSetting(item))),
      tap(items => {
        this.equipmentItemsCache = items;
        this.saveEquipmentItemsToStorage(items);
      })
    );
  }

  private mapApiItemToEquipmentSetting(item: EquipmentSettingsApiResponseItem): EquipmentSetting {
    return {
      id: item.id,
      displayName: item.displayName,
      category: this.mapCategory(item.displayName),
    };
  }

  private mapCategory(displayName: string): EquipmentCategory | null {
    const categoryMapping: Record<string, EquipmentCategory | null> = {
      'Raki Koszykowe': EquipmentCategory.RakiKoszykowe,
      'Czekan': EquipmentCategory.Czekan,
      'Raki Półautomatyczne': EquipmentCategory.RakiPolautomatyczne,
      'Kijki Trekkingowe': EquipmentCategory.KijkiTrekkingowe,
      'ABC Lawinowe': EquipmentCategory.ABCLawinowe,
      'Łopata Lawinowa': EquipmentCategory.LopataLawinowa,
      'Detektor Lawinowy': EquipmentCategory.DetektorLawinowy,
      'Sonda Lawinowa': EquipmentCategory.SondaLawinowa,
      'Zestaw Via Ferrata': EquipmentCategory.ZestawViaFerrata,
      'Kask': EquipmentCategory.Kask,
      'Lonża Via Ferrata': EquipmentCategory.LonzaViaFerrata,
      'Uprząż': EquipmentCategory.Uprzaz,
      'Stuptuty': EquipmentCategory.Stuptuty,
      'Nosidełko Turystyczne dla Dzieci': EquipmentCategory.NosidelkoTurystyczneDlaDzieci,
      'Raczki Turystyczne': EquipmentCategory.RaczkiTurystyczne,
      'Plecak': EquipmentCategory.Plecak,
    };

    return categoryMapping[displayName] ?? null;
  }

  private readEquipmentItemsFromStorage(): EquipmentSetting[] {
    try {
      const rawValue = sessionStorage.getItem(this.equipmentSettingsStorageKey);
      if (!rawValue) {
        return [];
      }

      const parsedValue = JSON.parse(rawValue) as EquipmentSetting[];
      if (!Array.isArray(parsedValue)) {
        return [];
      }

      return parsedValue.filter(item => !!item?.id && !!item?.displayName);
    } catch {
      return [];
    }
  }

  private saveEquipmentItemsToStorage(items: EquipmentSetting[]): void {
    sessionStorage.setItem(this.equipmentSettingsStorageKey, JSON.stringify(items));
  }
}
