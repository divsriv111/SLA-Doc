import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChatService } from '../../core/services/chat/chat.service';
import { CreateNewPopupComponent } from '../create-new-popup/create-new-popup.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Pdf } from '../../core/models/pdf.model';
import { GlobalService } from '../../core/services/global/global.service';
import { Group } from '../../core/models/group.model';


@Component({
  selector: 'app-home',
  imports: [ButtonModule, CardModule, CreateNewPopupComponent, CommonModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  savedChats$: Observable<Pdf[]> | undefined;
  chatRooms$: Observable<Group[]> | undefined;
  visible: boolean = false;

  constructor(
    private router: Router, 
    private chatService: ChatService, 
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,  
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    this.globalService.chatTitle = '';
    this.savedChats$ = this.chatService.getPdfs();
    this.chatRooms$ = this.chatService.getChatRooms();
  }

  navigateToChat(id: string) {
    this.router.navigate([`/chat-room/${id}`]);
  }

  handleDelete(event: Event) {
    event.stopPropagation()
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Do you want to delete this chat?',
        header: 'Chat AI',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectButtonProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
        },
        acceptButtonProps: {
            label: 'Delete',
            severity: 'danger',
        },

        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        },
    });
  }
}
