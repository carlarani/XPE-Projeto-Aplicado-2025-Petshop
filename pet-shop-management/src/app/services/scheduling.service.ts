import { Injectable, OnInit } from '@angular/core';
import { MockService } from './mock.service';
import { ScheduleModel } from '../models/schedule.model';
import { ScheduleCalendarModel } from '../models/schedule-calendar.model';
import { WeeklyCalendarModel } from '../models/weekly-calendar.model';

@Injectable({
  providedIn: 'root'
})
export class SchedulingService{
  schedules: ScheduleModel[]=[];
  objectName = 'scheduleCalendar';
  calendar2025: WeeklyCalendarModel[]=[];
  scheduleCalendar2025: ScheduleCalendarModel[]=[];
  filteredScheduleCalendar: ScheduleCalendarModel[]=[];
  schedulingHours = ['08:00', '09:00', '10:00', '11:00','12:00', '13:00','14:00', '15:00','16:00', '17:00']
  dayCounter=1;
  daysOfThisWeek: Date[]=[];
  firstDay = new Date(2025, 0, 1);


  constructor(private mockService: MockService) {
    this.buildCalendarByWeek();
  }


  buildCalendarByWeek(): WeeklyCalendarModel[]{
    const hasCalendar = localStorage.getItem('calendar2025');
    this.calendar2025 = hasCalendar ? JSON.parse(hasCalendar):[];
    if(hasCalendar) return this.calendar2025;

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
    localStorage.setItem('calendar2025', JSON.stringify(this.calendar2025))

    this.buildScheduleCalendar();
    return this.calendar2025
  }

  buildScheduleCalendar(): ScheduleCalendarModel[]{

    const hasScheduleCalendar = localStorage.getItem('scheduleCalendar');
    this.scheduleCalendar2025 = hasScheduleCalendar ? JSON.parse(hasScheduleCalendar):[];
    if(hasScheduleCalendar) return this.scheduleCalendar2025;

    this.calendar2025.forEach( elementWeek =>{
      elementWeek.daysOfWeek.forEach( elementDay => {
        if(elementDay!=null && elementDay.getFullYear()===2025){
          this.schedulingHours.forEach( elementHour => {
            this.scheduleCalendar2025.push(
              new ScheduleCalendarModel(elementWeek.week, elementDay, elementHour)
            );
          })
        }
      }
    )
  }
  )
  this.initMockSchedules();
  return this.scheduleCalendar2025
  }

  initMockSchedules(){
    const localStorageSchedules = localStorage.getItem(this.objectName) || null;
    if (!localStorageSchedules || JSON.parse(localStorageSchedules)?.length===0){
      this.schedules = this.mockService.getSchedules();
      this.schedules.forEach(x=>{
        console.log('FIND', this.scheduleCalendar2025.findIndex(y=> x.date.getFullYear()===y.date.getFullYear() && x.date.getMonth()===y.date.getMonth() && x.date.getDate()===y.date.getDate() && x.hour===y.hour))
        const index = this.scheduleCalendar2025.findIndex(y=> x.date.getFullYear()===y.date.getFullYear() && x.date.getMonth()===y.date.getMonth() && x.date.getDate()===y.date.getDate() && x.hour===y.hour);
        this.scheduleCalendar2025[index].schedules.push(x);
      }
      )
      this.save();
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

  save(){
   localStorage.removeItem(this.objectName);
   localStorage.setItem(this.objectName, JSON.stringify(this.scheduleCalendar2025));
  }

  addScheduling(schedule: ScheduleModel){
    const indexToEdit = this.scheduleCalendar2025.findIndex(x=> x.date===schedule.date && x.hour===schedule.hour)
    this.scheduleCalendar2025[indexToEdit].schedules.push(schedule)
    this.save()
  }

  getSchedules() : ScheduleCalendarModel[]{
    const schedules = localStorage.getItem(this.objectName);
    if(schedules == null)
      return [];
    else{
      let list = JSON.parse(schedules);
      list.forEach((element: { date: string | number | Date; }) => {
        element.date = new Date (element.date);
      });
      return list
    }
  }
}
