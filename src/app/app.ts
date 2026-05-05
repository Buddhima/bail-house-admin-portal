import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { LocationService } from './core/services/location.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, RouterOutlet, TitleCasePipe],
  templateUrl: './app.html',
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly locationService = inject(LocationService);
  private readonly router = inject(Router);

  readonly session = this.authService.session;
  readonly locations = this.locationService.locations;
  readonly selectedLocation = this.locationService.selectedLocation;
  readonly selectedLocationId = this.locationService.selectedLocationId;
  readonly loginError = signal('');

  loginForm = {
    email: 'manager@bailhouse.local',
    password: 'password',
  };

  login(): void {
    const loggedIn = this.authService.login(this.loginForm.email, this.loginForm.password);
    this.loginError.set(loggedIn ? '' : 'Enter a staff email and password.');

    if (loggedIn && this.router.url === '/') {
      void this.router.navigate(['/dashboard']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.loginError.set('');
    void this.router.navigate(['/dashboard']);
  }

  selectLocation(locationId: string): void {
    this.locationService.selectLocation(locationId);
  }
}
