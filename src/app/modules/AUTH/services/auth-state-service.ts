import {computed, inject, Injectable, signal} from '@angular/core';
import {AuthenticatedUser} from '../models/authenticated-user';
import {AuthService} from './auth-service';
import {finalize, Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private readonly authService = inject(AuthService);
  private readonly currentUserSignal =
    signal<AuthenticatedUser | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();

  private readonly initializedSignal = signal(false);
  readonly initialized = this.initializedSignal.asReadonly();

  readonly isAuthenticated = computed(()=>
  this.currentUserSignal()?.authenticated ?? false)

  readonly role = computed(() =>
    this.currentUserSignal()?.role ?? null)

  readonly mustChangePassword = computed(()=>
  this.currentUserSignal()?.mustChangePassword ?? false)

  readonly username = computed(()=>
  this.currentUserSignal()?.username ?? null)

  setUser(user: AuthenticatedUser): void {
    this.currentUserSignal.set(user);
  }

  clearUser(): void {
    this.currentUserSignal.set(null);
  }

  loadCurrentUser(): Observable<AuthenticatedUser> {
    return this.authService.me().pipe(
      tap(user => {
        this.setUser(user);
      })
    );
  }

  markInitialized(): void{
    this.initializedSignal.set(true);
  }
}
