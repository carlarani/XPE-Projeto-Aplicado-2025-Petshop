import { PetSize } from "../enums/pet-size";
import { PetType } from "../enums/pet-type";

export class PetModel {
  name: string;
  type: PetType;
  size: PetSize;

  constructor(name: string, type: PetType, size:PetSize){
    this.name=name;
    this.type=type;
    this.size=size
  }
}
