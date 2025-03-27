import { Guid } from 'guid-typescript';
import { PetModel } from './../models/pet.model';

export class CustomerModel {
  name: string;
  customerId: Guid;
  pets: PetModel[];

  constructor(name:string, pets:PetModel[]){
    this.name = name;
    this.customerId = Guid.create();
    this.pets = pets;
  }

}
