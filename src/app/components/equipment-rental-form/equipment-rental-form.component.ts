import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../services/settings.service';
import { FormSubmissionService } from '../../services/form-submission.service';
import { RentalFormData, EquipmentItem } from '../../models/equipment-rental.model';

@Component({
  selector: 'app-equipment-rental-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './equipment-rental-form.component.html',
  styleUrl: './equipment-rental-form.component.css'
})
export class EquipmentRentalFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private formSubmissionService = inject(FormSubmissionService);
  settings = inject(SettingsService);

  rentalForm!: FormGroup;
  showSuccess = signal(false);
  feedbackMessage = signal('');
  feedbackType = signal<'success' | 'error'>('success');
  isSubmitting = signal(false);

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultDates();
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
      equipment: this.fb.array(
        this.settings.equipmentItems.map(() => 
          this.fb.group({
            quantity: [0, [Validators.min(0)]],
            notes: ['']
          })
        )
      )
    });
  }

  get equipmentArray(): FormArray {
    return this.rentalForm.get('equipment') as FormArray;
  }

  private setDefaultDates(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    this.rentalForm.patchValue({
      pickupDate: this.formatDateInput(tomorrow),
      returnDate: this.formatDateInput(dayAfterTomorrow)
    });
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

  incrementTime(fieldName: 'pickupHour' | 'returnHour'): void {
    const control = this.rentalForm.get(fieldName);
    if (!control) return;

    const timeValue = control.value || '00:00';
    const [hours, minutes] = timeValue.split(':').map(Number);
    let newMinutes = minutes + 15;
    let newHours = hours;

    if (newMinutes >= 60) {
      newMinutes = 0;
      newHours = (newHours + 1) % 24;
    }

    control.setValue(`${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`);
  }

  decrementTime(fieldName: 'pickupHour' | 'returnHour'): void {
    const control = this.rentalForm.get(fieldName);
    if (!control) return;

    const timeValue = control.value || '00:00';
    const [hours, minutes] = timeValue.split(':').map(Number);
    let newMinutes = minutes - 15;
    let newHours = hours;

    if (newMinutes < 0) {
      newMinutes = 45;
      newHours = (newHours - 1 + 24) % 24;
    }

    control.setValue(`${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`);
  }

  onSubmit(): void {
    if (this.rentalForm.invalid) {
      this.showFeedback('Proszę wypełnić wszystkie wymagane pola', 'error');
      this.markFormGroupTouched(this.rentalForm);
      return;
    }

    // Validate dates
    const pickupDate = new Date(this.rentalForm.value.pickupDate);
    const returnDate = new Date(this.rentalForm.value.returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    pickupDate.setHours(0, 0, 0, 0);

    if (pickupDate < today) {
      this.showFeedback('Data odbioru nie może być w przeszłości', 'error');
      return;
    }

    if (returnDate <= pickupDate) {
      this.showFeedback('Data zwrotu musi być późniejsza niż data odbioru', 'error');
      return;
    }

    this.isSubmitting.set(true);
    const formData = this.collectFormData();

    this.formSubmissionService.submitForm(formData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showSuccess.set(true);
      },
      error: (error) => {
        this.isSubmitting.set(false);
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
          type: this.settings.equipmentItems[index],
          quantity: quantity,
          comments: comments !== '' ? comments : null
        });
      }
    });

    return {
      submitDate: this.formSubmissionService.formatSubmitDate(new Date()),
      name: formValue.name.trim(),
      surname: formValue.surname.trim(),
      peselOrdId: formValue.peselOrdId.trim(),
      phone: formValue.phone.trim(),
      email: formValue.email.trim(),
      address: formValue.address.trim(),
      pickupDate: formValue.pickupDate,
      returnDate: formValue.returnDate,
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
