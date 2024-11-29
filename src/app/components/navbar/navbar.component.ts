import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  authService = inject(AuthService);
  @Input() title: string = 'Dashboard';
  logout() {
    this.authService.logout();
  }
}
