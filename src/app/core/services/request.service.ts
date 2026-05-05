import { Injectable, computed, inject, signal } from '@angular/core';
import { ResidentRequest, RequestStatus } from '../models/request.model';
import { LocationService } from './location.service';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private readonly locationService = inject(LocationService);
  private readonly requestsState = signal<ResidentRequest[]>([
    {
      id: 'req-1001',
      locationId: 'central-house',
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
      locationId: 'central-house',
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
      locationId: 'central-house',
      residentId: 'res-002',
      residentName: 'Sam Chen',
      type: 'absence',
      status: 'approved',
      submittedAt: '2026-04-29T11:20:00',
      startDate: '2026-05-03T10:00:00',
      endDate: '2026-05-03T12:00:00',
      reason: 'Medical appointment',
    },
    {
      id: 'req-1004',
      locationId: 'harbour-house',
      residentId: 'res-004',
      residentName: 'Tane Morgan',
      type: 'absence',
      status: 'pending',
      submittedAt: '2026-05-02T08:40:00',
      startDate: '2026-05-06T12:00:00',
      endDate: '2026-05-06T16:00:00',
      reason: 'Employment services appointment',
      notes: 'Staff to confirm return transport.',
    },
    {
      id: 'req-1005',
      locationId: 'harbour-house',
      residentId: 'res-005',
      residentName: 'Leah Thompson',
      type: 'visitor',
      status: 'first-level-approved',
      submittedAt: '2026-05-01T15:10:00',
      startDate: '2026-05-07T17:30:00',
      endDate: '2026-05-07T18:30:00',
      reason: 'Family support visit',
      notes: 'External approval requested by case worker.',
    },
  ]);

  readonly requests = computed(() =>
    this.requestsState().filter(
      (request) => request.locationId === this.locationService.selectedLocationId(),
    ),
  );
  readonly pendingRequests = computed(() =>
    this.requests().filter((request) => request.status === 'pending'),
  );
  readonly firstLevelApprovedRequests = computed(() =>
    this.requests().filter((request) => request.status === 'first-level-approved'),
  );

  updateStatus(requestId: string, status: RequestStatus): void {
    this.requestsState.update((requests) =>
      requests.map((request) => (request.id === requestId ? { ...request, status } : request)),
    );
  }
}
