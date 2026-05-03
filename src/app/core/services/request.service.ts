import { Injectable, computed, signal } from '@angular/core';
import { ResidentRequest, RequestStatus } from '../models/request.model';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private readonly requestsState = signal<ResidentRequest[]>([
    {
      id: 'req-1001',
      residentId: 'res-001',
      residentName: 'Ari Patel',
      type: 'absence',
      status: 'pending',
      submittedAt: '2026-05-01T09:30:00',
      startDate: '2026-05-04T13:00:00',
      endDate: '2026-05-04T18:30:00',
      reason: 'Court appointment and legal aid meeting',
      notes: 'Resident has transport arranged with sister.',
    },
    {
      id: 'req-1002',
      residentId: 'res-003',
      residentName: 'Moana Williams',
      type: 'visitor',
      status: 'pending',
      submittedAt: '2026-05-02T14:15:00',
      startDate: '2026-05-05T16:00:00',
      endDate: '2026-05-05T17:00:00',
      reason: 'Approved family support visit',
      notes: 'Visitor ID to be checked at reception.',
    },
    {
      id: 'req-1003',
      residentId: 'res-002',
      residentName: 'Sam Chen',
      type: 'absence',
      status: 'approved',
      submittedAt: '2026-04-29T11:20:00',
      startDate: '2026-05-03T10:00:00',
      endDate: '2026-05-03T12:00:00',
      reason: 'Medical appointment',
    },
  ]);

  readonly requests = this.requestsState.asReadonly();
  readonly pendingRequests = computed(() => this.requestsState().filter((request) => request.status === 'pending'));

  updateStatus(requestId: string, status: RequestStatus): void {
    this.requestsState.update((requests) =>
      requests.map((request) => (request.id === requestId ? { ...request, status } : request)),
    );
  }
}
