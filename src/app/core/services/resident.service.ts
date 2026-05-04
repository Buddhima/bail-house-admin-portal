import { Injectable, signal } from '@angular/core';
import { Resident, ResidentStatus } from '../models/resident.model';

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
  private readonly residentsState = signal<Resident[]>([
    {
      id: 'res-001',
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
  ]);

  readonly residents = this.residentsState.asReadonly();

  addResident(resident: ResidentForm): void {
    this.residentsState.update((residents) => [
      ...residents,
      {
        id: `res-${crypto.randomUUID().slice(0, 8)}`,
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
