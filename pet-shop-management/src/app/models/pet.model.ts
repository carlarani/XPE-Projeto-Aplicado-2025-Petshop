import { PetSizeEnum } from "../enums/pet-size.enum";
import { PetTypeEnum } from "../enums/pet-type.enum";

export class PetModel {
  name: string;
  type: PetTypeEnum;
  size: PetSizeEnum;

  constructor(name: string, type: PetTypeEnum, size:PetSizeEnum){
    this.name=name;
    this.type=type;
    this.size=size
  }
}
