import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-chat',
  imports: [CardModule, TextareaModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  conversation: {text: string, id: number, self: boolean}[] = [];
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    /*Dummy text*/
    this.conversation.push({text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
      Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero 
      asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!`, id: 0, self: false});
    this.form = this.fb.group({
      text: ['']
    });
  }

  send(){
    this.conversation.push({text: this.form.value.text, id: this.conversation.length, self: true});
    this.form.reset();
  }
}
