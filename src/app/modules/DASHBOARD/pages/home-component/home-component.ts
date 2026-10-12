import {Component, inject} from '@angular/core';
import {AuthStateService} from '../../../AUTH/services/auth-state-service';
import {AdminDashboard} from '../admin-dashboard/admin-dashboard';
import {CustomerDashboardComponent} from '../../../CUSTOMERS/customer-dashboard-component/customer-dashboard-component';

@Component({
  selector: 'app-home-component',
  imports: [
    AdminDashboard,
    CustomerDashboardComponent
  ],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  readonly authState = inject(AuthStateService);

}
