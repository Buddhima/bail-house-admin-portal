import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResidentStatus } from './core/models/resident.model';
import { RequestType } from './core/models/request.model';
import { AuthService } from './core/services/auth.service';
import { RequestService } from './core/services/request.service';
import { NewResident, ResidentService } from './core/services/resident.service';

type RequestFilter = 'all' | RequestType;

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
  readonly requests = this.requestService.requests;
  readonly residents = this.residentService.residents;
  readonly requestFilter = signal<RequestFilter>('all');

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

  newResident: NewResident = {
    fullName: '',
    room: '',
    caseWorker: '',
    phone: '',
  };

  loginError = signal('');

  login(): void {
    const loggedIn = this.authService.login(this.loginForm.email, this.loginForm.password);
    this.loginError.set(loggedIn ? '' : 'Enter a staff email and password.');
  }

  logout(): void {
    this.authService.logout();
  }

  approveRequest(requestId: string): void {
    this.requestService.updateStatus(requestId, 'approved');
  }

  rejectRequest(requestId: string): void {
    this.requestService.updateStatus(requestId, 'rejected');
  }

  setRequestFilter(filter: RequestFilter): void {
    this.requestFilter.set(filter);
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
    });

    this.newResident = {
      fullName: '',
      room: '',
      caseWorker: '',
      phone: '',
    };
  }

  updateResidentStatus(residentId: string, status: ResidentStatus | string): void {
    this.residentService.updateStatus(residentId, status as ResidentStatus);
  }
}
