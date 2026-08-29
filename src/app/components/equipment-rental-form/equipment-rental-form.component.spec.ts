import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EquipmentRentalFormComponent } from './equipment-rental-form.component';
import { FormSubmissionService } from '../../services/form-submission.service';
import { SettingsService, EquipmentCategory, EquipmentSetting } from '../../services/settings.service';
import { PRICE_CALCULATION_SERVICE } from '../../services/price-calculation.token';
import { PromoCodeService } from '../../services/promo-code.service';
import { RentalFormStateService } from '../../services/rental-form-state.service';

const RETURN_DATE_ERROR = 'Data zwrotu musi być późniejsza niż data odbioru';
const PAST_PICKUP_ERROR = 'Data odbioru nie może być w przeszłości';

const equipmentItems: EquipmentSetting[] = [
  { id: 'czekan', displayName: 'Czekan', category: EquipmentCategory.Czekan, pricePerDay: 10 },
];

interface RentalPeriod {
  pickupDayOffset: number;
  pickupHour: string | Date;
  returnDayOffset: number;
  returnHour: string | Date;
}

describe('EquipmentRentalFormComponent date validation', () => {
  let component: EquipmentRentalFormComponent;
  let formSubmissionServiceMock: jasmine.SpyObj<FormSubmissionService>;

  beforeEach(async () => {
    formSubmissionServiceMock = jasmine.createSpyObj<FormSubmissionService>(
      'FormSubmissionService',
      ['submitForm', 'formatSubmitDate', 'formatTime'],
    );
    formSubmissionServiceMock.submitForm.and.returnValue(of({}));
    formSubmissionServiceMock.formatSubmitDate.and.returnValue('2026-08-30 12:00:00');
    formSubmissionServiceMock.formatTime.and.callFake((time: string | Date) =>
      typeof time === 'string' ? `${time}:00` : '16:00:00',
    );

    await TestBed.configureTestingModule({
      imports: [EquipmentRentalFormComponent],
      providers: [
        RentalFormStateService,
        { provide: FormSubmissionService, useValue: formSubmissionServiceMock },
        {
          provide: SettingsService,
          useValue: {
            equipmentItems,
            loadEquipmentItems: () => of(equipmentItems),
          },
        },
        {
          provide: PRICE_CALCULATION_SERVICE,
          useValue: { calculatePrice: () => of(null) },
        },
        {
          provide: PromoCodeService,
          useValue: { resolvePromoCode: () => of(null), removeFromCache: () => undefined },
        },
      ],
    })
      .overrideComponent(EquipmentRentalFormComponent, { set: { template: '', styles: [] } })
      .compileComponents();

    const fixture = TestBed.createComponent(EquipmentRentalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fillRequiredPersonalFields(component);
  });

  const validPeriods: [string, RentalPeriod][] = [
    [
      'same calendar day and pickup hour is before return hour',
      { pickupDayOffset: 1, pickupHour: '10:00', returnDayOffset: 1, returnHour: '18:00' },
    ],
    [
      'same calendar day today and pickup hour is before return hour',
      { pickupDayOffset: 0, pickupHour: '10:00', returnDayOffset: 0, returnHour: '18:00' },
    ],
    [
      'return is next day even when return hour is earlier',
      { pickupDayOffset: 1, pickupHour: '16:00', returnDayOffset: 2, returnHour: '10:00' },
    ],
    [
      'hours come from Date values used by the timepicker',
      { pickupDayOffset: 1, pickupHour: hourDate(10, 0), returnDayOffset: 1, returnHour: hourDate(10, 30) },
    ],
  ];

  validPeriods.forEach(([condition, period]) => {
    it(`onSubmit_SubmitsForm_WhenReturnDateTimeIsAfterPickupDateTime and ${condition}`, () => {
      // Arrange
      setRentalPeriod(component, period);

      // Act
      component.onSubmit();

      // Assert
      expect(formSubmissionServiceMock.submitForm).toHaveBeenCalledTimes(1);
      expect(component.feedbackMessage()).toBe('');
      expect(component.showSuccess()).toBeTrue();
    });
  });

  const invalidPeriods: [string, RentalPeriod][] = [
    [
      'same calendar day and hours are equal',
      { pickupDayOffset: 1, pickupHour: '16:00', returnDayOffset: 1, returnHour: '16:00' },
    ],
    [
      'same calendar day and pickup hour is after return hour',
      { pickupDayOffset: 1, pickupHour: '18:00', returnDayOffset: 1, returnHour: '10:00' },
    ],
    [
      'return calendar day is before pickup day',
      { pickupDayOffset: 2, pickupHour: '10:00', returnDayOffset: 1, returnHour: '18:00' },
    ],
    [
      'Date hours on the same day are equal',
      { pickupDayOffset: 1, pickupHour: hourDate(16, 0), returnDayOffset: 1, returnHour: hourDate(16, 0) },
    ],
  ];

  invalidPeriods.forEach(([condition, period]) => {
    it(`onSubmit_ShowsReturnDateError_WhenReturnDateTimeIsNotAfterPickupDateTime and ${condition}`, () => {
      // Arrange
      setRentalPeriod(component, period);

      // Act
      component.onSubmit();

      // Assert
      expect(formSubmissionServiceMock.submitForm).not.toHaveBeenCalled();
      expect(component.feedbackMessage()).toBe(RETURN_DATE_ERROR);
      expect(component.feedbackType()).toBe('error');
      expect(component.showSuccess()).toBeFalse();
    });
  });

  it('onSubmit_ShowsPastPickupError_WhenPickupDateIsBeforeToday', () => {
    // Arrange
    setRentalPeriod(component, {
      pickupDayOffset: -1,
      pickupHour: '10:00',
      returnDayOffset: 1,
      returnHour: '18:00',
    });

    // Act
    component.onSubmit();

    // Assert
    expect(formSubmissionServiceMock.submitForm).not.toHaveBeenCalled();
    expect(component.feedbackMessage()).toBe(PAST_PICKUP_ERROR);
    expect(component.showSuccess()).toBeFalse();
  });
});

function fillRequiredPersonalFields(component: EquipmentRentalFormComponent): void {
  component.rentalForm.patchValue({
    name: 'Jan',
    surname: 'Kowalski',
    peselOrdId: '12345678901',
    phone: '123456789',
    email: 'jan@example.com',
    address: 'Kraków',
  });
}

function setRentalPeriod(component: EquipmentRentalFormComponent, period: RentalPeriod): void {
  component.rentalForm.patchValue({
    pickupDate: dateFromToday(period.pickupDayOffset),
    pickupHour: period.pickupHour,
    returnDate: dateFromToday(period.returnDayOffset),
    returnHour: period.returnHour,
  });
}

function dateFromToday(dayOffset: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(0, 0, 0, 0);
  return date;
}

function hourDate(hours: number, minutes: number): Date {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}
