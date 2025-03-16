import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { WeeklyCalendarModel } from '../models/weekly-calendar';
import { SchedulingService } from '../services/scheduling.service';
import { DialogSchedulingComponent } from '../dialog-scheduling/dialog-scheduling.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface DialogData {
  date: Date;
  hour: string;
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

  calendar2025: WeeklyCalendarModel[]=[];
  week?: WeeklyCalendarModel;
  daysOfThisWeek: Date[]=[];
  firstDay = new Date(2025, 0, 1);
  dayCounter=1;
  selectedWeek=12;
  schedulingHours = ['08:00', '09:00', '10:00', '11:00','12:00', '13:00','14:00', '15:00','16:00', '17:00',]

  constructor(private schedulingService: SchedulingService){

  }

  ngOnInit(): void {
    this.buildCalendarByWeek();
  }


  buildCalendarByWeek(){
    this.dayCounter = 1;
    for (let weekCounter = 1; weekCounter <= 53; weekCounter++) {
      this.daysOfThisWeek = [];
      for(let daysOfAWeek = 0; daysOfAWeek<7; daysOfAWeek++){
        this.firstDay = new Date(2025, 0, 1);
        if(weekCounter==1 && this.firstDay.getDay() != 0) {
          this.daysOfThisWeek.push(this.fixFirstWeekDayOfWeek(this.firstDay.getDay()));
        } else{
          this.daysOfThisWeek.push(new Date(this.firstDay.setDate(this.dayCounter)));
          this.dayCounter++;
        }
      }
      this.calendar2025.push(
        new WeeklyCalendarModel(weekCounter, this.daysOfThisWeek)
      )
    }
  }

  fixFirstWeekDayOfWeek(firstDayOfFirstWeek: number) : any {
    if(this.daysOfThisWeek.length<firstDayOfFirstWeek)
      return null
    else{
      this.dayCounter++;
      return new Date(this.firstDay.setDate(this.dayCounter-1));
    }
  }

  addScheduling(date: Date, hour: string){
    const dialogRef = this.dialog.open(DialogSchedulingComponent, {
        data: {date: date, hour: hour},
    });
  }
}
