import { PetSizeEnum } from "../enums/pet-size.enum";
import { PetTypeEnum } from "../enums/pet-type.enum";

export class PetModel {
  name: string;
  type: PetTypeEnum | undefined;
  size: PetSizeEnum | undefined;

  constructor(name?: string, type?: PetTypeEnum, size?:PetSizeEnum){
    this.name=name || '';
    this.type=type || undefined;
    this.size=size || undefined
  }
}
