import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestConnectionService } from './test-service.service';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, NgClass, NgIf, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {

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