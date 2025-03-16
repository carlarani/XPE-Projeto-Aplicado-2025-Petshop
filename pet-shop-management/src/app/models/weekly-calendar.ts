import { Guid } from 'guid-typescript';
import { PetModel } from './../models/pet.model';

export class WeeklyCalendarModel {
  week: number;
  daysOfWeek: Date[];

  constructor(week:number, daysOfWeek:Date[]){
    this.week = week;
    this.daysOfWeek = daysOfWeek;
  }

}
