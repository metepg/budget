import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { MonthlyRecord } from '../../../models/MonthlyRecord';
import { Tooltip } from 'primeng/tooltip';
import { deepEqual } from '../../../utils/utils';
import MonthlyRecordType from '../../../enums/MonthlyRecordType';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entry-form',
  standalone: true,
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    Tooltip,
  ]
})
export class EntryFormComponent implements OnInit, OnChanges {
  @Input() records: MonthlyRecord[] = [];
  @Input() type: MonthlyRecordType;
  @Input() user: { username: string };
  @Output() entriesUpdated = new EventEmitter<MonthlyRecord[]>();
  @Output() removeEntryEmitter = new EventEmitter<MonthlyRecord>();
  saveBtnLabel: string;

  entryForm: FormGroup = this.fb.group({
    entries: this.fb.array([])
  });

  constructor(private fb: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.populateForm();
    this.saveBtnLabel = this.type === MonthlyRecordType.INCOME ? 'Tallenna vakiotulot' : 'Tallenna vakiomenot';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['records'] && !this.entryControls.length) {
      this.populateForm();
    }
  }

  get entryControls(): FormArray<FormGroup> {
    return this.entryForm.get('entries') as FormArray<FormGroup>;
  }

  populateForm(): void {
    this.entryControls.clear();
    this.records.forEach(record => {
      const group = this.createEntryGroup(record);
      group.disable();
      this.entryControls.push(group);
    });
  }

  // Accept a Partial<MonthlyRecord> so we can supply default values
  createEntryGroup(record: Partial<MonthlyRecord>): FormGroup {
    return this.fb.group({
      id: [record.id ?? null],
      username: [record.username ?? (this.user ? this.user.username : '')],
      type: [record.type ?? this.type],
      description: [ record.description || null, Validators.required],
      amount: [ record.amount || null, [Validators.required, Validators.min(0.01)]],
      recurring: [ record.recurring || true ],
      recordedAt: [record.recordedAt]
    });
  }

  addEntry(): void {
    this.router.navigate(['/bills/new']);
    this.entryControls.push(this.createEntryGroup({ description: '', amount: 0 }));
  }

  save(): void {
    if (this.entryForm.valid) {
      this.entryControls.controls.forEach(control => control.enable());
      this.entriesUpdated.emit(this.entryForm.value.entries);
      this.entryControls.controls.forEach(control => control.disable());
    }
  }

  get isDirty(): boolean {
    return !deepEqual(this.entryForm.getRawValue().entries, this.records);
  }

  edit(index: number): void {
    const bill = this.records[index];
    this.router.navigate([`/bills/${bill.id}`]);
    // const entry = this.entryControls.at(index);
    // const descriptionControl = entry.get('description');
    // const amountControl = entry.get('amount');
    //
    // if (descriptionControl?.disabled) {
    //   descriptionControl.enable();
    //   amountControl?.enable();
    // } else {
    //   descriptionControl?.disable();
    //   amountControl?.disable();
    // }
  }
}