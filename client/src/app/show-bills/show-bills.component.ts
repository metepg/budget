import { Component, OnInit } from '@angular/core';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { BillService } from '../../services/bill/bill.service';
import { AsyncPipe, CurrencyPipe, DatePipe, NgForOf } from '@angular/common';
import { Bill } from '../../models/Bill';
import { Observable } from 'rxjs';
import BillType from '../../enums/BillType';
import { Button } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-show-bills',
  templateUrl: './show-bills.component.html',
  styleUrls: ['./show-bills.component.css'],
  imports: [
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    AsyncPipe,
    NgForOf,
    CurrencyPipe,
    DatePipe,
    Button,
    Select,
    FormsModule
  ],
  standalone: true
})
export class ShowBillsComponent implements OnInit {
  bills$: Observable<Bill[]>;
  selectedMonth: number;
  months = [
    { label: 'Näytä kaikki', value: 99 },
    { label: 'Tammikuu', value: 1 },
    { label: 'Helmikuu', value: 2 },
    { label: 'Maaliskuu', value: 3 },
    { label: 'Huhtikuu', value: 4 },
    { label: 'Toukokuu', value: 5 },
    { label: 'Kesäkuu', value: 6 },
    { label: 'Heinäkuu', value: 7 },
    { label: 'Elokuu', value: 8 },
    { label: 'Syyskuu', value: 9 },
    { label: 'Lokakuu', value: 10 },
    { label: 'Marraskuu', value: 11 },
    { label: 'Joulukuu', value: 12 },
  ];

  constructor(
    private billService: BillService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.selectedMonth = params.get('month') ? +params.get('month')! : new Date().getMonth() + 1;
      this.bills$ = this.billService.getAllNotRecurring(this.selectedMonth);
    });
  }

  protected readonly BillType = BillType;

  edit(bill: Bill): void {
    this.router.navigate([`/bills/${bill.id}`]);
  }

  getBills() {
    this.bills$ = this.billService.getAllNotRecurring(this.selectedMonth);
  }

  setSelectedMonth() {
    this.localStorageService.setSelectedMonth(this.selectedMonth);
    return this.selectedMonth;
  }
}
