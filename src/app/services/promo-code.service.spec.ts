import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DiscountType } from '../models/promo-code.model';
import { PromoCodeService } from './promo-code.service';
import { SettingsService } from './settings.service';

describe('PromoCodeService', () => {
  let service: PromoCodeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        PromoCodeService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SettingsService, useValue: { apiUrl: '/api' } },
      ],
    });

    service = TestBed.inject(PromoCodeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('fetches promo code from API and caches it', () => {
    let result: unknown;

    service.resolvePromoCode('discount10').subscribe(value => {
      result = value;
    });

    const request = httpMock.expectOne('/api/price/promo-code/DISCOUNT10');
    expect(request.request.method).toBe('GET');
    request.flush({
      code: 'DISCOUNT10',
      type: DiscountType.Percentage,
      value: 10,
    });

    expect(result).toEqual({
      code: 'DISCOUNT10',
      type: DiscountType.Percentage,
      value: 10,
    });

    service.resolvePromoCode('DISCOUNT10').subscribe(value => {
      expect(value).toEqual({
        code: 'DISCOUNT10',
        type: DiscountType.Percentage,
        value: 10,
      });
    });

    httpMock.expectNone('/api/price/promo-code/DISCOUNT10');
  });

  it('returns null for unknown promo code', () => {
    let result: unknown;

    service.resolvePromoCode('UNKNOWN000').subscribe(value => {
      result = value;
    });

    const request = httpMock.expectOne('/api/price/promo-code/UNKNOWN000');
    request.flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(result).toBeNull();
  });

  it('removes promo code from cache', (done) => {
    service.resolvePromoCode('DISCOUNT10').subscribe();

    const request = httpMock.expectOne('/api/price/promo-code/DISCOUNT10');
    request.flush({
      code: 'DISCOUNT10',
      type: DiscountType.Percentage,
      value: 10,
    });

    service.removeFromCache('DISCOUNT10');

    service.resolvePromoCode('DISCOUNT10').subscribe(value => {
      expect(value).toEqual({
        code: 'DISCOUNT10',
        type: DiscountType.Percentage,
        value: 10,
      });
      done();
    });

    const secondRequest = httpMock.expectOne('/api/price/promo-code/DISCOUNT10');
    secondRequest.flush({
      code: 'DISCOUNT10',
      type: DiscountType.Percentage,
      value: 10,
    });
  });
});
