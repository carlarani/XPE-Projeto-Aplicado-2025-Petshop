import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { DialogCustomerComponent } from '../dialog-customer/dialog-customer.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports:
    [MatIconModule,
    MatButtonModule,
    MatToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  readonly dialog = inject(MatDialog);

  addNewClient(){
    const dialogClientRef = this.dialog.open(DialogCustomerComponent);

    dialogClientRef.afterClosed().subscribe(result => {
      location.reload();
    });

  }
}
