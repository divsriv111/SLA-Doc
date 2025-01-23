import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { GlobalService } from '../services/global/global.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Menubar, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {  
  title: string = '';
  items: MenuItem[] = [];

  constructor(
    public globalService: GlobalService, 
    private authService: AuthService, 
    private router: Router
  ) {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.updateMenuItems(isAuthenticated);
    });
  }

  private updateMenuItems(isAuthenticated: boolean) {
    this.items = [
      {
        label: 'Home',
        route: '/',
        visible: isAuthenticated
      },
      {
        label: 'Login',
        route: '/login',
        visible: !isAuthenticated
      },
      {
        label: 'Sign Up',
        route: '/register',
        visible: !isAuthenticated
      },
      {
        label: 'Logout',
        visible: isAuthenticated,
        action: () => {
          this.authService.logout().subscribe({
            next: () => {
              this.router.navigate(['/login']);
            }
          });
        }
      }
    ];
  }

}
