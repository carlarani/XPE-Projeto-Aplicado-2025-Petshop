import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenPayload } from '../models/token-payload.model';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  tokenPayload: TokenPayload | null = null;
  showDebugInfo = false; // Mude para true para ver informações de debug

  ngOnInit(): void {
    this.authService.tokenPayload.subscribe(payload => {
      this.tokenPayload = payload;
    });
  }

  hasScope(scope: string): boolean {
    return this.authService.hasScope(scope);
  }

  toggleDebugInfo(): void {
    this.showDebugInfo = !this.showDebugInfo;
  }
}
