import { Injectable, computed, inject, signal } from '@angular/core';
import { Resident, ResidentStatus } from '../models/resident.model';
import { LocationService } from './location.service';

export type ResidentForm = Pick<
  Resident,
  | 'fullName'
  | 'room'
  | 'caseWorker'
  | 'phone'
  | 'dateOfBirth'
  | 'emergencyContactName'
  | 'emergencyContactPhone'
  | 'notes'
>;

@Injectable({ providedIn: 'root' })
export class ResidentService {
  private readonly locationService = inject(LocationService);
  private readonly residentsState = signal<Resident[]>([
    {
      id: 'res-001',
      locationId: 'central-house',
      fullName: 'Ari Patel',
      room: 'A12',
      status: 'active',
      checkInStatus: 'in-house',
      caseWorker: 'Jamie Lee',
      phone: '021 555 013',
      dateOfBirth: '1994-08-14',
      emergencyContactName: 'Priya Patel',
      emergencyContactPhone: '021 555 113',
      notes: 'Prefers text reminders for appointments.',
      admissionDate: '2026-02-12',
    },
    {
      id: 'res-002',
      locationId: 'central-house',
      fullName: 'Sam Chen',
      room: 'B04',
      status: 'on-leave',
      checkInStatus: 'signed-out',
      caseWorker: 'Nina Brooks',
      phone: '021 555 014',
      dateOfBirth: '1988-11-02',
      emergencyContactName: 'Lena Chen',
      emergencyContactPhone: '021 555 114',
      notes: 'Medical appointments usually arranged through case worker.',
      admissionDate: '2026-03-08',
    },
    {
      id: 'res-003',
      locationId: 'central-house',
      fullName: 'Moana Williams',
      room: 'C07',
      status: 'active',
      checkInStatus: 'in-house',
      caseWorker: 'Jamie Lee',
      phone: '021 555 015',
      dateOfBirth: '1991-05-27',
      emergencyContactName: 'Ana Williams',
      emergencyContactPhone: '021 555 115',
      notes: 'Family visits are part of current support plan.',
      admissionDate: '2026-01-24',
    },
    {
      id: 'res-004',
      locationId: 'harbour-house',
      fullName: 'Tane Morgan',
      room: 'H03',
      status: 'active',
      checkInStatus: 'in-house',
      caseWorker: 'Owen Hart',
      phone: '021 555 016',
      dateOfBirth: '1990-02-18',
      emergencyContactName: 'Mere Morgan',
      emergencyContactPhone: '021 555 116',
      notes: 'Works afternoon shifts three days a week.',
      admissionDate: '2026-04-03',
    },
    {
      id: 'res-005',
      locationId: 'harbour-house',
      fullName: 'Leah Thompson',
      room: 'H09',
      status: 'on-leave',
      checkInStatus: 'signed-out',
      caseWorker: 'Nina Brooks',
      phone: '021 555 017',
      dateOfBirth: '1985-09-06',
      emergencyContactName: 'Mark Thompson',
      emergencyContactPhone: '021 555 117',
      notes: 'Weekly counselling transport coordinated by staff.',
      admissionDate: '2026-03-21',
    },
  ]);

  readonly residents = computed(() =>
    this.residentsState().filter(
      (resident) => resident.locationId === this.locationService.selectedLocationId(),
    ),
  );

  addResident(resident: ResidentForm): void {
    this.residentsState.update((residents) => [
      ...residents,
      {
        id: `res-${crypto.randomUUID().slice(0, 8)}`,
        locationId: this.locationService.selectedLocationId(),
        ...resident,
        status: 'active',
        checkInStatus: 'in-house',
        admissionDate: new Date().toISOString().slice(0, 10),
      },
    ]);
  }

  updateStatus(residentId: string, status: ResidentStatus): void {
    this.residentsState.update((residents) =>
      residents.map((resident) =>
        resident.id === residentId
          ? {
              ...resident,
              status,
              checkInStatus: status === 'on-leave' ? 'signed-out' : 'in-house',
            }
          : resident,
      ),
    );
  }

  updateResident(residentId: string, updates: ResidentForm & { status: ResidentStatus }): void {
    this.residentsState.update((residents) =>
      residents.map((resident) =>
        resident.id === residentId
          ? {
              ...resident,
              ...updates,
              checkInStatus: updates.status === 'on-leave' ? 'signed-out' : 'in-house',
            }
          : resident,
      ),
    );
  }
}
