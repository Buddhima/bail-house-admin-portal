import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Resident, ResidentStatus } from './core/models/resident.model';
import { RequestType } from './core/models/request.model';
import { AuthService } from './core/services/auth.service';
import { RequestService } from './core/services/request.service';
import { ResidentForm, ResidentService } from './core/services/resident.service';

type RequestFilter = 'all' | RequestType;
type PortalPage = 'dashboard' | 'requests' | 'residents' | 'new-resident' | 'resident-detail';

@Component({
  selector: 'app-root',
  imports: [CommonModule, DatePipe, FormsModule, TitleCasePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly requestService = inject(RequestService);
  private readonly residentService = inject(ResidentService);

  readonly session = this.authService.session;
  readonly pendingRequests = this.requestService.pendingRequests;
  readonly firstLevelApprovedRequests = this.requestService.firstLevelApprovedRequests;
  readonly requests = this.requestService.requests;
  readonly residents = this.residentService.residents;
  readonly requestFilter = signal<RequestFilter>('all');
  readonly currentPage = signal<PortalPage>('dashboard');
  readonly selectedResidentId = signal('');
  readonly selectedResident = computed(
    () => this.residents().find((resident) => resident.id === this.selectedResidentId()) ?? null,
  );

  readonly activeResidents = computed(() => this.residents().filter((resident) => resident.status === 'active').length);
  readonly signedOutResidents = computed(
    () => this.residents().filter((resident) => resident.checkInStatus === 'signed-out').length,
  );
  readonly absencePendingRequests = computed(() =>
    this.pendingRequests().filter((request) => request.type === 'absence'),
  );
  readonly visitorPendingRequests = computed(() =>
    this.pendingRequests().filter((request) => request.type === 'visitor'),
  );
  readonly showAbsenceRequests = computed(() => this.requestFilter() !== 'visitor');
  readonly showVisitorRequests = computed(() => this.requestFilter() !== 'absence');

  loginForm = {
    email: 'manager@bailhouse.local',
    password: 'password',
  };

  newResident: ResidentForm = this.createEmptyResidentForm();

  residentEditForm: ResidentForm & { status: ResidentStatus } = {
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

  loginError = signal('');

  login(): void {
    const loggedIn = this.authService.login(this.loginForm.email, this.loginForm.password);
    this.loginError.set(loggedIn ? '' : 'Enter a staff email and password.');
  }

  logout(): void {
    this.authService.logout();
    this.currentPage.set('dashboard');
    this.selectedResidentId.set('');
  }

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

  goToPage(page: PortalPage): void {
    this.currentPage.set(page);
  }

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
    this.currentPage.set('residents');
  }

  updateResidentStatus(residentId: string, status: ResidentStatus | string): void {
    this.residentService.updateStatus(residentId, status as ResidentStatus);
  }

  openResident(resident: Resident): void {
    this.selectedResidentId.set(resident.id);
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
    this.currentPage.set('resident-detail');
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
    this.currentPage.set('residents');
  }

  exportFirstLevelApprovedRequests(): void {
    const rows = [
      ['Request ID', 'Resident', 'Type', 'Submitted', 'Start', 'End', 'Reason', 'Notes'],
      ...this.firstLevelApprovedRequests().map((request) => [
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
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `first-level-approved-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
