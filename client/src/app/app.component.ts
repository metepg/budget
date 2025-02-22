import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestConnectionService } from './test-service.service';
import { UserDetails } from './user-details/user-details';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserDetails],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {

  isFirstLogin = signal(true)
  isConnected = signal(false);

  constructor(private superService: TestConnectionService) {
  }

  ngOnInit() {
    this.superService.testConnection().subscribe({
      next: (result) => this.isConnected.set(result),
      error: () => this.isConnected.set(false)
    });
  }
}