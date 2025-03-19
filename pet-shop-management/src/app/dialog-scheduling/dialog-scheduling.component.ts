import { SchedulingService } from './../services/scheduling.service';
import { MockService } from './../services/mock.service';
import { ChangeDetectionStrategy, Component, inject, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DialogData, WeeklyCalendarComponent } from '../weekly-calendar/weekly-calendar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScheduleModel } from '../models/schedule.model';

@Component({
  selector: 'app-dialog-scheduling',
  standalone: true,
  templateUrl: './dialog-scheduling.component.html',
  styleUrl: './dialog-scheduling.component.css',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, CommonModule,ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSchedulingComponent implements OnInit{
  readonly dialogRef = inject(MatDialogRef<WeeklyCalendarComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private _snackBar = inject(MatSnackBar);
  form: FormGroup;
  customersList: any[]=[];
  petsList: any[]=[];
  employeesList: any[]=[];


  constructor(private formBuilder: FormBuilder, private mockService: MockService, private datePipe: DatePipe, private schedulingService: SchedulingService){
    this.form = this.formBuilder.group({
      date: [null, Validators.required],
      hour: [null, Validators.required],
      customer: ['', Validators.required],
      pet: [null, Validators.required],
      employee: [null, Validators.required],
    });

    this.form.controls['customer'].valueChanges.subscribe(x => {
      this.petsList = this.form.controls['customer'].value.pets
    })
  }


  ngOnInit(){
    this.populateForm();
    this.customersList = this.mockService.getCustomers();
    this.employeesList = this.mockService.getEmployees().filter(x=> !this.data.unavailableServices.includes(x.service));
  }

populateForm(){
  this.form?.patchValue({
    date: this.datePipe.transform(this.data.date, 'dd/MM/yyyy'),
    hour: this.data.hour
  })
  this.form.controls['date'].disable();
  this.form.controls['hour'].disable();
}

schedule(){
  this.dialogRef.close();
  const message = 'Form Enviado';
  console.log(message,this.form)
  this.schedulingService.addScheduling(this.buildScheduleObject());
  this._snackBar.open(message, 'Fechar');
}

buildScheduleObject(){
  return new ScheduleModel(
    this.data.date,
    this.data.hour,
    this.form.controls['customer'].value,
    this.form.controls['pet'].value,
    this.form.controls['employee'].value)
}
}
