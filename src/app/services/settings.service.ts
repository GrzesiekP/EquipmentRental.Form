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
  pricePerDay: number;
}

interface EquipmentSettingsApiResponseItem {
  id: string;
  pricePerDay: number;
  deposit: number;
  displayName: string;
}

interface EquipmentSettingsCacheEnvelope {
  cachedAt: number;
  items: EquipmentSetting[];
}

const equipmentSettingsCacheTtlMs = 7 * 24 * 60 * 60 * 1000;

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
      pricePerDay: item.pricePerDay,
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
      const rawValue = localStorage.getItem(this.equipmentSettingsStorageKey);
      if (!rawValue) {
        return [];
      }

      const parsedValue = JSON.parse(rawValue) as unknown;
      if (Array.isArray(parsedValue)) {
        localStorage.removeItem(this.equipmentSettingsStorageKey);
        return [];
      }

      if (!this.isEquipmentSettingsCacheEnvelope(parsedValue)) {
        localStorage.removeItem(this.equipmentSettingsStorageKey);
        return [];
      }

      if (Date.now() - parsedValue.cachedAt > equipmentSettingsCacheTtlMs) {
        localStorage.removeItem(this.equipmentSettingsStorageKey);
        return [];
      }

      return parsedValue.items
        .filter(item => !!item?.id && !!item?.displayName)
        .map(item => ({
          ...item,
          pricePerDay: typeof item.pricePerDay === 'number' ? item.pricePerDay : 0,
        }));
    } catch {
      return [];
    }
  }

  private isEquipmentSettingsCacheEnvelope(
    value: unknown,
  ): value is EquipmentSettingsCacheEnvelope {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const envelope = value as EquipmentSettingsCacheEnvelope;
    return (
      typeof envelope.cachedAt === 'number' &&
      Array.isArray(envelope.items) &&
      !Number.isNaN(envelope.cachedAt)
    );
  }

  private saveEquipmentItemsToStorage(items: EquipmentSetting[]): void {
    const envelope: EquipmentSettingsCacheEnvelope = {
      cachedAt: Date.now(),
      items,
    };
    localStorage.setItem(this.equipmentSettingsStorageKey, JSON.stringify(envelope));
  }
}
