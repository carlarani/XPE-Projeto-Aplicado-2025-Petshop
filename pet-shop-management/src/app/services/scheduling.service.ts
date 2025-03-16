import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {

  constructor() { }

  addScheduling(day: Date, hour: string){
    console.log("schedule: ", day, hour)
  }
}
