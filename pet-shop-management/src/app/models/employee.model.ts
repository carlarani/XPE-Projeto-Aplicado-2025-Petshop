import { PetTypeEnum } from "../enums/pet-type.enum";
import { ServiceEnum } from "../enums/service.enum";

export class EmployeeModel {
  name: string;
  service: ServiceEnum;

  constructor(name: string, service: ServiceEnum){
    this.name=name;
    this.service=service;
  }
}
