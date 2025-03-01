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
  saveBtnLabel: string;

  entryForm: FormGroup = this.fb.group({
    entries: this.fb.array([])
  });

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.populateForm();
    this.saveBtnLabel = this.type === MonthlyRecordType.INCOME ? 'Tallenna tulot' : 'Tallenna menot';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['records'] && !this.entryControls.length) {
      this.populateForm();
    }
  }

  get entryControls(): FormArray<FormGroup> {
    return this.entryForm.get('entries') as FormArray<FormGroup>;
  }

  get btnLabel(): string {
    return this.type === MonthlyRecordType.INCOME ? '+ Lisää tulo' : '+ Lisää meno';
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
      recordedAt: [record.recordedAt]
    });
  }

  addEntry(): void {
    this.entryControls.push(this.createEntryGroup({ description: '', amount: 0 }));
  }

  removeEntry(index: number): void {
    this.entryControls.removeAt(index);
  }

  save(): void {
    if (this.entryForm.valid) {
      this.entriesUpdated.emit(this.entryForm.value.entries);
    }
  }

  get isDirty(): boolean {
    return !deepEqual(this.entryForm.value.entries, this.records);
  }

  edit(index: number): void {
    const entry = this.entryControls.at(index);
    const descriptionControl = entry.get('description');
    const amountControl = entry.get('amount');

    if (descriptionControl?.disabled) {
      descriptionControl.enable();
      amountControl?.enable();
    } else {
      descriptionControl?.disable();
      amountControl?.disable();
    }
  }
}