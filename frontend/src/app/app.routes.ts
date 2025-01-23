import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ChatRoomComponent } from './features/chat-room/chat-room.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
    { 
      path: '', 
      component: HomeComponent,
      canActivate: [authGuard]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { 
      path: 'chat-room/:id', 
      component: ChatRoomComponent,
      canActivate: [authGuard]
    },
];