import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { GlobalService } from '../services/global/global.service';

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

  constructor(public globalService: GlobalService) {}

}
