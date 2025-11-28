import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RentalFormData } from '../models/equipment-rental.model';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class FormSubmissionService {
  private http = inject(HttpClient);
  private settings = inject(SettingsService);

  submitForm(data: RentalFormData): Observable<any> {
    return this.http.post(this.settings.webhookUrl, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  formatSubmitDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  formatTime(timeValue: string): string {
    if (!timeValue) return '00:00:00';
    return `${timeValue}:00`;
  }
}
