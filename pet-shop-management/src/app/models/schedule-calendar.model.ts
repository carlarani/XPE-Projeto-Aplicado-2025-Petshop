import { Guid } from 'guid-typescript';
import { PetModel } from './pet.model';
import { ScheduleModel } from './schedule.model';

export class ScheduleCalendarModel {
  week: number;
  date: Date;
  hour: string;
  schedules: ScheduleModel[];


  constructor(week:number, date:Date, hour: string, schedules: ScheduleModel[]= []){
    this.week = week;
    this.date = date;
    this.hour = hour;
    this.schedules = schedules;
  }

}
