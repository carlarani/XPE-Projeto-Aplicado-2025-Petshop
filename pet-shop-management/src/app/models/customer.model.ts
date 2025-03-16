import { Guid } from 'guid-typescript';
import { PetModel } from './../models/pet.model';

export class CustomerModel {
  name: string;
  customerId: Guid;
  pets: PetModel[];
  paymentMethod:string;

  constructor(name:string, pets:PetModel[], paymentMethod:string){
    this.name = name;
    this.customerId = Guid.create();
    this.pets = pets;
    this.paymentMethod = paymentMethod
  }

}
