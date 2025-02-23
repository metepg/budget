import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestConnectionService } from './test-service.service';
import { UserDetailsForm } from './user-details/user-details-form.component';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import { NavbarComponent } from './navbar/navbar.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserDetailsForm, NavbarComponent],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {

  isFirstLogin = signal<boolean | null>(null)
  isConnected = signal(false);
  user: WritableSignal<User | null> = signal(null);

  constructor(private superService: TestConnectionService, private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUser().subscribe({
      next: (u) => {
        this.user.set(u);
        this.isFirstLogin.set(u?.income == null);
      },
      error: (err) => console.error('Error fetching user:', err)
    });

    this.superService.testConnection().subscribe({
      next: (result) => this.isConnected.set(result),
      error: () => this.isConnected.set(false)
    });
  }
  onFirstLoginComplete() {
    this.isFirstLogin.set(false);
  }
}