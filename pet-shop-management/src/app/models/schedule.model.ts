import { PetModel } from './../models/pet.model';
import { EmployeeModel } from './employee.model';
import { CustomerModel } from './customer.model';
import { Guid } from 'guid-typescript';

export class ScheduleModel {
  id: Guid;
  date: Date;
  hour: string;
  customer: CustomerModel;
  pet: PetModel;
  employee: EmployeeModel;

  constructor(date:Date, hour: string, customer: CustomerModel, pet: PetModel, employee: EmployeeModel, id?: Guid){
    this.id = (id)? id : Guid.create();
    this.date = date;
    this.hour = hour;
    this.customer = customer;
    this.pet = pet;
    this.employee = employee;
  }
}
