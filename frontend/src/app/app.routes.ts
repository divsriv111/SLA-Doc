import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ChatRoomComponent } from './features/chat-room/chat-room.component';
import { LoginComponent } from './core/auth/login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'chat-room/:id', component: ChatRoomComponent },
];
