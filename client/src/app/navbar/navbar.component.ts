import { Component, EventEmitter, Input, Output } from '@angular/core';
import { View } from '../../constants/View';
import { Button } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [ToastModule, ToolbarModule, Button, DecimalPipe]
})
export class NavbarComponent {
  protected readonly View = View;
  private routeMap = {
    [View.NEW_BILL]: 'create',
    [View.SHOW_BILLS]: 'bills',
    [View.SHOW_STATISTICS]: 'stats',
    [View.SHOW_PROFILE]: 'profile'
  };
  @Input() debtAmount: number;
  @Output() debtEmitter = new EventEmitter<void>();
  currentBudget = -500;

  constructor(private router: Router) {}

  showTab(view: View) {
    const route = this.routeMap[view] || '';
    console.log("navigate to", route)
    console.log("navigate to", view)
    this.router.navigate([route]);
  }

}
