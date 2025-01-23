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
  items: MenuItem[] = [
    {
      label: 'Home',
      route: '/'
    },
    {
      label: 'Login',
      route: '/login'
    },
    {
      label: 'Logout',
      action: () => {
        this.authService.logout().subscribe({next: () => {
          this.router.navigate(['/login']);
        }});
      }
    },
  ]

  constructor(
    public globalService: GlobalService, 
    private authService: AuthService, 
    private router: Router
  ) {}

}
