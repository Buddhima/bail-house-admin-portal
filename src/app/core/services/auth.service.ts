import { Injectable, signal } from '@angular/core';
import { StaffSession } from '../models/staff-session.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionState = signal<StaffSession | null>(null);

  readonly session = this.sessionState.asReadonly();

  login(email: string, password: string): boolean {
    if (!email.trim() || !password.trim()) {
      return false;
    }

    this.sessionState.set({
      id: 'staff-001',
      name: email.split('@')[0] || 'Staff Member',
      email,
      role: 'House Manager',
    });

    return true;
  }

  logout(): void {
    this.sessionState.set(null);
  }
}
