import { ScheduleCalendarModel } from './../models/schedule-calendar.model';
import { MockService } from './../services/mock.service';
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingService } from '../services/scheduling.service';
import { DialogSchedulingComponent } from '../dialog-scheduling/dialog-scheduling.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScheduleModel } from '../models/schedule.model';
import { WeeklyCalendarModel } from '../models/weekly-calendar.model';
import { ServiceEnum } from "../enums/service.enum";
import { W } from '@angular/cdk/keycodes';
import { FormControl, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DialogData {
  date: Date;
  hour: string;
  unavailableServices:any[];
  schedule?: ScheduleModel;
}

@Component({
  selector: 'app-weekly-calendar',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule, MatIconModule, MatCardModule, MatCheckboxModule, FormsModule, MatInputModule, MatFormFieldModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weekly-calendar.component.html',
  styleUrl: './weekly-calendar.component.css'
})
export class WeeklyCalendarComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  serviceEnum = ServiceEnum;
  calendar2025: WeeklyCalendarModel[]=[];
  scheduleCalendar2025: ScheduleCalendarModel[]=[];
  filteredScheduleCalendar: ScheduleCalendarModel[]=[];
  week?: WeeklyCalendarModel;
  daysOfThisWeek: Date[]=[];
  firstDay = new Date(2025, 0, 1);
  dayCounter=1;
  selectedWeek=0;
  schedulingHours = ['08:00', '09:00', '10:00', '11:00','12:00', '13:00','14:00', '15:00','16:00', '17:00']
  schedules: ScheduleModel[]=[];
  bath_checked = true;
  grooming_checked = true;
  vet_checked = true;
  search = '';

  constructor(private mockService: MockService, private schedulingService: SchedulingService){
  }

  ngOnInit(): void {
    this.startSelectedWeekInfo();
    this.calendar2025 = this.schedulingService.buildCalendarByWeek();
    if(this.scheduleCalendar2025) this.scheduleCalendar2025 = this.schedulingService.buildScheduleCalendar();
    this.getSchedulesForSelectedWeek();

    this.search = localStorage.getItem('search') || '';
    if(this.search != '') this.filterByName();
  }

  private startSelectedWeekInfo() {
    if (!localStorage.getItem('selectedWeek')) {
      this.selectedWeek = 12;
      localStorage.setItem('selectedWeek', this.selectedWeek.toString());
    }
    else {
      this.selectedWeek = Number(localStorage.getItem('selectedWeek'));
    }
  }

  getSchedulesForSelectedWeek(): void{
    this.filteredScheduleCalendar = this.scheduleCalendar2025.filter(x=> x.week===this.selectedWeek)
  }

  addScheduling(date: Date, hour: string){
    const unavailableServices: any[] = this.updateUnavailableServices(date, hour);

    const dialogRef = this.dialog.open(DialogSchedulingComponent, {
        data: {date: date, hour: hour, unavailableServices: unavailableServices},
    });

    dialogRef.afterClosed().subscribe(result => {
      location.reload();
    });
  }

  private updateUnavailableServices(date: Date, hour: string) {
    const unavailableServices: any[] = [];
    this.scheduleCalendar2025.find(x => x.date === date && x.hour === hour)?.schedules.forEach(x => unavailableServices.push(x.employee.service)
    );
    return unavailableServices;
  }

  changeWeek(way:string){
    if(way==='+')
      this.selectedWeek++;
    else
      this.selectedWeek--;

    localStorage.setItem('selectedWeek', this.selectedWeek.toString());
    this.getSchedulesForSelectedWeek();
  }

  editScheduling(schedule: ScheduleModel){
    console.log('schedule',schedule);
    const index = this.scheduleCalendar2025.findIndex(x=> x.schedules.find( y=> y.id === schedule.id));
    console.log('index',index);

    const unavailableServices: any[] = this.updateUnavailableServices(schedule.date, schedule.hour);

    const dialogRef = this.dialog.open(DialogSchedulingComponent, {
      data: {date: schedule.date, hour: schedule.hour, unavailableServices: unavailableServices, schedule},
  });

    dialogRef.afterClosed().subscribe(result => {
      location.reload();
    });
  }

  filterByName(){
    console.log('filterByName')
    console.log('search', this.search);
    localStorage.setItem('search', this.search)
    this.getSchedulesForSelectedWeek()
    let backUpFilteredScheduleCalendar = this.filteredScheduleCalendar;
    this.filteredScheduleCalendar=[];
    backUpFilteredScheduleCalendar.forEach(x=>{
      this.filteredScheduleCalendar.push(new ScheduleCalendarModel(x.week, x.date, x.hour, x.schedules.filter(x=> x.customer.name.toLowerCase().includes(this.search.toLowerCase()) || x.pet.name.toLowerCase().includes(this.search.toLowerCase()))))
    })
  }
}
