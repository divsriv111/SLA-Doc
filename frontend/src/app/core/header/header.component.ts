import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';

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
      label: 'Chat Room',
      route: '/chat-room'
    },
  ]

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => { 
      if (event instanceof NavigationEnd) {
         this.title = (event.url !== '/chat-room') ? '' : 'SLA Group Title';
      } 
    });
  }
}
