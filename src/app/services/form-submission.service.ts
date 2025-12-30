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

  formatTime(timeValue: string | Date): string {
    if (!timeValue) return '00:00:00';

    let date: Date;

    if (timeValue instanceof Date) {
      date = timeValue;
    } else if (typeof timeValue === 'string') {
      const timeMatch = timeValue.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
      if (timeMatch) {
        const hours = timeMatch[1].padStart(2, '0');
        const minutes = timeMatch[2];
        const seconds = timeMatch[3] || '00';
        return `${hours}:${minutes}:${seconds}`;
      }
      date = new Date(timeValue);
      if (isNaN(date.getTime())) {
        return '00:00:00';
      }
    } else {
      return '00:00:00';
    }

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }
}
