import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocationService } from '../../../core/services/location.service';
import { ResidentService } from '../../../core/services/resident.service';

@Component({
  selector: 'app-resident-list-page',
  imports: [CommonModule, RouterLink, TitleCasePipe],
  templateUrl: './resident-list.page.html',
})
export class ResidentListPage {
  private readonly locationService = inject(LocationService);
  private readonly residentService = inject(ResidentService);

  readonly selectedLocation = this.locationService.selectedLocation;
  readonly residents = this.residentService.residents;
}
