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
import { FormControl } from '@angular/forms';

export interface DialogData {
  date: Date;
  hour: string;
  unavailableServices:any[]
}

@Component({
  selector: 'app-weekly-calendar',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule, MatIconModule],
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

  constructor(private mockService: MockService, private schedulingService: SchedulingService){
  }

  ngOnInit(): void {
    this.startSelectedWeekInfo();
    this.calendar2025 = this.schedulingService.buildCalendarByWeek();
    if(this.scheduleCalendar2025) this.scheduleCalendar2025 = this.schedulingService.buildScheduleCalendar();
    this.getSchedulesForSelectedWeek();

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
    const unavailableServices: any[]=[];
    this.scheduleCalendar2025.find(x=> x.date===date && x.hour===hour)?.schedules.forEach(x=>
      unavailableServices.push(x.employee.service)
    )

    const dialogRef = this.dialog.open(DialogSchedulingComponent, {
        data: {date: date, hour: hour, unavailableServices: unavailableServices},
    });

    dialogRef.afterClosed().subscribe(result => {
      location.reload();
    });
  }

  changeWeek(way:string){
    if(way==='+')
      this.selectedWeek++;
    else
      this.selectedWeek--;

    localStorage.setItem('selectedWeek', this.selectedWeek.toString());
    this.getSchedulesForSelectedWeek();
  }
}
