import { PetType } from "../enums/pet-type";
import { Service } from "../enums/service";

export class EmployeeModel {
  name: string;
  service: Service;

  constructor(name: string, service: Service){
    this.name=name;
    this.service=service;
  }
}
