import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ResidentStatus } from '../../../core/models/resident.model';
import { ResidentForm, ResidentService } from '../../../core/services/resident.service';

@Component({
  selector: 'app-resident-detail-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './resident-detail.page.html',
})
export class ResidentDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly residentService = inject(ResidentService);
  private readonly residentId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('residentId') ?? '')),
    {
      initialValue: '',
    },
  );

  readonly selectedResident = computed(
    () =>
      this.residentService.residents().find((resident) => resident.id === this.residentId()) ??
      null,
  );

  residentEditForm: ResidentForm & { status: ResidentStatus } = this.createEmptyResidentEditForm();

  constructor() {
    effect(() => {
      const resident = this.selectedResident();

      if (!resident) {
        this.residentEditForm = this.createEmptyResidentEditForm();
        return;
      }

      this.residentEditForm = {
        fullName: resident.fullName,
        room: resident.room,
        caseWorker: resident.caseWorker,
        phone: resident.phone,
        dateOfBirth: resident.dateOfBirth,
        emergencyContactName: resident.emergencyContactName,
        emergencyContactPhone: resident.emergencyContactPhone,
        notes: resident.notes,
        status: resident.status,
      };
    });
  }

  saveResident(): void {
    const resident = this.selectedResident();

    if (!resident || !this.residentEditForm.fullName.trim() || !this.residentEditForm.room.trim()) {
      return;
    }

    this.residentService.updateResident(resident.id, {
      fullName: this.residentEditForm.fullName.trim(),
      room: this.residentEditForm.room.trim(),
      caseWorker: this.residentEditForm.caseWorker.trim() || 'Unassigned',
      phone: this.residentEditForm.phone.trim() || 'Not provided',
      dateOfBirth: this.residentEditForm.dateOfBirth,
      emergencyContactName: this.residentEditForm.emergencyContactName.trim() || 'Not provided',
      emergencyContactPhone: this.residentEditForm.emergencyContactPhone.trim() || 'Not provided',
      notes: this.residentEditForm.notes.trim(),
      status: this.residentEditForm.status,
    });
    void this.router.navigate(['/residents']);
  }

  private createEmptyResidentEditForm(): ResidentForm & { status: ResidentStatus } {
    return {
      fullName: '',
      room: '',
      caseWorker: '',
      phone: '',
      dateOfBirth: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      notes: '',
      status: 'active',
    };
  }
}
