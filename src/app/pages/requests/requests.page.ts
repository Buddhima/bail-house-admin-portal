import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RequestType } from '../../core/models/request.model';
import { LocationService } from '../../core/services/location.service';
import { RequestService } from '../../core/services/request.service';

type RequestFilter = 'all' | RequestType;

@Component({
  selector: 'app-requests-page',
  imports: [CommonModule, DatePipe, TitleCasePipe],
  templateUrl: './requests.page.html',
})
export class RequestsPage {
  private readonly locationService = inject(LocationService);
  private readonly requestService = inject(RequestService);

  readonly selectedLocation = this.locationService.selectedLocation;
  readonly pendingRequests = this.requestService.pendingRequests;
  readonly firstLevelApprovedRequests = this.requestService.firstLevelApprovedRequests;
  readonly requestFilter = signal<RequestFilter>('all');
  readonly absencePendingRequests = computed(() =>
    this.pendingRequests().filter((request) => request.type === 'absence'),
  );
  readonly visitorPendingRequests = computed(() =>
    this.pendingRequests().filter((request) => request.type === 'visitor'),
  );
  readonly showAbsenceRequests = computed(() => this.requestFilter() !== 'visitor');
  readonly showVisitorRequests = computed(() => this.requestFilter() !== 'absence');

  approveRequest(requestId: string): void {
    this.requestService.updateStatus(requestId, 'first-level-approved');
  }

  markExternalApproval(requestId: string): void {
    this.requestService.updateStatus(requestId, 'approved');
  }

  rejectRequest(requestId: string): void {
    this.requestService.updateStatus(requestId, 'rejected');
  }

  setRequestFilter(filter: RequestFilter): void {
    this.requestFilter.set(filter);
  }

  exportFirstLevelApprovedRequests(): void {
    const locationSlug = this.selectedLocation()
      .name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const rows = [
      ['Location', 'Request ID', 'Resident', 'Type', 'Submitted', 'Start', 'End', 'Reason', 'Notes'],
      ...this.firstLevelApprovedRequests().map((request) => [
        this.selectedLocation().name,
        request.id,
        request.residentName,
        request.type,
        request.submittedAt,
        request.startDate,
        request.endDate,
        request.reason,
        request.notes ?? '',
      ]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${locationSlug}-first-level-approved-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
