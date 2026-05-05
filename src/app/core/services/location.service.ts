import { Injectable, computed, signal } from '@angular/core';
import { BailHouseLocation } from '../models/location.model';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly selectedLocationIdState = signal('central-house');

  readonly locations = signal<BailHouseLocation[]>([
    {
      id: 'central-house',
      name: 'Central House',
      address: '18 Kauri Street',
    },
    {
      id: 'harbour-house',
      name: 'Harbour House',
      address: '42 Rimu Road',
    },
  ]).asReadonly();

  readonly selectedLocationId = this.selectedLocationIdState.asReadonly();
  readonly selectedLocation = computed(
    () =>
      this.locations().find((location) => location.id === this.selectedLocationId()) ??
      this.locations()[0],
  );

  selectLocation(locationId: string): void {
    const locationExists = this.locations().some((location) => location.id === locationId);

    if (locationExists) {
      this.selectedLocationIdState.set(locationId);
    }
  }
}
