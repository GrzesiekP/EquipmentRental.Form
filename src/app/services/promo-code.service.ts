import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PromoCodeDetails } from '../models/promo-code.model';
import { mapPromoCodeDetails } from './price/promo-code.mapper';
import { SettingsService } from './settings.service';

interface PromoCodeCacheEntry {
  cachedAt: number;
  details: PromoCodeDetails;
}

interface PromoCodeCacheStore {
  entries: Record<string, PromoCodeCacheEntry>;
}

const promoCodeCacheTtlMs = 60 * 60 * 1000;

@Injectable({
  providedIn: 'root',
})
export class PromoCodeService {
  private readonly http = inject(HttpClient);
  private readonly settings = inject(SettingsService);
  private readonly storageKey = 'promoCodeCache';

  resolvePromoCode(code: string): Observable<PromoCodeDetails | null> {
    const normalizedCode = code.trim().toUpperCase();
    const cachedDetails = this.getCachedDetails(normalizedCode);
    if (cachedDetails) {
      return of(cachedDetails);
    }

    return this.http
      .get<unknown>(
        `${this.settings.apiUrl}/price/promo-code/${encodeURIComponent(normalizedCode)}`,
      )
      .pipe(
        map(response => mapPromoCodeDetails(response)),
        tap(details => {
          if (details) {
            this.saveToCache(normalizedCode, details);
          }
        }),
        catchError(() => of(null)),
      );
  }

  removeFromCache(code: string): void {
    const normalizedCode = code.trim().toUpperCase();
    const store = this.readCacheStore();
    delete store.entries[normalizedCode];
    this.writeCacheStore(store);
  }

  private getCachedDetails(code: string): PromoCodeDetails | null {
    const store = this.readCacheStore();
    const entry = store.entries[code];
    if (!entry) {
      return null;
    }

    if (Date.now() - entry.cachedAt > promoCodeCacheTtlMs) {
      delete store.entries[code];
      this.writeCacheStore(store);
      return null;
    }

    const details = mapPromoCodeDetails(entry.details);
    if (!details) {
      delete store.entries[code];
      this.writeCacheStore(store);
      return null;
    }

    return details;
  }

  private saveToCache(code: string, details: PromoCodeDetails): void {
    const store = this.readCacheStore();
    store.entries[code] = {
      cachedAt: Date.now(),
      details,
    };
    this.writeCacheStore(store);
  }

  private readCacheStore(): PromoCodeCacheStore {
    try {
      const rawValue = localStorage.getItem(this.storageKey);
      if (!rawValue) {
        return { entries: {} };
      }

      const parsedValue = JSON.parse(rawValue) as unknown;
      if (!this.isPromoCodeCacheStore(parsedValue)) {
        localStorage.removeItem(this.storageKey);
        return { entries: {} };
      }

      return parsedValue;
    } catch {
      return { entries: {} };
    }
  }

  private writeCacheStore(store: PromoCodeCacheStore): void {
    if (Object.keys(store.entries).length === 0) {
      localStorage.removeItem(this.storageKey);
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(store));
  }

  private isPromoCodeCacheStore(value: unknown): value is PromoCodeCacheStore {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const store = value as PromoCodeCacheStore;
    return typeof store.entries === 'object' && store.entries !== null;
  }
}
