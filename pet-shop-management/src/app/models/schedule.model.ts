import { PetModel } from './../models/pet.model';
import { EmployeeModel } from './employee.model';
import { CustomerModel } from './customer.model';

export class ScheduleModel {
  date: Date;
  hour: string;
  customer: CustomerModel;
  pet: PetModel;
  employee: EmployeeModel;

  constructor(date:Date, hour: string, customer: CustomerModel, pet: PetModel, employee: EmployeeModel){
    this.date = date;
    this.hour = hour;
    this.customer = customer;
    this.pet = pet;
    this.employee = employee;
  }
}
