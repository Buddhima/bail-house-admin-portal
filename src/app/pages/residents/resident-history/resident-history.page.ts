import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ResidentService } from '../../../core/services/resident.service';

@Component({
  selector: 'app-resident-history-page',
  imports: [CommonModule, DatePipe, RouterLink, TitleCasePipe],
  templateUrl: './resident-history.page.html',
})
export class ResidentHistoryPage {
  private readonly route = inject(ActivatedRoute);
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
  readonly signActions = computed(() =>
    this.residentService.getSignActionsForResident(this.residentId()),
  );
}
