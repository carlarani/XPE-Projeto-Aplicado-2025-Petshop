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
    return [
      new CustomerModel('Client01', [new PetModel('Cujo', PetTypeEnum.dog, PetSizeEnum.M)], 'debit' ),
      new CustomerModel('Client02', [new PetModel('Mia', PetTypeEnum.dog, PetSizeEnum.S)], 'debit' ),
      new CustomerModel('Client03', [new PetModel('Aninha', PetTypeEnum.dog, PetSizeEnum.L)], 'debit' ),
      new CustomerModel('Client04', [new PetModel('Stella', PetTypeEnum.dog, PetSizeEnum.M)], 'debit' ),
      new CustomerModel('Client05', [new PetModel('Cacau', PetTypeEnum.dog, PetSizeEnum.S)], 'debit' ),
      new CustomerModel('Client06', [new PetModel('Pulga', PetTypeEnum.dog, PetSizeEnum.M)], 'debit' ),
      new CustomerModel('Client07', [new PetModel('Fifi', PetTypeEnum.dog, PetSizeEnum.S)], 'debit' ),
    ]
  }

  getEmployees(): EmployeeModel[]{
    return [
      new EmployeeModel('Employee01', ServiceEnum.bath),
      new EmployeeModel('Employee02', ServiceEnum.grooming),
      new EmployeeModel('Employee03', ServiceEnum.veterinary_doctor),
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
