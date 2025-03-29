import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { User } from '../models/User';
import { NavbarComponent } from './navbar/navbar.component';
import { Bill } from '../models/Bill';
import { BillService } from '../services/bill/bill.service';
import { filter, switchMap, tap } from 'rxjs';
import { Toast } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, Toast, ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {

  user: User | null = null;
  records: Bill[] = [];

  constructor(
    private primengConfig: PrimeNG,
    private userService: UserService,
    private incomeService: BillService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.primengConfig.setTranslation({
      firstDayOfWeek: 1,
      dayNames: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"],
      dayNamesShort: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
      dayNamesMin: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
      monthNames: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"],
      monthNamesShort: ["Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä", "Heinä", "Elo", "Syys", "Loka", "Marras", "Joulu"],
      today: "Tänään",
      clear: "Tyhjennä",
    });
    const storedUser = this.localStorageService.getUser();
    if (storedUser) {
      this.incomeService.getAll().subscribe(records => {
        this.user = storedUser;
        this.records = records;
        this.router.navigate(['/bills/new']);
      });
    } else {
      this.fetchUserFromDatabase();
    }
  }

  private fetchUserFromDatabase(): void {
    this.userService.getUser().pipe(
      tap(user => {
        this.localStorageService.setUser(user)
        if (user.income === null) {
          this.router.navigate(['/profile']);
        }
      }),
      filter(user => !!user),
      switchMap(user =>
        this.incomeService.getAll().pipe(
          tap(records => {
            this.records = records;
            this.user = user;
          })
        )
      )
    ).subscribe({
      error: err => console.error('Error fetching user:', err)
    });
  }
}