import { Injectable, signal } from '@angular/core';
import { Resident, ResidentStatus } from '../models/resident.model';

export type NewResident = Pick<Resident, 'fullName' | 'room' | 'caseWorker' | 'phone'>;

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
      admissionDate: '2026-01-24',
    },
  ]);

  readonly residents = this.residentsState.asReadonly();

  addResident(resident: NewResident): void {
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
}
