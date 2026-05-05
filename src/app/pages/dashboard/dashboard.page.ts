import { Component, computed, inject } from '@angular/core';
import { RequestService } from '../../core/services/request.service';
import { ResidentService } from '../../core/services/resident.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
})
export class DashboardPage {
  private readonly requestService = inject(RequestService);
  private readonly residentService = inject(ResidentService);

  readonly pendingRequests = this.requestService.pendingRequests;
  readonly firstLevelApprovedRequests = this.requestService.firstLevelApprovedRequests;
  readonly activeResidents = computed(
    () =>
      this.residentService.residents().filter((resident) => resident.status === 'active').length,
  );
  readonly signedOutResidents = computed(
    () =>
      this.residentService.residents().filter((resident) => resident.checkInStatus === 'signed-out')
        .length,
  );
}
