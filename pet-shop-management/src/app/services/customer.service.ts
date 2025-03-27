import { Injectable, OnInit } from '@angular/core';
import { MockService } from './mock.service';
import { CustomerModel } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  customersList: any[]=[];

  constructor(private mockService: MockService) {
    this.customersList = this.getCustomers() || this.mockService.getCustomers();
  }

  addNewClient(customer: CustomerModel){
    this.customersList.push(customer);
    this.save();
  }

  save(){
    localStorage.setItem('customersList', JSON.stringify(this.customersList))
  }

  getCustomers(){
     const customersJSON = localStorage.getItem('customersList');
     return (customersJSON)? JSON.parse(customersJSON): '';
  }
}
