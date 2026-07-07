import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_TIMEPICKER_CONFIG, MatTimepickerModule } from '@angular/material/timepicker';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EMPTY, Observable, catchError, debounceTime, finalize, merge, of, switchMap, tap } from 'rxjs';
import { SettingsService, EquipmentCategory } from '../../services/settings.service';
import { FormSubmissionService } from '../../services/form-submission.service';
import { RentalFormStateService } from '../../services/rental-form-state.service';
import { PRICE_CALCULATION_SERVICE } from '../../services/price-calculation.token';
import { PromoCodeService } from '../../services/promo-code.service';
import { RentalFormData, EquipmentItem } from '../../models/equipment-rental.model';
import { CalculatePriceRequest, CalculatePriceResponse } from '../../models/price-calculation.model';
import { PromoCodeDetails } from '../../models/promo-code.model';

const PROMO_CODE_PATTERN = /^[A-Za-z0-9]{10}$/;

@Component({
  selector: 'app-equipment-rental-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './equipment-rental-form.component.html',
  styleUrl: './equipment-rental-form.component.css',
  providers: [
    {
      provide: MAT_TIMEPICKER_CONFIG,
      useValue: {interval: '30 minutes'}
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'pl-PL'
    },
    provideNativeDateAdapter()
  ]
})
export class EquipmentRentalFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private formSubmissionService = inject(FormSubmissionService);
  private formStateService = inject(RentalFormStateService);
  private priceCalculationService = inject(PRICE_CALCULATION_SERVICE);
  private promoCodeService = inject(PromoCodeService);
  private destroyRef = inject(DestroyRef);
  settings = inject(SettingsService);

  rentalForm!: FormGroup;
  showSuccess = signal(false);
  feedbackMessage = signal('');
  feedbackType = signal<'success' | 'error'>('success');
  isSubmitting = signal(false);
  priceResult = signal<CalculatePriceResponse | null>(null);
  isPriceLoading = signal(false);
  isEquipmentLoading = signal(true);
  appliedPromoCode = signal<PromoCodeDetails | null>(null);
  isPromoCodeApplying = signal(false);

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultDates();
    this.loadEquipmentItems();
  }

  private initializeForm(): void {
    this.rentalForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      peselOrdId: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      pickupDate: ['', Validators.required],
      pickupHour: ['16:00', Validators.required],
      returnDate: ['', Validators.required],
      returnHour: ['16:00', Validators.required],
      promoCode: [''],
      equipment: this.fb.array([])
    });
  }

  isPromoApplyEnabled(): boolean {
    return PROMO_CODE_PATTERN.test(this.getTrimmedPromoCode()) && !this.isPromoCodeApplying();
  }

  showPromoClearActions(): boolean {
    return !!this.getTrimmedPromoCode() || !!this.appliedPromoCode();
  }

  showPromoFormatHint(): boolean {
    const code = this.getTrimmedPromoCode();
    return !!code && !PROMO_CODE_PATTERN.test(code);
  }

  getTrimmedPromoCode(): string {
    return (this.rentalForm.get('promoCode')?.value ?? '').trim();
  }

  private restoreAppliedPromoCodeInput(): void {
    const applied = this.appliedPromoCode();
    if (!applied) {
      return;
    }

    this.rentalForm.patchValue({ promoCode: applied.code }, { emitEvent: false });
  }

  private loadEquipmentItems(): void {
    this.settings.loadEquipmentItems()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.replaceEquipmentControls(items.length);
          this.setupStateSync();
          this.isEquipmentLoading.set(false);
        },
        error: () => {
          this.isEquipmentLoading.set(false);
          this.showFeedback('Nie udało się pobrać listy sprzętu. Odśwież stronę i spróbuj ponownie.', 'error');
        }
      });
  }

  private replaceEquipmentControls(itemsCount: number): void {
    const equipmentControls = Array.from({ length: itemsCount }, () =>
      this.fb.group({
        quantity: [0, [Validators.min(0)]],
        notes: ['']
      })
    );

    this.rentalForm.setControl('equipment', this.fb.array(equipmentControls));
  }

  get equipmentArray(): FormArray {
    return this.rentalForm.get('equipment') as FormArray;
  }

  private setDefaultDates(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    dayAfterTomorrow.setHours(0, 0, 0, 0);

    this.rentalForm.patchValue({
      pickupDate: tomorrow,
      returnDate: dayAfterTomorrow
    });
  }

  private setupStateSync(): void {
    this.equipmentArray.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.syncEquipmentState());

    merge(
      this.rentalForm.get('pickupDate')!.valueChanges,
      this.rentalForm.get('returnDate')!.valueChanges
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.syncDatesState());

    merge(
      this.rentalForm.get('pickupHour')!.valueChanges,
      this.rentalForm.get('returnHour')!.valueChanges
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.syncTimesState());

    merge(
      this.equipmentArray.valueChanges,
      this.rentalForm.get('pickupDate')!.valueChanges,
      this.rentalForm.get('returnDate')!.valueChanges,
      this.rentalForm.get('pickupHour')!.valueChanges,
      this.rentalForm.get('returnHour')!.valueChanges
    )
      .pipe(
        debounceTime(500),
        tap(() => this.isPriceLoading.set(true)),
        switchMap(() => this.fetchPrice()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(result => {
        this.applyPriceResult(result);
      });

    this.rentalForm
      .get('promoCode')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        if ((value ?? '').trim()) {
          return;
        }

        this.clearAppliedPromo(true);
      });
  }

  applyPromoCode(): void {
    const code = this.getTrimmedPromoCode().toUpperCase();
    if (!PROMO_CODE_PATTERN.test(code)) {
      return;
    }

    this.isPromoCodeApplying.set(true);
    this.promoCodeService
      .resolvePromoCode(code)
      .pipe(
        switchMap(details => {
          if (!details) {
            this.showFeedback('Nieprawidłowy kod zniżkowy', 'error');
            this.restoreAppliedPromoCodeInput();
            return EMPTY;
          }

          this.appliedPromoCode.set(details);
          this.rentalForm.patchValue({ promoCode: details.code }, { emitEvent: false });
          this.isPriceLoading.set(true);
          return this.fetchPrice();
        }),
        catchError(() => {
          this.showFeedback('Nie udało się zweryfikować kodu zniżkowego', 'error');
          this.restoreAppliedPromoCodeInput();
          return EMPTY;
        }),
        finalize(() => this.isPromoCodeApplying.set(false))
      )
      .subscribe(result => {
        this.applyPriceResult(result);
      });
  }

  clearPromoCode(): void {
    this.rentalForm.patchValue({ promoCode: '' }, { emitEvent: false });
    this.clearAppliedPromo(true);
  }

  private clearAppliedPromo(recalculate: boolean): void {
    const applied = this.appliedPromoCode();
    if (applied) {
      this.promoCodeService.removeFromCache(applied.code);
    }

    this.appliedPromoCode.set(null);

    if (!recalculate) {
      return;
    }

    const request = this.buildPriceRequest();
    if (!request) {
      this.applyPriceResult(null);
      return;
    }

    this.isPriceLoading.set(true);
    this.fetchPrice().subscribe(result => {
      this.applyPriceResult(result);
    });
  }

  private applyPriceResult(result: CalculatePriceResponse | null): void {
    this.isPriceLoading.set(false);
    this.priceResult.set(result);
    this.formStateService.updatePrice(result);
  }

  private syncEquipmentState(): void {
    const quantities = this.equipmentArray.controls.map((control, index) => ({
      displayName: this.settings.equipmentItems[index].displayName,
      category: this.settings.equipmentItems[index].category,
      quantity: control.get('quantity')?.value ?? 0,
    }));
    this.formStateService.updateEquipmentQuantities(quantities);
  }

  private syncDatesState(): void {
    const { pickupDate, returnDate } = this.rentalForm.value;
    this.formStateService.updateDates(
      pickupDate instanceof Date ? pickupDate : pickupDate ? new Date(pickupDate) : null,
      returnDate instanceof Date ? returnDate : returnDate ? new Date(returnDate) : null
    );
  }

  private syncTimesState(): void {
    const { pickupHour, returnHour } = this.rentalForm.value;
    this.formStateService.updateTimes(pickupHour ?? null, returnHour ?? null);
  }

  private fetchPrice(): Observable<CalculatePriceResponse | null> {
    const request = this.buildPriceRequest();
    if (!request) {
      return of(null);
    }
    return this.priceCalculationService.calculatePrice(request).pipe(
      catchError(() => of(null))
    );
  }

  private buildPriceRequest(): CalculatePriceRequest | null {
    const { pickupDate, returnDate, pickupHour, returnHour } = this.rentalForm.value;
    const startDate = this.combineDateAndTime(pickupDate, pickupHour);
    const endDate = this.combineDateAndTime(returnDate, returnHour);

    if (!startDate || !endDate) {
      return null;
    }

    const items = this.equipmentArray.controls
      .map((control, index) => ({
        categoryId: this.settings.equipmentItems[index].id,
        amount: (control.get('quantity')?.value ?? 0) as number,
      }))
      .filter(item => item.amount > 0 && item.categoryId !== null)
      .map(item => ({
        categoryId: item.categoryId,
        amount: item.amount,
      }));

    if (items.length === 0) {
      return null;
    }

    const request: CalculatePriceRequest = { items, startDate, endDate };
    const appliedPromoCode = this.appliedPromoCode();
    if (appliedPromoCode) {
      request.appliedPromoCode = appliedPromoCode;
    }

    return request;
  }

  private combineDateAndTime(date: Date | string | null, time: Date | string | null): string | null {
    if (!date || !time) {
      return null;
    }

    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return null;
    }

    if (time instanceof Date) {
      dateObj.setHours(time.getHours(), time.getMinutes(), 0, 0);
    } else {
      const match = time.match(/(\d{1,2}):(\d{2})/);
      if (!match) {
        return null;
      }
      dateObj.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);
    }

    return this.formatDateTimeLocal(dateObj);
  }

  private formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  private formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  incrementQuantity(index: number): void {
    const control = this.equipmentArray.at(index).get('quantity');
    if (control) {
      control.setValue((control.value || 0) + 1);
    }
  }

  decrementQuantity(index: number): void {
    const control = this.equipmentArray.at(index).get('quantity');
    if (control && control.value > 0) {
      control.setValue(control.value - 1);
    }
  }


  onSubmit(): void {
    if (this.rentalForm.invalid) {
      this.showFeedback('Proszę wypełnić wszystkie wymagane pola', 'error');
      this.markFormGroupTouched(this.rentalForm);
      return;
    }

    // Validate dates
    const pickupDate = this.rentalForm.value.pickupDate instanceof Date
      ? this.rentalForm.value.pickupDate
      : new Date(this.rentalForm.value.pickupDate);
    const returnDate = this.rentalForm.value.returnDate instanceof Date
      ? this.rentalForm.value.returnDate
      : new Date(this.rentalForm.value.returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    pickupDate.setHours(0, 0, 0, 0);
    returnDate.setHours(0, 0, 0, 0);

    if (pickupDate < today) {
      this.showFeedback('Data odbioru nie może być w przeszłości', 'error');
      return;
    }

    if (returnDate <= pickupDate) {
      this.showFeedback('Data zwrotu musi być późniejsza niż data odbioru', 'error');
      return;
    }

    this.isSubmitting.set(true);
    this.rentalForm.disable(); // Disable all form controls
    const formData = this.collectFormData();

    this.formSubmissionService.submitForm(formData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.rentalForm.enable(); // Re-enable form controls
        this.showSuccess.set(true);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.rentalForm.enable(); // Re-enable form controls
        console.error('Submission error:', error);
        this.showFeedback('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.', 'error');
      }
    });
  }

  private collectFormData(): RentalFormData {
    const formValue = this.rentalForm.value;
    const equipment: EquipmentItem[] = [];

    formValue.equipment.forEach((item: any, index: number) => {
      const quantity = parseInt(item.quantity, 10) || 0;
      const comments = item.notes?.trim() || '';

      if (quantity > 0 || comments !== '') {
        equipment.push({
          type: this.settings.equipmentItems[index].displayName,
          quantity: quantity,
          comments: comments !== '' ? comments : null
        });
      }
    });

    // Format dates from Date objects to strings
    const pickupDate = formValue.pickupDate instanceof Date
      ? this.formatDateInput(formValue.pickupDate)
      : formValue.pickupDate;

    const returnDate = formValue.returnDate instanceof Date
      ? this.formatDateInput(formValue.returnDate)
      : formValue.returnDate;

    return {
      submitDate: this.formSubmissionService.formatSubmitDate(new Date()),
      name: formValue.name.trim(),
      surname: formValue.surname.trim(),
      peselOrdId: formValue.peselOrdId.trim(),
      phone: formValue.phone.trim(),
      email: formValue.email.trim(),
      address: formValue.address.trim(),
      pickupDate: pickupDate,
      returnDate: returnDate,
      pickupHour: this.formSubmissionService.formatTime(formValue.pickupHour),
      returnHour: this.formSubmissionService.formatTime(formValue.returnHour),
      equipment: equipment
    };
  }

  private showFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage.set(message);
    this.feedbackType.set(type);

    setTimeout(() => {
      this.feedbackMessage.set('');
    }, 5000);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
