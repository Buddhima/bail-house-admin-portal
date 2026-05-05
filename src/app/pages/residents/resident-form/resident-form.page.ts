import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ResidentForm, ResidentService } from '../../../core/services/resident.service';

@Component({
  selector: 'app-resident-form-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './resident-form.page.html',
})
export class ResidentFormPage {
  private readonly residentService = inject(ResidentService);
  private readonly router = inject(Router);

  newResident: ResidentForm = this.createEmptyResidentForm();

  addResident(): void {
    if (!this.newResident.fullName.trim() || !this.newResident.room.trim()) {
      return;
    }

    this.residentService.addResident({
      fullName: this.newResident.fullName.trim(),
      room: this.newResident.room.trim(),
      caseWorker: this.newResident.caseWorker.trim() || 'Unassigned',
      phone: this.newResident.phone.trim() || 'Not provided',
      dateOfBirth: this.newResident.dateOfBirth,
      emergencyContactName: this.newResident.emergencyContactName.trim() || 'Not provided',
      emergencyContactPhone: this.newResident.emergencyContactPhone.trim() || 'Not provided',
      notes: this.newResident.notes.trim(),
    });

    this.newResident = this.createEmptyResidentForm();
    void this.router.navigate(['/residents']);
  }

  private createEmptyResidentForm(): ResidentForm {
    return {
      fullName: '',
      room: '',
      caseWorker: '',
      phone: '',
      dateOfBirth: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      notes: '',
    };
  }
}
