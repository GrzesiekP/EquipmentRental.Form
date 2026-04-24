import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { environment } from '../environments/environment';
import { PRICE_CALCULATION_SERVICE } from './services/price-calculation.token';
import { CalculatePriceResponse } from './models/price-calculation.model';

describe('App', () => {
  const priceStub = {
    calculatePrice: () =>
      of<CalculatePriceResponse>({
        totalAmount: 0,
        startExtraFee: 0,
        endExtraFee: 0,
        weekendDiscount: false,
      }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PRICE_CALCULATION_SERVICE, useValue: priceStub },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne(environment.equipmentConfigUrl).flush([]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Formularz wypożyczenia sprzętu');
  });
});
