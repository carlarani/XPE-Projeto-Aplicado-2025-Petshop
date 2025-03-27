import { CommonModule } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DialogData } from '../weekly-calendar/weekly-calendar.component';
import { PetTypeEnum } from '../enums/pet-type.enum';
import { PetSizeEnum } from '../enums/pet-size.enum';
import { PetModel } from '../models/pet.model';
import { MatIconModule } from '@angular/material/icon';
import { CustomerService } from '../services/customer.service';
import { CustomerModel } from '../models/customer.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-client',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './dialog-customer.component.html',
  styleUrl: './dialog-customer.component.css'
})
export class DialogCustomerComponent {
  readonly dialogRef = inject(MatDialogRef<DialogCustomerComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private _snackBar = inject(MatSnackBar);
  form: FormGroup;
  petForm1: FormGroup;
  petForm2: FormGroup;
  petForm3: FormGroup;
  petTypes = Object.values(PetTypeEnum);
  petSizes = Object.values(PetSizeEnum);
  petCount = 1;


  get enableAddButton(){
    switch(this.petCount) {
      case 1:
        return this.form.valid && this.petForm1.valid;
      case 2:
        return this.form.valid && this.petForm1.valid && this.petForm2.valid;
      case 3:
        return this.form.valid && this.petForm1.valid && this.petForm2.valid && this.petForm3.valid;
      default:
        return false;
    }
  }

  constructor(private formBuilder: FormBuilder, private customerService: CustomerService){
    this.form = this.formBuilder.group({
      id:null,
      name: [null, Validators.required],
      pets: [null],
    });
    this.petForm1 = this.formBuilder.group({
      name: [null, Validators.required],
      type: [null, Validators.required],
      size: [null, Validators.required],
    });
    this.petForm2 = this.formBuilder.group({
      name: [null, Validators.required],
      type: [null, Validators.required],
      size: [null, Validators.required],
    });
    this.petForm3 = this.formBuilder.group({
      name: [null, Validators.required],
      type: [null, Validators.required],
      size: [null, Validators.required],
    });
  }

  ngOnInit(){
  }

  addMorePet(){
    this.petCount++;
  }

  onAddClick(): void {
    this.customerService.addNewClient(this.buildCustomerObject());
    this._snackBar.open('Cliente cadastrado com sucesso', 'Fechar');
    this.dialogRef.close();
  }

  buildCustomerObject(): CustomerModel{
    const petsList = [];
    switch(this.petCount){
      case 1:
        petsList.push(this.buildPetObject(this.petForm1));
        break;
      case 2:
        petsList.push(this.buildPetObject(this.petForm1));
        petsList.push(this.buildPetObject(this.petForm2));
        break;
      case 3:
        petsList.push(this.buildPetObject(this.petForm1));
        petsList.push(this.buildPetObject(this.petForm2));
        petsList.push(this.buildPetObject(this.petForm3));
        break;
    }

    return new CustomerModel(this.form.controls['name'].value, petsList )
  }

  buildPetObject(petForm: any): PetModel{
      return new PetModel(petForm.controls['name'].value, petForm.controls['type'].value, petForm.controls['size'].value)
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
