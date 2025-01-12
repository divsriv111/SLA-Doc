import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-create-new-popup',
  imports: [ButtonModule, Dialog, InputTextModule],
  templateUrl: './create-new-popup.component.html',
  styleUrl: './create-new-popup.component.scss'
})
export class CreateNewPopupComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onSubmit: EventEmitter<string> = new EventEmitter<string>();

  closePopup() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  create(){
    this.onSubmit.emit('New Chat');
    this.closePopup();
  }
}
