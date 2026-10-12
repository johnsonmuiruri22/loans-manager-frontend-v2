import {Component, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthStateService} from './modules/AUTH/services/auth-state-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  protected readonly title
    = signal('loans-manager-frontend');
}
