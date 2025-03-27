import { Injectable } from '@angular/core';
import { CustomerModel } from '../models/customer.model';
import { PetModel } from '../models/pet.model';
import { EmployeeModel } from '../models/employee.model';
import { ScheduleModel } from '../models/schedule.model';
import { PetTypeEnum  } from '../enums/pet-type.enum';
import { PetSizeEnum } from '../enums/pet-size.enum';
import { ServiceEnum } from '../enums/service.enum';
import { ScheduleCalendarModel } from '../models/schedule-calendar.model';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  constructor() { }

  getCustomers(): CustomerModel[]{
    const newLocal = 'debit';
    return [
      new CustomerModel('Helena', [new PetModel('Cujo', PetTypeEnum.dog, PetSizeEnum.M), new PetModel('Mia', PetTypeEnum.dog, PetSizeEnum.S)]),
      new CustomerModel('Cecília', [new PetModel('Mia', PetTypeEnum.dog, PetSizeEnum.S)]),
      new CustomerModel('Maitê', [new PetModel('Aninha', PetTypeEnum.dog, PetSizeEnum.L)]),
      new CustomerModel('Miguel', [new PetModel('Stella', PetTypeEnum.dog, PetSizeEnum.M)]),
      new CustomerModel('Ravi', [new PetModel('Cacau', PetTypeEnum.dog, PetSizeEnum.S)]),
      new CustomerModel('Théo', [new PetModel('Pulga', PetTypeEnum.dog, PetSizeEnum.M)]),
      new CustomerModel('Noah', [new PetModel('Fifi', PetTypeEnum.dog, PetSizeEnum.S)]),
    ]
  }

  getEmployees(): EmployeeModel[]{
    return [
      new EmployeeModel('Alice', ServiceEnum.bath),
      new EmployeeModel('Arthur', ServiceEnum.grooming),
      new EmployeeModel('Samuel', ServiceEnum.veterinary_doctor),
    ]
  }

  getSchedules(): ScheduleModel[]{
    return [
      new ScheduleModel(new Date(2025, 2, 19), '09:00', this.getCustomers()[0], this.getCustomers()[0].pets[0], this.getEmployees()[0]),
      new ScheduleModel(new Date(2025, 2, 20), '11:00', this.getCustomers()[1], this.getCustomers()[1].pets[0], this.getEmployees()[1]),
      new ScheduleModel(new Date(2025, 2, 20), '15:00', this.getCustomers()[2], this.getCustomers()[2].pets[0], this.getEmployees()[2]),
      new ScheduleModel(new Date(2025, 2, 22), '14:00', this.getCustomers()[3], this.getCustomers()[3].pets[0], this.getEmployees()[0]),
    ]
  }
}
