import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, InputTextModule, CardModule, ReactiveFormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private authService: AuthService, 
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  login() {
    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/']);
      }, 
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Login failed. Please check your credentials.'
        });
      }
    });
  }
}
