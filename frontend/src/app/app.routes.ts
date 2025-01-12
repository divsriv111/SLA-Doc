import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ChatRoomComponent } from './features/chat-room/chat-room.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'chat-room/:id', component: ChatRoomComponent },
];
