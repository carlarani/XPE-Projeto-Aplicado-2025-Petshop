import { Injectable } from '@angular/core';
import { CustomerModel } from '../models/customer.model';
import { PetModel } from '../models/pet.model';
import { PetType } from '../enums/pet-type';
import { PetSize } from '../enums/pet-size';
import { EmployeeModel } from '../models/employee.model';
import { Service } from '../enums/service';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  constructor() { }

  getCustomers(): CustomerModel[]{
    return [
      new CustomerModel('Client01', [new PetModel('Cujo', PetType.dog, PetSize.M)], 'debit' ),
      new CustomerModel('Client02', [new PetModel('Mia', PetType.dog, PetSize.S)], 'debit' ),
      new CustomerModel('Client03', [new PetModel('Aninha', PetType.dog, PetSize.L)], 'debit' ),
      new CustomerModel('Client04', [new PetModel('Stella', PetType.dog, PetSize.M)], 'debit' ),
      new CustomerModel('Client05', [new PetModel('Cacau', PetType.dog, PetSize.S)], 'debit' ),
      new CustomerModel('Client06', [new PetModel('Pulga', PetType.dog, PetSize.M)], 'debit' ),
      new CustomerModel('Client07', [new PetModel('Fifi', PetType.dog, PetSize.S)], 'debit' ),
    ]
  }

  getEmployees(): EmployeeModel[]{
    return [
      new EmployeeModel('Employee01', Service.bath),
      new EmployeeModel('Employee02', Service.grooming),
      new EmployeeModel('Employee03', Service.veterinary_doctor),
    ]
  }
}
